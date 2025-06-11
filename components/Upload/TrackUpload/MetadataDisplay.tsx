import {
  ActionIcon,
  Badge,
  Card,
  Divider,
  Group,
  Paper,
  Stack,
  Text,
  Box,
  Grid,
  GridCol
} from "@mantine/core";
import * as React from "react";
import {
  IconClock,
  IconTrash,
  IconVolume2,
  IconFileInfo,
  IconCodeDots,
  IconWaveSine,
  IconRuler,
  IconAlertCircle
} from "@tabler/icons-react";
import { formatDuration, formatSize } from "@/lib/formatting";
import { ToggleEditText } from "@/components/ToggleEditText";
import { FileWithMetadata } from ".";
import ImageUpload from "@/components/Upload/ImageUpload";


export interface IMetadataDisplayProps {
  fileWithMetadata: FileWithMetadata;
  onDelete: () => void;
  onUpdate: (key: string, value: string) => void;
  onImageDrop: (files: File[]) => void;
  isMobile?: boolean;
}

export function MetadataDisplay({
  onDelete,
  onUpdate,
  onImageDrop,
  isMobile = false,
  fileWithMetadata: {
    metadata: { common, format, quality },
    file,
  },
}: IMetadataDisplayProps) {
  // Get current image URL if present (stored as a custom property on IPicture)
  const imageUrl = (common.picture?.[0] as any)?.url || "";
  // Delete handler for ImageUpload


  return (
    <Card
      withBorder
      shadow="sm"
      radius="lg"
      p={isMobile ? "xs" : "md"}
      style={{
        backgroundColor: 'var(--mantine-color-body)',
        borderColor: 'var(--mantine-color-blue-2)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="hover:shadow-md"
    >
      <Group align="flex-start" gap={isMobile ? "md" : "xl"} wrap={isMobile ? "wrap" : "nowrap"}>
        <Stack>
          <ImageUpload
            initialUrl={imageUrl}
            onDrop={onImageDrop}
            label="Upload track art"
            maxSizeMB={5}
          />
        </Stack>
        <Box flex={1} w={isMobile ? "100%" : "auto"}>
          <Group justify="space-between" mb={isMobile ? "xs" : "md"}>
            <ToggleEditText
              variant="title"
              text={common.title || file.name}
              onEdit={(text) => onUpdate("title", text)}
            />
            <ActionIcon
              color="red"
              variant="light"
              radius="xl"
              onClick={onDelete}
              size={isMobile ? "md" : "lg"}
            >
              <IconTrash size={isMobile ? 16 : 18} />
            </ActionIcon>
          </Group>
          <Divider mb={isMobile ? "xs" : "md"} />

          <Grid>
            <GridCol span={isMobile ? 12 : 6}>
              <Paper p="xs" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                <Group gap="xs" align="center">
                  <IconFileInfo size={18} stroke={1.5} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" fw={500} c="dimmed">File Size:</Text>
                  <Badge variant="light" color="blue" radius="sm">{formatSize(file.size)}</Badge>
                </Group>
              </Paper>
            </GridCol>

            <GridCol span={isMobile ? 12 : 6}>
              <Paper p="xs" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                <Group gap="xs" align="center">
                  <IconClock size={18} stroke={1.5} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" fw={500} c="dimmed">Duration:</Text>
                  <Badge variant="light" color="blue" radius="sm">{formatDuration(Number(format.duration))}</Badge>
                </Group>
              </Paper>
            </GridCol>

            <GridCol span={isMobile ? 12 : 6}>
              <Paper p="xs" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                <Group gap="xs" align="center">
                  <IconCodeDots size={18} stroke={1.5} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" fw={500} c="dimmed">Codec:</Text>
                  <Badge variant="light" color="blue" radius="sm">{format.codec}</Badge>
                </Group>
              </Paper>
            </GridCol>

            <GridCol span={isMobile ? 12 : 6}>
              <Paper p="xs" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                <Group gap="xs" align="center">
                  <IconVolume2 size={18} stroke={1.5} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" fw={500} c="dimmed">Channels:</Text>
                  <Badge variant="light" color="blue" radius="sm">{format.numberOfChannels}</Badge>
                </Group>
              </Paper>
            </GridCol>

            <GridCol span={isMobile ? 12 : 6}>
              <Paper p="xs" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                <Group gap="xs" align="center">
                  <IconRuler size={18} stroke={1.5} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" fw={500} c="dimmed">Sample Rate:</Text>
                  <Badge variant="light" color="blue" radius="sm">{format.sampleRate}</Badge>
                </Group>
              </Paper>
            </GridCol>

            <GridCol span={isMobile ? 12 : 6}>
              <Paper p="xs" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-blue-0)' }}>
                <Group gap="xs" align="center">
                  <IconWaveSine size={18} stroke={1.5} color="var(--mantine-color-blue-6)" />
                  <Text size="sm" fw={500} c="dimmed">Bitrate:</Text>
                  <Badge variant="light" color="blue" radius="sm">{format.bitrate}</Badge>
                </Group>
              </Paper>
            </GridCol>

          </Grid>

          {!!quality.warnings.length && (
            <Paper mt="md" p="sm" radius="md" withBorder style={{ backgroundColor: 'var(--mantine-color-red-0)' }}>
              <Group gap="xs" mb="xs">
                <IconAlertCircle size={18} stroke={1.5} color="var(--mantine-color-red-6)" />
                <Text fw={500} size="sm" c="red.7">Warnings:</Text>
              </Group>
              <Stack gap="xs">
                {quality.warnings.map((warning: any) => (
                  <Text key={warning.message} size="sm" c="red.7" fw={400}>
                    {warning.message}
                  </Text>
                ))}
              </Stack>
            </Paper>
          )}
        </Box>
      </Group>
    </Card>
  );
}
