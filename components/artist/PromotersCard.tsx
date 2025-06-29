"use client";

import { Card, Group, Title, Button, Stack, Avatar, Text, Badge, Paper, Center, ThemeIcon } from "@mantine/core";
import { IconUsers, IconUserPlus, IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { acceptPromoterInvitation, declinePromoterInvitation } from "@/app/artist/actions";
import { notifications } from "@mantine/notifications";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";

interface Promoter {
  id: string;
  name: string;
  bio: string | null;
  avatar_img: string | null;
  avatarUrl?: string | null;
}

interface PromoterInvitation {
  id: string;
  promoter: Promoter;
}

interface PromotersCardProps {
  promotersWithAvatars: Promoter[];
  invitationsWithAvatars: PromoterInvitation[];
}

export default function PromotersCard({ promotersWithAvatars, invitationsWithAvatars }: PromotersCardProps) {
  const [processingInvitations, setProcessingInvitations] = useState<Set<string>>(new Set());

  const handleAcceptInvitation = async (invitationId: string, promoterName: string) => {
    setProcessingInvitations(prev => new Set(prev).add(invitationId));
    try {
      await acceptPromoterInvitation(invitationId);
      notifications.show({
        title: "Invitation Accepted!",
        message: `You have joined ${promoterName}'s collective.`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      // Refresh the page to update the data
      window.location.reload();
    } catch (error) {
      notifications.show({
        title: "Failed to Accept Invitation",
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
        color: "red",
      });
    } finally {
      setProcessingInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
    }
  };

  const handleDeclineInvitation = async (invitationId: string, promoterName: string) => {
    setProcessingInvitations(prev => new Set(prev).add(invitationId));
    try {
      await declinePromoterInvitation(invitationId);
      notifications.show({
        title: "Invitation Declined",
        message: `You have declined ${promoterName}'s invitation.`,
        color: "orange",
        icon: <IconX size={16} />,
      });
      // Refresh the page to update the data
      window.location.reload();
    } catch (error) {
      notifications.show({
        title: "Failed to Decline Invitation",
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
        color: "red",
      });
    } finally {
      setProcessingInvitations(prev => {
        const newSet = new Set(prev);
        newSet.delete(invitationId);
        return newSet;
      });
    }
  };

  return (
    <Card p="xl" radius="lg" withBorder h="100%">
      <Group justify="space-between" mb="lg">
        <Title order={3}>Your Promoters</Title>
        <Button size="xs" variant="light" component={Link} href="/artist/promoters">View All</Button>
      </Group>
      
      {/* Show pending invitations first */}
      {invitationsWithAvatars.length > 0 && (
        <Stack gap="md" mb={promotersWithAvatars.length > 0 ? "lg" : 0}>
          <Group gap="xs">
            <IconUserPlus size={16} />
            <Text size="sm" fw={600} c="blue">
              Pending Invitations ({invitationsWithAvatars.length})
            </Text>
          </Group>
          {invitationsWithAvatars.slice(0, 2).map((invitation) => (
            <Paper key={invitation.id} p="md" radius="md" withBorder bg="blue.0">
              <Group>
                <Avatar
                  src={invitation.promoter.avatarUrl}
                  size="md"
                  radius="xl"
                >
                  {invitation.promoter.name?.[0]}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text fw={600}>{invitation.promoter.name}</Text>
                  <Text size="sm" c="dimmed" lineClamp={1}>
                    Wants you to join their collective
                  </Text>
                </div>
                <Stack gap="xs">
                  <Button
                    size="xs"
                    color="green"
                    leftSection={<IconCheck size={12} />}
                    onClick={() => handleAcceptInvitation(invitation.id, invitation.promoter.name)}
                    loading={processingInvitations.has(invitation.id)}
                    style={{ fontSize: "0.75rem" }}
                  >
                    Accept
                  </Button>
                  <Button
                    size="xs"
                    variant="light"
                    color="red"
                    leftSection={<IconX size={12} />}
                    onClick={() => handleDeclineInvitation(invitation.id, invitation.promoter.name)}
                    loading={processingInvitations.has(invitation.id)}
                    style={{ fontSize: "0.75rem" }}
                  >
                    Decline
                  </Button>
                </Stack>
              </Group>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Existing promoters */}
      {promotersWithAvatars.length > 0 ? (
        <Stack gap="md">
          {invitationsWithAvatars.length > 0 && (
            <Group gap="xs">
              <IconUsers size={16} />
              <Text size="sm" fw={600} c="dimmed">
                Current Promoters
              </Text>
            </Group>
          )}
          {promotersWithAvatars.slice(0, 3).map((promoter) => (
            <Paper key={promoter.id} p="md" radius="md" withBorder>
              <Group>
                <Avatar
                  src={promoter.avatarUrl}
                  size="md"
                  radius="xl"
                >
                  {promoter.name?.[0]}
                </Avatar>
                <div style={{ flex: 1 }}>
                  <Text fw={600}>{promoter.name}</Text>
                  <Text size="sm" c="dimmed" lineClamp={1}>
                    {promoter.bio || "No bio available"}
                  </Text>
                </div>
              </Group>
            </Paper>
          ))}
        </Stack>
      ) : invitationsWithAvatars.length === 0 ? (
        <Center py="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <IconUsers size={30} />
            </ThemeIcon>
            <Text c="dimmed" ta="center">No promoters in your network yet</Text>
            <Button size="sm" variant="light" component={Link} href="/artist/promoters">Find Promoters</Button>
          </Stack>
        </Center>
      ) : null}
    </Card>
  );
}
