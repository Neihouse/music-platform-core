import {
  ActionIcon,
  Card,
  Divider,
  Group,
  Space,
  Stack,
  Text,
  Title,
} from "@mantine/core";
import * as React from "react";
import { FileWithMetadata } from "./Uploader";
import {
  IconClock,
  IconEdit,
  IconTrash,
  IconVolume2,
} from "@tabler/icons-react";
import { formatDuration, formatSize } from "@/lib/formatting";
import { ToggleEditText } from "@/components/ToggleEditText";


export interface IMetadataDisplayProps {
  fileWithMetadata: FileWithMetadata;
  onDelete: () => void;
  onUpdate: (key: string, value: string) => void;
}

export function MetadataDisplay({
  onDelete,
  onUpdate,
  fileWithMetadata: {
    metadata: { common, format, quality },
    file,
  },
}: IMetadataDisplayProps) {
  return (
    <Card>
      <Group justify="space-between">
        <ToggleEditText
          variant="title"
          text={common.title || file.name}
          onEdit={(text) => onUpdate("title", text)}
        />
        <ActionIcon variant="subtle" onClick={onDelete}>
          <IconTrash />
        </ActionIcon>
      </Group>
      <Divider />
      <Space m={4} />
      <Group>
        <Stack justify="center">
          <Text fs="italic">{formatSize(file.size)}</Text>
          <Text ta="center">Size</Text>
        </Stack>
        <Stack align="center">
          <Text fs="italic">{formatDuration(Number(format.duration))}</Text>
          <IconClock />
        </Stack>
        <Stack align="center">
          <Text fs="italic">{format.codec}</Text>
          <Text>Codec</Text>
        </Stack>
        <Stack align="center">
          <Text fs="italic">{format.numberOfChannels} Channels</Text>
          <IconVolume2 />
        </Stack>
        <Stack>
          <Text fs="italic">{format.bitrate}</Text>
          <Text>Bitrate</Text>
        </Stack>
        <Stack>
          <Text fs="italic">{format.sampleRate}</Text>
          <Text>Sample rate</Text>
        </Stack>
      </Group>
      <Space m={8} />
      {!!quality.warnings.length && (
        <>
          <Divider />
          <Space m={8} />
          <Title fs="italic">Warnings:</Title>
          <Stack>
            {quality.warnings.map((warning) => (
              <Text key={warning.message} style={{ color: "red" }}>
                {warning.message}
              </Text>
            ))}
          </Stack>
        </>
      )}
    </Card>
  );
}
