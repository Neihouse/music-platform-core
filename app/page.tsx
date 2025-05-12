import { TopTrackItem } from "@/components/TopTrackItem";
import { getTracks } from "@/db/queries/tracks";
import { Artist } from "@/utils/supabase/global.types";
import { createClient } from "@/utils/supabase/server";
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Card,
  Grid,
  Group,
  Box,
  Badge,
  rem,
  GridCol,
} from "@mantine/core";
import { IconPlayerPlay, IconTrendingUp, IconStar } from "@tabler/icons-react";

export interface IHomePage { }

export default async function HomePage({ }: IHomePage) {
  const featuredTrack = {
    id: 1,
    title: "Summer Breeze",
    artist: "Chill Vibes",
    description: "A smooth track to accompany your summer days",
  };
  const topTracks = await getTracks(await createClient());

  return (
    <Box>
      {/* Hero section */}
      <Paper
        py={rem(40)}
        mb={rem(40)}
        radius={0}
        style={{
          backgroundColor: 'var(--mantine-color-blue-0)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Stack gap="lg" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem' }}>
          <Title order={1} size="h1">Discover Your New Favorite Music</Title>
          <Text size="lg" c="dimmed" style={{ maxWidth: '600px' }}>
            Stream exclusive tracks, connect with artists, and build your perfect playlist with MusicApp.
          </Text>
          <Group mt="md">
            <Button
              leftSection={<IconPlayerPlay size={16} />}
              size="md"
            >
              Start Listening
            </Button>
            <Button
              variant="outline"
              size="md"
            >
              Browse Artists
            </Button>
          </Group>
        </Stack>
      </Paper>

      {/* Content */}
      <Grid gutter={rem(32)}>
        <GridCol span={{ base: 12, md: 7 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder mb="xl">
            <Group justify="space-between" mb="md">
              <Title order={3}>Featured Track</Title>
              <Badge color="blue" variant="light">
                <Group gap={4}>
                  <IconStar size={14} />
                  <Text size="xs">Featured</Text>
                </Group>
              </Badge>
            </Group>

            <Grid>
              <GridCol span={4}>
                <Paper
                  radius="md"
                  style={{
                    aspectRatio: "1/1",
                    background: "linear-gradient(45deg, #e0f2fe, #bae6fd)",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    overflow: "hidden",
                  }}
                >
                  <IconPlayerPlay size={40} color="white" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                </Paper>
              </GridCol>
              <GridCol span={8}>
                <Stack gap="xs">
                  <Title order={4}>{featuredTrack.title}</Title>
                  <Text c="dimmed">{featuredTrack.artist}</Text>
                  <Text size="sm" mt="xs">{featuredTrack.description}</Text>
                  <Button
                    mt="md"
                    leftSection={<IconPlayerPlay size={16} />}
                    variant="light"
                    color="blue"
                  >
                    Play Now
                  </Button>
                </Stack>
              </GridCol>
            </Grid>
          </Card>
        </GridCol>

        <GridCol span={{ base: 12, md: 5 }}>
          <Card shadow="sm" padding="lg" radius="md" withBorder>
            <Group justify="space-between" mb="md">
              <Group gap="xs">
                <IconTrendingUp size={20} color="var(--mantine-color-blue-6)" />
                <Title order={3}>Top Tracks</Title>
              </Group>
            </Group>

            <Stack gap={0}>
              {(topTracks || []).map((track) => (
                <TopTrackItem
                  key={track.id}
                  track={track}
                  plays={track.plays}
                  artists={track.artists as Artist[]}
                />
              ))}
            </Stack>
          </Card>
        </GridCol>
      </Grid>
    </Box>
  );
}
