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
import { FileWithMetadata } from "../FileUpload";
import { IconClock, IconTrash, IconVolume2 } from "@tabler/icons-react";
import { formatDuration } from "@/lib/formatting";

export interface IMetadataDisplayProps {
  fileWithMetadata: FileWithMetadata;
  onDelete: () => void;
}

export function MetadataDisplay({
  onDelete,
  fileWithMetadata: {
    metadata: { common, format, quality },
    file,
  },
}: IMetadataDisplayProps) {
  return (
    <Card>
      <Group justify="space-between">
        <Title>{common.title || file.name}</Title>
        <ActionIcon onClick={onDelete}>
          <IconTrash />
        </ActionIcon>
      </Group>
      <Divider />
      <Space m={4} />
      <Group>
        <Stack justify="center">
          <Text fs="italic">{file.size}</Text>
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
      {quality.warnings && (
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
