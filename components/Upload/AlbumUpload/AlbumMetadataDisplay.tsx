"use client";
import {
  ActionIcon,
  Button,
  Group,
  NumberInput,
  Stack,
  Text,
  TextInput,
  Badge,
  Box,
  Title
} from "@mantine/core";
import { IconTrash, IconMusic } from "@tabler/icons-react";
import { AlbumTrackWithMetadata } from "./AlbumUploader";
import { formatDuration } from "@/lib/formatting";

export interface IAlbumMetadataDisplayProps {
  track: AlbumTrackWithMetadata;
  onDelete: () => void;
  onUpdate: (key: string, value: string) => void;
  onTrackNumberUpdate: (trackNumber: number) => void;
  isMobile?: boolean;
}

export function AlbumMetadataDisplay({
  track,
  onDelete,
  onUpdate,
  onTrackNumberUpdate,
  isMobile = false
}: IAlbumMetadataDisplayProps) {
  const { metadata, file, trackNumber } = track;
  const { common, format } = metadata;

  return (
    <Group align="flex-start" gap={isMobile ? "md" : "xl"} wrap={isMobile ? "wrap" : "nowrap"}>
      {/* Track Number */}
      <Box miw={80}>
        <NumberInput
          label="Track #"
          value={trackNumber || 1}
          onChange={(value) => onTrackNumberUpdate(Number(value) || 1)}
          min={1}
          max={99}
          size={isMobile ? "sm" : "md"}
          w={80}
        />
      </Box>

      {/* Track Info */}
      <Stack flex={1} gap="sm">
        <Group justify="space-between" align="flex-start">
          <Group align="center" gap="xs">
            <IconMusic size={16} />
            <Title order={5}>{file.name}</Title>
          </Group>
          <ActionIcon
            variant="light"
            color="red"
            onClick={onDelete}
            size={isMobile ? "sm" : "md"}
          >
            <IconTrash size={16} />
          </ActionIcon>
        </Group>

        {/* Metadata Form */}
        <Group grow wrap={isMobile ? "wrap" : "nowrap"}>
          <TextInput
            label="Title"
            placeholder="Track title"
            value={common.title || ""}
            onChange={(e) => onUpdate("title", e.target.value)}
            size={isMobile ? "sm" : "md"}
          />
          <TextInput
            label="Artist"
            placeholder="Artist name"
            value={common.artist || ""}
            onChange={(e) => onUpdate("artist", e.target.value)}
            size={isMobile ? "sm" : "md"}
          />
        </Group>

        <Group grow wrap={isMobile ? "wrap" : "nowrap"}>
          <TextInput
            label="Genre"
            placeholder="Genre"
            value={common.genre?.[0] || ""}
            onChange={(e) => onUpdate("genre", e.target.value)}
            size={isMobile ? "sm" : "md"}
          />
          <TextInput
            label="Year"
            placeholder="Release year"
            value={common.year?.toString() || ""}
            onChange={(e) => onUpdate("year", e.target.value)}
            size={isMobile ? "sm" : "md"}
          />
        </Group>

        {/* Technical Info */}
        <Group gap="xs" wrap="wrap">
          <Badge variant="light" size="sm">
            {format.codec?.toUpperCase() || "Unknown"}
          </Badge>
          <Badge variant="light" size="sm">
            {formatDuration(format.duration || 0)}
          </Badge>
          {format.bitrate && (
            <Badge variant="light" size="sm">
              {Math.round(format.bitrate)} kbps
            </Badge>
          )}
          {format.sampleRate && (
            <Badge variant="light" size="sm">
              {Math.round(format.sampleRate / 1000)} kHz
            </Badge>
          )}
          <Badge variant="light" size="sm">
            {(file.size / (1024 * 1024)).toFixed(2)} MB
          </Badge>
        </Group>
      </Stack>
    </Group>
  );
}
