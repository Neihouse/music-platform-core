import HeroSection from "@/components/HomePage/HeroSection";
import GenreHighlights from "@/components/HomePage/GenreHighlights";
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
  ThemeIcon,
  Container,
  useMantineColorScheme,
} from "@mantine/core";
import {
  IconPlayerPlay,
  IconTrendingUp,
  IconStar,
  IconMusic,
  IconHeadphones,
  IconVinyl,
  IconPlaylist,
  IconWaveSine
} from "@tabler/icons-react";

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
      <HeroSection />

      {/* Content */}
      <Container size="xl" py={rem(40)}>
        <Grid gutter={rem(32)}>
          <GridCol span={{ base: 12, md: 7 }}>
            <Card
              shadow="sm"
              padding="xl"
              radius="md"
              withBorder
              mb="xl"
              style={{
                overflow: 'hidden',
                position: 'relative',
                borderColor: 'var(--mantine-color-indigo-2)'
              }}
            >
              {/* Decorative background element */}
              <Box
                style={{
                  position: 'absolute',
                  right: -30,
                  bottom: -30,
                  opacity: 0.06,
                  zIndex: 0
                }}
              >
                <ThemeIcon size={180} radius={90} color="blue.4">
                  <IconWaveSine size={120} stroke={1} />
                </ThemeIcon>
              </Box>

              <Group justify="space-between" mb="md" style={{ position: 'relative', zIndex: 1 }}>
                <Group gap="xs">
                  <ThemeIcon size="md" radius="md" color="blue" variant="light">
                    <IconStar size={14} />
                  </ThemeIcon>
                  <Title order={3}>Featured Track</Title>
                </Group>
                <Badge color="indigo" variant="light" size="lg">
                  <Text size="xs" fw={600}>Editor's Pick</Text>
                </Badge>
              </Group>

              <Grid style={{ position: 'relative', zIndex: 1 }}>
                <GridCol span={4}>
                  <Paper
                    radius="lg"
                    shadow="sm"
                    style={{
                      aspectRatio: "1/1",
                      background: "linear-gradient(135deg, var(--mantine-color-indigo-5), var(--mantine-color-cyan-5))",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      overflow: "hidden",
                      position: "relative",
                    }}
                  >
                    <Box
                      style={{
                        position: 'absolute',
                        width: '150%',
                        height: '150%',
                        background: 'radial-gradient(circle, transparent 40%, rgba(0,0,0,0.1) 100%)',
                      }}
                    />
                    <IconPlayerPlay size={50} color="white" style={{ filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.2))" }} />
                  </Paper>
                </GridCol>
                <GridCol span={8}>
                  <Stack gap="xs" h="100%" justify="center">
                    <Title order={3} style={{ fontSize: rem(24) }}>{featuredTrack.title}</Title>
                    <Text size="lg" fw={500} c="dimmed">{featuredTrack.artist}</Text>
                    <Text size="md" mt="xs" style={{ maxWidth: '90%' }}>{featuredTrack.description}</Text>
                    <Button
                      mt="lg"
                      leftSection={<IconPlayerPlay size={18} />}
                      variant="gradient"
                      gradient={{ from: 'indigo', to: 'cyan', deg: 90 }}
                      radius="xl"
                      size="md"
                    >
                      Play Now
                    </Button>
                  </Stack>
                </GridCol>
              </Grid>
            </Card>

            {/* Genre Highlights Section */}
            <GenreHighlights />
          </GridCol>

          <GridCol span={{ base: 12, md: 5 }}>
            <Card
              shadow="sm"
              padding="xl"
              radius="md"
              withBorder
              style={{
                overflow: 'hidden',
                position: 'relative',
                borderColor: 'var(--mantine-color-cyan-2)'
              }}
            >
              {/* Decorative background element */}
              <Box
                style={{
                  position: 'absolute',
                  right: 40,
                  top: -30,
                  opacity: 0.06,
                  zIndex: 0
                }}
              >
                <ThemeIcon size={160} radius={80} color="cyan.5">
                  <IconMusic size={80} stroke={1} />
                </ThemeIcon>
              </Box>

              <Group justify="space-between" mb="md" style={{ position: 'relative', zIndex: 1 }}>
                <Group gap="xs">
                  <ThemeIcon size="md" radius="md" color="cyan" variant="light">
                    <IconTrendingUp size={14} />
                  </ThemeIcon>
                  <Title order={3}>Top Tracks</Title>
                </Group>
                <Badge color="cyan" variant="light" size="lg">
                  <Text size="xs">Trending</Text>
                </Badge>
              </Group>

              <Stack gap={0} style={{ position: 'relative', zIndex: 1 }}>
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

            {/* Activity Panel */}
            <Card
              shadow="sm"
              padding="xl"
              radius="md"
              withBorder
              mt="xl"
              style={{
                overflow: 'hidden',
                position: 'relative',
                borderColor: 'var(--mantine-color-blue-2)'
              }}
            >
              <Box
                style={{
                  position: 'absolute',
                  left: -20,
                  bottom: -20,
                  opacity: 0.05,
                  zIndex: 0
                }}
              >
                <ThemeIcon size={120} radius={60} color="blue.6">
                  <IconHeadphones size={70} stroke={1} />
                </ThemeIcon>
              </Box>

              <Title order={3} mb="md" style={{ position: 'relative', zIndex: 1 }}>Activity</Title>

              <Stack gap="md" style={{ position: 'relative', zIndex: 1 }}>
                {['New releases from artists you follow', 'Updates in your favorite genres', 'Playlist recommendations'].map((item, i) => (
                  <Group key={i} gap="md">
                    <ThemeIcon size="md" radius="xl" color={['blue', 'indigo', 'cyan'][i % 3]} variant="light">
                      <IconMusic size={14} />
                    </ThemeIcon>
                    <Text size="sm">{item}</Text>
                  </Group>
                ))}
                <Button
                  variant="light"
                  color="blue"
                  fullWidth
                  mt="md"
                  radius="md"
                >
                  View All Activity
                </Button>
              </Stack>
            </Card>
          </GridCol>
        </Grid>
      </Container>
    </Box>
  );
}
