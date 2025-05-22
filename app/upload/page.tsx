import { getArtist } from "@/db/queries/artists";
import { createClient } from "@/utils/supabase/server";
import {
  Button,
  Container,
  Title,
  Text,
  Group,
  Paper,
  Grid,
  GridCol,
  ThemeIcon,
  rem,
  Box,
  Stack
} from "@mantine/core";
import {
  IconMusic,
  IconDisc,
  IconUpload,
  IconPlayerPlay,
  IconPhoto,
  IconListDetails
} from "@tabler/icons-react";
import Link from "next/link";
import * as React from "react";

export interface IUploadTrackPageProps { }

export default async function UploadTrackPage({ }: IUploadTrackPageProps) {
  const supabase = await createClient();
  const artist = await getArtist(supabase);

  return (
    <Container size="lg" py="xl">
      <Box mb={rem(40)}>
        <Group mb="md" gap="xs">
          <ThemeIcon size="lg" radius="md" color="blue" variant="light">
            <IconUpload size={18} />
          </ThemeIcon>
          <Title order={2}>Upload Your Music</Title>
        </Group>
        <Text c="dimmed" size="lg">
          Share your music with the world. Choose the option that works best for your content.
        </Text>
      </Box>

      <Grid gutter="xl">
        <GridCol span={{ base: 12, sm: 6 }}>
          <Paper
            shadow="md"
            p="xl"
            radius="md"
            withBorder
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderColor: 'var(--mantine-color-blue-2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                opacity: 0.07,
                zIndex: 0,
              }}
            >
              <ThemeIcon size={180} radius={90} color="blue.4">
                <IconDisc size={120} stroke={1} />
              </ThemeIcon>
            </Box>

            <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
              <ThemeIcon size={50} radius={25} color="blue" variant="light">
                <IconDisc size={30} />
              </ThemeIcon>

              <Title order={3}>Album Upload</Title>

              <Text size="md" style={{ flex: 1 }}>
                Perfect for releasing a collection of related tracks. Upload your album artwork once and organize multiple tracks together with consistent metadata.
              </Text>

              <Group gap="sm">
                <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                  <IconPhoto size={14} />
                </ThemeIcon>
                <Text size="sm">Single album artwork</Text>
              </Group>

              <Group gap="sm">
                <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                  <IconListDetails size={14} />
                </ThemeIcon>
                <Text size="sm">Organize related tracks together</Text>
              </Group>

              <Group gap="sm">
                <ThemeIcon size="sm" radius="xl" color="blue" variant="light">
                  <IconPlayerPlay size={14} />
                </ThemeIcon>
                <Text size="sm">Released as a complete collection</Text>
              </Group>

              <Button
                component={Link}
                href="/upload/album"
                size="lg"
                leftSection={<IconUpload size={18} />}
                variant="gradient"
                gradient={{ from: 'blue.6', to: 'cyan.6', deg: 90 }}
                radius="md"
                mt="auto"
              >
                Upload Album
              </Button>
            </Stack>
          </Paper>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6 }}>
          <Paper
            shadow="md"
            p="xl"
            radius="md"
            withBorder
            style={{
              height: '100%',
              display: 'flex',
              flexDirection: 'column',
              borderColor: 'var(--mantine-color-violet-2)',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Box
              style={{
                position: 'absolute',
                top: '-20px',
                right: '-20px',
                opacity: 0.07,
                zIndex: 0,
              }}
            >
              <ThemeIcon size={180} radius={90} color="violet.4">
                <IconMusic size={120} stroke={1} />
              </ThemeIcon>
            </Box>

            <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
              <ThemeIcon size={50} radius={25} color="violet" variant="light">
                <IconMusic size={30} />
              </ThemeIcon>

              <Title order={3}>Individual Tracks</Title>

              <Text size="md" style={{ flex: 1 }}>
                Ideal for releasing singles or unrelated tracks. Upload tracks one by one with individual artwork and unique metadata for each song.
              </Text>

              <Group gap="sm">
                <ThemeIcon size="sm" radius="xl" color="violet" variant="light">
                  <IconPhoto size={14} />
                </ThemeIcon>
                <Text size="sm">Custom artwork per track</Text>
              </Group>

              <Group gap="sm">
                <ThemeIcon size="sm" radius="xl" color="violet" variant="light">
                  <IconPlayerPlay size={14} />
                </ThemeIcon>
                <Text size="sm">Release and promote individually</Text>
              </Group>

              <Group gap="sm">
                <ThemeIcon size="sm" radius="xl" color="violet" variant="light">
                  <IconListDetails size={14} />
                </ThemeIcon>
                <Text size="sm">Flexible release schedule</Text>
              </Group>

              <Button
                component={Link}
                href="/upload/tracks"
                size="lg"
                leftSection={<IconUpload size={18} />}
                variant="gradient"
                gradient={{ from: 'violet.6', to: 'indigo.6', deg: 90 }}
                radius="md"
                mt="auto"
              >
                Upload Tracks
              </Button>
            </Stack>
          </Paper>
        </GridCol>
      </Grid>
    </Container>
  );
}
