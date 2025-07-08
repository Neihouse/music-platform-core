"use client";

import { acceptPromoterInvitation, declinePromoterInvitation } from "@/app/artist/actions";
import { Avatar, Button, Card, Center, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconUserPlus, IconUsers, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";

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
    <Card p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} radius="lg" withBorder h="100%">
      <Group justify="space-between" mb={{ base: "sm", sm: "md", md: "lg" }} wrap="nowrap">
        <Title order={3} size="lg" hiddenFrom="sm">Your Promoters</Title>
        <Title order={3} size="xl" visibleFrom="sm">Your Promoters</Title>
        <Button size="xs" variant="light" component={Link} href="/artist/promoters">View All</Button>
      </Group>

      {/* Show pending invitations first */}
      {invitationsWithAvatars.length > 0 && (
        <Stack gap="xs" mb={promotersWithAvatars.length > 0 ? "sm" : 0} hiddenFrom="sm">
          <Group gap="xs">
            <IconUserPlus size={16} />
            <Text size="sm" fw={600} c="blue">
              Pending Invitations ({invitationsWithAvatars.length})
            </Text>
          </Group>
          {invitationsWithAvatars.slice(0, 2).map((invitation) => (
            <Paper key={invitation.id} p="xs" radius="md" withBorder bg="blue.0">
              <Stack gap="sm">
                <Group gap="sm" wrap="nowrap">
                  <Avatar
                    src={invitation.promoter.avatarUrl}
                    size="sm"
                    radius="xl"
                  >
                    {invitation.promoter.name?.[0]}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={600} lineClamp={1} size="sm">{invitation.promoter.name}</Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      Wants you to join
                    </Text>
                  </div>
                </Group>
                <Group gap="xs" justify="flex-end" wrap="wrap">
                  <Button
                    size="xs"
                    color="green"
                    leftSection={<IconCheck size={12} />}
                    onClick={() => handleAcceptInvitation(invitation.id, invitation.promoter.name)}
                    loading={processingInvitations.has(invitation.id)}
                    style={{ fontSize: "0.7rem", flex: "1 1 auto" }}
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
                    style={{ fontSize: "0.7rem", flex: "1 1 auto" }}
                  >
                    Decline
                  </Button>
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {invitationsWithAvatars.length > 0 && (
        <Stack gap="md" mb={promotersWithAvatars.length > 0 ? "lg" : 0} visibleFrom="sm">
          <Group gap="xs">
            <IconUserPlus size={16} />
            <Text size="sm" fw={600} c="blue">
              Pending Invitations ({invitationsWithAvatars.length})
            </Text>
          </Group>
          {invitationsWithAvatars.slice(0, 2).map((invitation) => (
            <Paper key={invitation.id} p={{ base: "sm", md: "md" }} radius="md" withBorder bg="blue.0">
              <Stack gap="sm">
                <Group gap="sm" wrap="nowrap">
                  <Avatar
                    src={invitation.promoter.avatarUrl}
                    size="md"
                    radius="xl"
                  >
                    {invitation.promoter.name?.[0]}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={600} lineClamp={1}>{invitation.promoter.name}</Text>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      Wants you to join their collective
                    </Text>
                  </div>
                </Group>
                <Group gap="xs" justify="flex-end">
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
                </Group>
              </Stack>
            </Paper>
          ))}
        </Stack>
      )}

      {/* Existing promoters */}
      {promotersWithAvatars.length > 0 ? (
        <>
          <Stack gap="xs" hiddenFrom="sm">
            {invitationsWithAvatars.length > 0 && (
              <Group gap="xs">
                <IconUsers size={16} />
                <Text size="sm" fw={600} c="dimmed">
                  Current Promoters
                </Text>
              </Group>
            )}
            {promotersWithAvatars.slice(0, 3).map((promoter) => (
              <Paper key={promoter.id} p="xs" radius="md" withBorder>
                <Group gap="sm" wrap="nowrap">
                  <Avatar
                    src={promoter.avatarUrl}
                    size="sm"
                    radius="xl"
                  >
                    {promoter.name?.[0]}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={600} lineClamp={1} size="sm">{promoter.name}</Text>
                    <Text size="xs" c="dimmed" lineClamp={1}>
                      {promoter.bio ? (promoter.bio.length > 25 ? promoter.bio.substring(0, 25) + "..." : promoter.bio) : "No bio"}
                    </Text>
                  </div>
                </Group>
              </Paper>
            ))}
          </Stack>
          <Stack gap="md" visibleFrom="sm">
            {invitationsWithAvatars.length > 0 && (
              <Group gap="xs">
                <IconUsers size={16} />
                <Text size="sm" fw={600} c="dimmed">
                  Current Promoters
                </Text>
              </Group>
            )}
            {promotersWithAvatars.slice(0, 3).map((promoter) => (
              <Paper key={promoter.id} p={{ base: "sm", md: "md" }} radius="md" withBorder>
                <Group gap="sm" wrap="nowrap">
                  <Avatar
                    src={promoter.avatarUrl}
                    size="md"
                    radius="xl"
                  >
                    {promoter.name?.[0]}
                  </Avatar>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Text fw={600} lineClamp={1}>{promoter.name}</Text>
                    <Text size="sm" c="dimmed" lineClamp={1}>
                      {promoter.bio || "No bio available"}
                    </Text>
                  </div>
                </Group>
              </Paper>
            ))}
          </Stack>
        </>
      ) : invitationsWithAvatars.length === 0 ? (
        <Center py="lg" hiddenFrom="sm">
          <Stack align="center" gap="sm">
            <ThemeIcon size={40} radius="xl" variant="light" color="gray">
              <IconUsers size={20} />
            </ThemeIcon>
            <Text c="dimmed" ta="center" size="sm">No promoters yet</Text>
            <Button size="sm" variant="light" component={Link} href="/artist/promoters">Find Promoters</Button>
          </Stack>
        </Center>
      ) : null}

      {promotersWithAvatars.length === 0 && invitationsWithAvatars.length === 0 && (
        <Center py="xl" visibleFrom="sm">
          <Stack align="center" gap="md">
            <ThemeIcon size={60} radius="xl" variant="light" color="gray">
              <IconUsers size={30} />
            </ThemeIcon>
            <Text c="dimmed" ta="center">No promoters in your network yet</Text>
            <Button size="sm" variant="light" component={Link} href="/artist/promoters">Find Promoters</Button>
          </Stack>
        </Center>
      )}
    </Card>
  );
}
