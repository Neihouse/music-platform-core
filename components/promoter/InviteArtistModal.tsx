"use client";

import { Modal, Stack, Title, Text, Group, Button, Avatar, Paper, Alert, Loader } from "@mantine/core";
import { IconUserPlus, IconCheck, IconX, IconAlertCircle } from "@tabler/icons-react";
import { useState } from "react";
import { inviteArtistAction } from "@/app/promoter/artists/actions";
import { notifications } from "@mantine/notifications";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  avatar_img: string | null;
  avatarUrl?: string | null;
  user_id: string;
}

interface InviteArtistModalProps {
  artist: Artist;
  opened: boolean;
  onClose: () => void;
}

const InviteArtistModal = ({ artist, opened, onClose }: InviteArtistModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInvite = async () => {
    setLoading(true);
    try {
      await inviteArtistAction(artist.id, artist.user_id);
      setSuccess(true);
      notifications.show({
        title: "Invitation Sent!",
        message: `Your invitation to ${artist.name} has been sent successfully.`,
        color: "green",
        icon: <IconCheck size={16} />,
      });
      
      // Auto-close after success
      setTimeout(() => {
        onClose();
        setSuccess(false); // Reset for next time
      }, 2000);
    } catch (error) {
      notifications.show({
        title: "Failed to Send Invitation",
        message: error instanceof Error ? error.message : "An unexpected error occurred.",
        color: "red",
        icon: <IconX size={16} />,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    onClose();
    setSuccess(false); // Reset for next time
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose}
      size="md"
      centered
      overlayProps={{
        backgroundOpacity: 0.55,
        blur: 3,
      }}
      title={
        <Group gap="sm">
          <IconUserPlus size={20} />
          <Title order={3}>Invite Artist</Title>
        </Group>
      }
    >
      <Stack gap="lg">
        {success ? (
          <Alert
            icon={<IconCheck size={20} />}
            title="Invitation Sent Successfully!"
            color="green"
            variant="light"
          >
            Your invitation to {artist.name} has been sent. They will be notified and can accept or decline your request.
          </Alert>
        ) : (
          <>
            {/* Artist Info */}
            <Paper p="md" radius="md" withBorder>
              <Group gap="md">
                <Avatar
                  src={artist.avatarUrl || artist.avatar_img}
                  size="lg"
                  radius="xl"
                >
                  {artist.name?.[0]?.toUpperCase()}
                </Avatar>
                <Stack gap="xs" style={{ flex: 1 }}>
                  <Title order={4}>{artist.name}</Title>
                  {artist.bio && (
                    <Text size="sm" c="dimmed" lineClamp={2}>
                      {artist.bio}
                    </Text>
                  )}
                </Stack>
              </Group>
            </Paper>

            {/* Invitation Details */}
            <Text size="sm" c="dimmed">
              You are inviting <strong>{artist.name}</strong> to join your promoter collective.
              Once they accept, you'll be able to collaborate on events and promotional activities together.
            </Text>

            <Alert
              icon={<IconAlertCircle size={16} />}
              title="Note"
              color="blue"
              variant="light"
            >
              The artist will receive a notification about your invitation and can choose to accept or decline it.
            </Alert>
          </>
        )}

        {/* Action Buttons */}
        <Group justify="flex-end" gap="sm">
          <Button
            variant="light"
            onClick={handleClose}
            disabled={loading}
          >
            {success ? "Close" : "Cancel"}
          </Button>
          {!success && (
            <Button
              onClick={handleInvite}
              loading={loading}
              leftSection={loading ? <Loader size={16} /> : <IconUserPlus size={16} />}
              color="green"
            >
              Send Invitation
            </Button>
          )}
        </Group>
      </Stack>
    </Modal>
  );
};

export default InviteArtistModal;
