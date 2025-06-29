"use client";

import type { Track, Artist } from "@/utils/supabase/global.types";
import { Card, Group, Stack, Text, Image, Badge, ActionIcon, Box, Tooltip, Menu, Modal, Button } from "@mantine/core";
import { formatDuration } from "@/lib/formatting";
import { IconPlayerPlay, IconPlayerPause, IconDots, IconTrash, IconEye, IconAlertTriangle } from "@tabler/icons-react";
import { useState, useContext } from "react";
import PlaybackContext from "@/lib/PlayerContext";
import { deleteTrackAction } from "@/app/tracks/actions";
import { notifications } from "@mantine/notifications";
import { useDisclosure } from "@mantine/hooks";

interface TrackProps {
  track: Track;
  artists?: Artist[];
  showPlayCount?: boolean;
  playCount?: number;
  variant?: "card" | "list" | "compact";
  onPlay?: () => void;
  canDelete?: boolean; // Whether the current user can delete this track
  onDelete?: () => void; // Callback after successful deletion
}

export function Track({
  track,
  artists = [],
  showPlayCount = false,
  playCount = 0,
  variant = "card",
  onPlay,
  canDelete = false,
  onDelete
}: TrackProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteModalOpened, { open: openDeleteModal, close: closeDeleteModal }] = useDisclosure(false);
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack } = useContext(PlaybackContext);

  // Check if this track is currently playing
  const isCurrentTrack = currentTrack?.id === track.id;
  const isTrackPlaying = isCurrentTrack && isPlaying;

  // Construct the image URL from Supabase storage
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/tracks/${track.id}`;

  const handlePlay = () => {
    if (isCurrentTrack) {
      // If this track is currently playing, pause it
      if (isPlaying) {
        pauseTrack();
      } else {
        // If this track is current but paused, resume it
        resumeTrack();
      }
    } else {
      // Play this track (will stop any currently playing track)
      playTrack(track.id);
    }
    onPlay?.();
  };

  const handleDelete = async () => {
    if (!canDelete || isDeleting) return;

    setIsDeleting(true);

    try {
      const result = await deleteTrackAction(track.id);

      if (result.success) {
        notifications.show({
          title: "Track deleted",
          message: "The track has been successfully deleted.",
          color: "green",
        });
        closeDeleteModal();
        onDelete?.();
      } else {
        notifications.show({
          title: "Delete failed",
          message: result.error || "Failed to delete track.",
          color: "red",
        });
      }
    } catch (error) {
      notifications.show({
        title: "Error",
        message: "An unexpected error occurred while deleting the track.",
        color: "red",
      });
    } finally {
      setIsDeleting(false);
    }
  };

  if (variant === "compact") {
    return (
      <Group justify="space-between" p="xs" style={{ borderRadius: 8 }} className="hover:bg-gray-50">
        <Group gap="sm">
          <Box
            style={{
              width: 40,
              height: 40,
              borderRadius: 4,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src={imageUrl}
              alt={`${track.title} cover`}
              width="100%"
              height="100%"
              radius="sm"
              fallbackSrc="https://via.placeholder.com/40x40?text=♪"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>
          <Box>
            <Text size="sm" fw={500} lineClamp={1}>{track.title}</Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {artists.map(artist => artist.name).join(", ") || "Unknown Artist"}
            </Text>
          </Box>
        </Group>
        <Group gap="xs">
          {showPlayCount && (
            <Text size="xs" c="dimmed">{playCount.toLocaleString()} plays</Text>
          )}
          <Text size="xs" c="dimmed">{formatDuration(track.duration)}</Text>
          <ActionIcon variant="subtle" size="sm" onClick={handlePlay}>
            {isTrackPlaying ? <IconPlayerPause size={14} /> : <IconPlayerPlay size={14} />}
          </ActionIcon>
          {canDelete && (
            <Menu shadow="md" width={120}>
              <Menu.Target>
                <ActionIcon variant="subtle" size="sm">
                  <IconDots size={14} />
                </ActionIcon>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  color="red"
                  leftSection={<IconTrash size={14} />}
                  onClick={openDeleteModal}
                  disabled={isDeleting}
                >
                  Delete
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          )}
        </Group>
      </Group>
    );
  }

  if (variant === "list") {
    return (
      <Card withBorder radius="md" p="md" className="hover:shadow-md transition-shadow">
        <Group justify="space-between" align="flex-start">
          <Group gap="md" style={{ flex: 1 }}>
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: 4,
                overflow: "hidden",
                flexShrink: 0,
              }}
            >
              <Image
                src={imageUrl}
                alt={`${track.title} cover`}
                width="100%"
                height="100%"
                radius="sm"
                fallbackSrc="https://via.placeholder.com/60x60?text=♪"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text fw={600} size="md" lineClamp={1}>{track.title}</Text>
              <Text size="sm" c="dimmed" lineClamp={1}>
                {artists.map(artist => artist.name).join(", ") || "Unknown Artist"}
              </Text>
              <Group gap="xs" mt={4}>
                <Badge size="xs" variant="light" color="blue">
                  {formatDuration(track.duration)}
                </Badge>
                {track.codec && (
                  <Badge size="xs" variant="light" color="gray">
                    {track.codec.toUpperCase()}
                  </Badge>
                )}
                {showPlayCount && (
                  <Text size="xs" c="dimmed">{playCount} plays</Text>
                )}
              </Group>
            </Box>
          </Group>
          <Group gap="xs">
            <Tooltip label={isTrackPlaying ? "Pause" : "Play"}>
              <ActionIcon variant="light" color="blue" onClick={handlePlay}>
                {isTrackPlaying ? <IconPlayerPause size={16} /> : <IconPlayerPlay size={16} />}
              </ActionIcon>
            </Tooltip>
            {canDelete && (
              <Menu shadow="md" width={120}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={openDeleteModal}
                    disabled={isDeleting}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>
        </Group>
      </Card>
    );
  }

  // Default card variant
  return (
    <Card
      withBorder
      shadow="sm"
      radius="lg"
      p="lg"
      className="hover:shadow-md transition-all duration-200"
      style={{ width: "100%", maxWidth: 400 }}
    >
      <Group align="flex-start" gap="lg">
        <Box style={{ position: "relative" }}>
          <Box
            style={{
              width: 100,
              height: 100,
              borderRadius: 8,
              overflow: "hidden",
              flexShrink: 0,
            }}
          >
            <Image
              src={imageUrl}
              alt={`${track.title} cover`}
              width="100%"
              height="100%"
              radius="md"
              fallbackSrc="https://via.placeholder.com/100x100?text=♪"
              style={{ objectFit: "cover", width: "100%", height: "100%" }}
            />
          </Box>
          <ActionIcon
            variant="filled"
            color="blue"
            size="lg"
            radius="xl"
            onClick={handlePlay}
            style={{
              position: "absolute",
              bottom: -8,
              right: -8,
              boxShadow: "0 2px 8px rgba(0,0,0,0.2)"
            }}
          >
            {isTrackPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
          </ActionIcon>
        </Box>

        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Group justify="space-between" align="flex-start">
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Text fw={700} size="lg" lineClamp={1}>{track.title}</Text>
              <Text size="md" c="dimmed" lineClamp={1}>
                {artists.map(artist => artist.name).join(", ") || "Unknown Artist"}
              </Text>
            </Box>
            {canDelete && (
              <Menu shadow="md" width={120}>
                <Menu.Target>
                  <ActionIcon variant="subtle" color="gray">
                    <IconDots size={16} />
                  </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                  <Menu.Item
                    color="red"
                    leftSection={<IconTrash size={14} />}
                    onClick={openDeleteModal}
                    disabled={isDeleting}
                  >
                    Delete
                  </Menu.Item>
                </Menu.Dropdown>
              </Menu>
            )}
          </Group>

          <Group gap="xs" wrap="wrap">
            <Badge color="blue" variant="light" size="sm">
              {formatDuration(track.duration)}
            </Badge>
            {track.codec && (
              <Badge color="gray" variant="light" size="sm">
                {track.codec.toUpperCase()}
              </Badge>
            )}
            {track.bitrate && (
              <Badge color="gray" variant="light" size="sm">
                {track.bitrate} kbps
              </Badge>
            )}
            {track.sample_rate && (
              <Badge color="gray" variant="light" size="sm">
                {(track.sample_rate / 1000).toFixed(1)}kHz
              </Badge>
            )}
            {showPlayCount && (
              <Badge color="green" variant="light" size="sm">
                <Group gap={4}>
                  <IconEye size={12} />
                  <Text size="xs">{playCount.toLocaleString()}</Text>
                </Group>
              </Badge>
            )}
          </Group>
        </Stack>
      </Group>

      {/* Delete Confirmation Modal */}
      <Modal
        opened={deleteModalOpened}
        onClose={closeDeleteModal}
        title="Delete Track"
        centered
        size="sm"
      >
        <Stack gap="md">
          <Group gap="sm">
            <IconAlertTriangle size={24} color="var(--mantine-color-red-6)" />
            <Box style={{ flex: 1 }}>
              <Text fw={500} size="sm">
                Are you sure you want to delete this track?
              </Text>
              <Text size="xs" c="dimmed" mt={4}>
                "{track.title}" will be permanently deleted and cannot be recovered.
              </Text>
            </Box>
          </Group>

          <Group justify="flex-end" gap="sm">
            <Button
              variant="default"
              onClick={closeDeleteModal}
              disabled={isDeleting}
            >
              Cancel
            </Button>
            <Button
              color="red"
              onClick={handleDelete}
              loading={isDeleting}
              leftSection={<IconTrash size={16} />}
            >
              Delete Track
            </Button>
          </Group>
        </Stack>
      </Modal>
    </Card>
  );
}

export default Track;