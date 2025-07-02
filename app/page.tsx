import LandingHeroSection from "@/components/HomePage/LandingHeroSection";
import EventCard from "@/components/HomePage/EventCard";
import { getTracks } from "@/db/queries/tracks";
import { getEvents } from "@/db/queries/events";
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
  SimpleGrid,
  Skeleton,
} from "@mantine/core";
import {
  IconPlayerPlay,
  IconTrendingUp,
  IconStar,
  IconMusic,
  IconWaveSine,
  IconArrowRight,
  IconUsersGroup,
  IconCalendarEvent,
  IconExternalLink,
} from "@tabler/icons-react";
import { Track } from "@/components/Tracks/Track";
import Link from "next/link";

export interface IHomePage { }

export default async function HomePage({ }: IHomePage) {
  const supabase = await createClient();
  
  // Fetch data in parallel for better performance
  const [topTracks, recentEvents] = await Promise.all([
    getTracks(supabase),
    getEvents(),
  ]);

  // Take only the first 6 events for the gallery
  const featuredEvents = recentEvents?.slice(0, 6) || [];

  const featuredTrack = {
    id: 1,
    title: "Summer Breeze",
    artist: "Chill Vibes",
    description: "A smooth track to accompany your summer days",
  };

  return (
    <Box>
      {/* Enhanced Hero section */}
      <LandingHeroSection />

      {/* Main Content */}
      <Container size="xl" py={rem(60)}>
        <Grid gutter={rem(40)}>
          {/* Featured Track Section */}
          <GridCol span={{ base: 12, lg: 6 }}>
            <Card
              shadow="lg"
              padding="xl"
              radius="lg"
              withBorder
              mb="xl"
              style={{
                overflow: 'hidden',
                position: 'relative',
                borderColor: 'var(--mantine-color-indigo-2)',
                background: 'linear-gradient(135deg, var(--mantine-color-indigo-0), var(--mantine-color-cyan-0))',
              }}
            >
              {/* Subtle geometric accent */}
              <Box
                style={{
                  position: 'absolute',
                  right: -20,
                  bottom: -20,
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  background: `linear-gradient(135deg, rgba(99, 102, 241, 0.08), rgba(14, 165, 233, 0.05))`,
                  zIndex: 0
                }}
              />

              <Group justify="space-between" mb="md" style={{ position: 'relative', zIndex: 1 }}>
                <Group gap="xs">
                  <ThemeIcon size="lg" radius="md" color="indigo" variant="light">
                    <IconStar size={18} />
                  </ThemeIcon>
                  <Title order={2} size="h3">Featured Track</Title>
                </Group>
                <Badge color="indigo" variant="gradient" gradient={{ from: 'indigo', to: 'cyan' }} size="lg">
                  <Text size="sm" fw={600}>Editor's Pick</Text>
                </Badge>
              </Group>

              <Grid style={{ position: 'relative', zIndex: 1 }}>
                <GridCol span={5}>
                  <Paper
                    radius="xl"
                    shadow="md"
                    style={{
                      aspectRatio: "1/1",
                      background: "linear-gradient(135deg, var(--mantine-color-indigo-6), var(--mantine-color-cyan-5))",
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
                    <IconPlayerPlay size={60} color="white" style={{ filter: "drop-shadow(0 4px 8px rgba(0,0,0,0.3))" }} />
                  </Paper>
                </GridCol>
                <GridCol span={7}>
                  <Stack gap="sm" h="100%" justify="center">
                    <Title order={3} size="h4">{featuredTrack.title}</Title>
                    <Text size="lg" fw={500} c="dimmed">{featuredTrack.artist}</Text>
                    <Text size="md" mt="xs" style={{ maxWidth: '95%' }}>{featuredTrack.description}</Text>
                    <Button
                      mt="md"
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
          </GridCol>

          {/* Top Tracks Section */}
          <GridCol span={{ base: 12, lg: 6 }}>
            <Card
              shadow="lg"
              padding="xl"
              radius="lg"
              withBorder
              mb="xl"
              style={{
                overflow: 'hidden',
                position: 'relative',
                borderColor: 'var(--mantine-color-cyan-2)',
                background: 'linear-gradient(135deg, var(--mantine-color-cyan-0), var(--mantine-color-blue-0))',
              }}
            >
              {/* Elegant geometric pattern */}
              <Box
                style={{
                  position: 'absolute',
                  right: 0,
                  top: 0,
                  width: '100px',
                  height: '100px',
                  background: `linear-gradient(135deg, rgba(6, 182, 212, 0.06), rgba(59, 130, 246, 0.04))`,
                  borderRadius: '0 16px 0 50%',
                  zIndex: 0
                }}
              />

              <Group justify="space-between" mb="md" style={{ position: 'relative', zIndex: 1 }}>
                <Group gap="xs">
                  <ThemeIcon size="lg" radius="md" color="cyan" variant="light">
                    <IconTrendingUp size={18} />
                  </ThemeIcon>
                  <Title order={2} size="h3">Top Tracks</Title>
                </Group>
                <Badge color="cyan" variant="gradient" gradient={{ from: 'cyan', to: 'blue' }} size="lg">
                  <Text size="sm" fw={600}>Trending Now</Text>
                </Badge>
              </Group>

              <Stack gap={0} style={{ position: 'relative', zIndex: 1 }}>
                {(topTracks || []).slice(0, 5).map((track) => (
                  <Track
                    playCount={track.plays}
                    key={track.id}
                    track={track}
                    artists={track.artists as Artist[]}
                  />
                ))}
              </Stack>

              <Button
                component={Link}
                href="/tracks"
                variant="light"
                color="cyan"
                fullWidth
                mt="md"
                radius="md"
                rightSection={<IconArrowRight size={16} />}
              >
                View All Tracks
              </Button>
            </Card>
          </GridCol>
        </Grid>

        {/* Events Gallery Section */}
        <Box mt={rem(80)}>
          <Group justify="space-between" align="center" mb="xl">
            <Box>
              <Title order={2} size="h2" mb="xs">Recent Events</Title>
              <Text size="lg" c="dimmed">Discover amazing live music experiences from around the world</Text>
            </Box>
            <Button
              component={Link}
              href="/events"
              variant="light"
              color="indigo"
              rightSection={<IconExternalLink size={16} />}
              size="md"
            >
              View All Events
            </Button>
          </Group>

          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {featuredEvents.length > 0 ? (
              featuredEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))
            ) : (
              // Skeleton placeholders for events
              Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} shadow="md" padding="lg" radius="lg" withBorder>
                  <Skeleton height={200} radius="md" mb="md" />
                  <Stack gap="sm">
                    <Group justify="space-between">
                      <Skeleton height={24} width="70%" />
                      <Skeleton height={20} width={50} />
                    </Group>
                    <Skeleton height={16} width="60%" />
                    <Skeleton height={16} width="80%" />
                    <Skeleton height={32} mt="sm" />
                  </Stack>
                </Card>
              ))
            )}
          </SimpleGrid>
        </Box>

        {/* Call to Action Section */}
        <Paper
          shadow="xl"
          p="xl"
          radius="xl"
          mt={rem(80)}
          style={{
            background: 'linear-gradient(135deg, var(--mantine-color-indigo-6), var(--mantine-color-cyan-6))',
            color: 'white',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Professional geometric overlay */}
          <Box
            style={{
              position: 'absolute',
              top: 0,
              right: 0,
              width: '200px',
              height: '200px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.08) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(50%, -50%)',
            }}
          />
          
          <Box
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: '150px',
              height: '150px',
              background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
              borderRadius: '50%',
              transform: 'translate(-50%, 50%)',
            }}
          />

          <Grid style={{ position: 'relative', zIndex: 1 }}>
            <GridCol span={{ base: 12, md: 8 }}>
              <Stack gap="lg">
                <Title order={2} c="white" size="h2">
                  Ready to Create Your Next Event?
                </Title>
                <Text size="lg" c="white" style={{ opacity: 0.9 }}>
                  Join thousands of event organizers who trust our platform to connect artists with audiences. 
                  Create unforgettable live music experiences that bring communities together.
                </Text>
                <Group>
                  <Button
                    component={Link}
                    href="/events/create"
                    size="lg"
                    variant="white"
                    color="indigo"
                    leftSection={<IconCalendarEvent size={20} />}
                    radius="xl"
                    style={{ fontWeight: 600 }}
                  >
                    Book Your Event
                  </Button>
                  <Button
                    component={Link}
                    href="/promoters"
                    size="lg"
                    variant="outline"
                    color="white"
                    leftSection={<IconUsersGroup size={20} />}
                    radius="xl"
                    style={{ borderColor: 'rgba(255,255,255,0.5)', fontWeight: 600 }}
                  >
                    Find Promoters
                  </Button>
                </Group>
              </Stack>
            </GridCol>
          </Grid>
        </Paper>
      </Container>
    </Box>
  );
}
