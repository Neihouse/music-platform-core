"use client";

import Link from "next/link";
import {
  Container,
  Grid,
  GridCol,
  Group,
  Stack,
  Title,
  Text,
  Badge,
  Button,
  Card,
  Image,
  Avatar,
  Paper,
  SimpleGrid,
  ThemeIcon,
  Box,
  Tabs,
  Center,
  ActionIcon,
  Divider,
  Progress,
  RingProgress,
} from "@mantine/core";
import {
  IconUsers,
  IconCalendarEvent,
  IconMusic,
  IconMapPin,
  IconMail,
  IconPhone,
  IconExternalLink,
  IconPlayerPlay,
  IconHeart,
  IconShare,
  IconSparkles,
  IconBolt,
  IconEdit,
} from "@tabler/icons-react";
import { ExternalLinksDisplay } from "@/components/ExternalLinksDisplay";
import { nameToUrl } from "@/lib/utils";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { getAvatarUrl } from "@/lib/images/image-utils-client";

interface PromoterDetailViewProps {
  promoter: any;
  upcomingEvents: any[];
  pastEvents: any[];
  artists: any[];
  popularTracks: any[];
  currentUser: any;
}

export function PromoterDetailView({
  promoter,
  upcomingEvents,
  pastEvents,
  artists,
  popularTracks,
  currentUser,
}: PromoterDetailViewProps) {
  const [activeTab, setActiveTab] = useState("overview");

  // Helper function to get banner image URL
  const getBannerImageUrl = () => {
    if (!promoter.banner_img) return null;
    const supabase = createClient();
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`banners/${promoter.banner_img}`);
    return data.publicUrl;
  };

  const bannerUrl = getBannerImageUrl();
  const avatarUrl = getAvatarUrl(promoter.avatar_img);

  return (
    <Container size="xl" py="xl">
      {/* Hero Section */}
      <Paper
        radius="xl"
        p="xl"
        mb="xl"
        style={{
          background: bannerUrl 
            ? `linear-gradient(135deg, rgba(102, 126, 234, 0.8) 0%, rgba(118, 75, 162, 0.8) 100%), url(${bannerUrl}) center/cover`
            : "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          minHeight: "300px",
        }}
      >
        <Box
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "200px",
            height: "200px",
            background: "rgba(255,255,255,0.1)",
            borderRadius: "50%",
            transform: "translate(50%, -50%)",
          }}
        />
        <Box
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: "150px",
            height: "150px",
            background: "rgba(255,255,255,0.05)",
            borderRadius: "50%",
            transform: "translate(-50%, 50%)",
          }}
        />
        
        <Grid align="center" style={{ position: "relative", zIndex: 1 }}>
          <GridCol span={{ base: 12, md: 8 }}>
            <Group gap="xl">
              <Avatar
                src={avatarUrl}
                size={120}
                radius="xl"
                style={{
                  border: "4px solid rgba(255,255,255,0.3)",
                  background: avatarUrl ? "transparent" : "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                }}
              >
                {!avatarUrl && <IconSparkles size={48} />}
              </Avatar>
              <Stack gap="md">
                <Group gap="md">
                  <Title order={1} size="3rem" fw={900}>
                    {promoter.name}
                  </Title>
                  <Badge
                    size="lg"
                    variant="light"
                    color="yellow"
                    leftSection={<IconBolt size={16} />}
                  >
                    COLLECTIVE
                  </Badge>
                </Group>
                <Group gap="lg">
                  <Text size="lg" fw={500}>
                    🎉 {upcomingEvents.length + pastEvents.length} Epic Events
                  </Text>
                  <Text size="lg" fw={500}>
                    🎵 {artists.length} Amazing Artists
                  </Text>
                  {promoter.promoters_localities && promoter.promoters_localities.length > 0 && (
                    <Text size="lg" fw={500}>
                      📍 {promoter.promoters_localities.length} Location{promoter.promoters_localities.length > 1 ? 's' : ''}
                    </Text>
                  )}
                </Group>
                {promoter.bio && (
                  <Text size="md" style={{ maxWidth: "600px" }}>
                    {promoter.bio}
                  </Text>
                )}
              </Stack>
            </Group>
          </GridCol>
          <GridCol span={{ base: 12, md: 4 }}>
            <Stack gap="md" align="center">
              {/* Edit button - only show for promoter owner */}
              {currentUser && currentUser.id === promoter.user_id && (
                <Button
                  component={Link}
                  href={`/promoters/${nameToUrl(promoter.name)}/edit`}
                  size="lg"
                  variant="light"
                  color="blue"
                  leftSection={<IconEdit size={20} />}
                  style={{
                    fontWeight: 600,
                    borderRadius: "12px",
                  }}
                >
                  Edit Collective
                </Button>
              )}
              
              <Button
                size="xl"
                variant="white"
                color="dark"
                leftSection={<IconBolt size={24} />}
                style={{
                  background: "linear-gradient(45deg, #ff6b6b, #feca57)",
                  border: "none",
                  fontWeight: 700,
                  fontSize: "18px",
                  padding: "16px 32px",
                  boxShadow: "0 8px 32px rgba(0,0,0,0.3)",
                }}
              >
                Book This Collective!
              </Button>
              <Group gap="xs">
                <ActionIcon
                  size="lg"
                  variant="white"
                  color="red"
                  radius="xl"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                >
                  <IconHeart size={20} />
                </ActionIcon>
                <ActionIcon
                  size="lg"
                  variant="white"
                  color="blue"
                  radius="xl"
                  style={{ boxShadow: "0 4px 16px rgba(0,0,0,0.2)" }}
                >
                  <IconShare size={20} />
                </ActionIcon>
              </Group>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      {/* Tabs Section */}
      <Tabs value={activeTab} onChange={(value) => setActiveTab(value || "overview")} variant="pills" radius="xl">
        <Tabs.List mb="xl" style={{ justifyContent: "center" }}>
          <Tabs.Tab value="overview" leftSection={<IconSparkles size={16} />}>
            Overview
          </Tabs.Tab>
          <Tabs.Tab value="events" leftSection={<IconCalendarEvent size={16} />}>
            Events
          </Tabs.Tab>
          <Tabs.Tab value="artists" leftSection={<IconUsers size={16} />}>
            Artists
          </Tabs.Tab>
          <Tabs.Tab value="music" leftSection={<IconMusic size={16} />}>
            Popular Tracks
          </Tabs.Tab>
          <Tabs.Tab value="locations" leftSection={<IconMapPin size={16} />}>
            Locations
          </Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="overview">
          <Grid gutter="xl">
            {/* Popular Tracks Preview */}
            <GridCol span={{ base: 12, md: 6 }}>
              <Card p="xl" radius="xl" withBorder>
                <Group justify="space-between" mb="lg">
                  <Title order={3} fw={700}>
                    🔥 Hottest Tracks
                  </Title>
                  <Button variant="light" size="sm">
                    View All
                  </Button>
                </Group>
                <Stack gap="md">
                  {popularTracks.slice(0, 4).map((track, index) => (
                    <Group key={track.id} justify="space-between" wrap="nowrap">
                      <Group gap="md" style={{ flex: 1, minWidth: 0 }}>
                        <Text fw={700} c="dimmed" style={{ minWidth: "20px" }}>
                          #{index + 1}
                        </Text>
                        <Avatar src={track.artist?.avatar_img} size="sm" radius="xl">
                          {track.artist?.name?.[0]}
                        </Avatar>
                        <Box style={{ flex: 1, minWidth: 0 }}>
                          <Text fw={600} size="sm" lineClamp={1}>
                            {track.title}
                          </Text>
                          <Text size="xs" c="dimmed" lineClamp={1}>
                            {track.artist?.name}
                          </Text>
                        </Box>
                      </Group>
                      <Group gap="xs">
                        <Text size="xs" c="dimmed">
                          {track.plays} plays
                        </Text>
                        <ActionIcon size="sm" variant="light" color="blue">
                          <IconPlayerPlay size={12} />
                        </ActionIcon>
                      </Group>
                    </Group>
                  ))}
                </Stack>
              </Card>
            </GridCol>

            {/* Upcoming Events Preview */}
            <GridCol span={{ base: 12, md: 6 }}>
              <Card p="xl" radius="xl" withBorder>
                <Group justify="space-between" mb="lg">
                  <Title order={3} fw={700}>
                    🎪 Upcoming Events
                  </Title>
                  <Button variant="light" size="sm">
                    View All
                  </Button>
                </Group>
                <Stack gap="md">
                  {upcomingEvents.slice(0, 3).map((event) => (
                    <Card key={event.id} p="md" radius="lg" withBorder>
                      <Group justify="space-between">
                        <Box style={{ flex: 1 }}>
                          <Text fw={600} mb="xs">
                            {event.name}
                          </Text>
                          <Group gap="xs">
                            <IconMapPin size={14} />
                            <Text size="sm" c="dimmed">
                              {event.venues?.name || "TBA"}
                            </Text>
                          </Group>
                          {event.date && (
                            <Text size="sm" c="blue" fw={500}>
                              {new Date(event.date).toLocaleDateString("en-US", {
                                weekday: "short",
                                month: "short",
                                day: "numeric",
                              })}
                            </Text>
                          )}
                        </Box>
                        <Button size="xs" variant="light">
                          Details
                        </Button>
                      </Group>
                    </Card>
                  ))}
                </Stack>
              </Card>
            </GridCol>
          </Grid>
        </Tabs.Panel>

        <Tabs.Panel value="events">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title order={2}>Event Gallery</Title>
              <Badge size="lg" variant="light" color="blue">
                {upcomingEvents.length + pastEvents.length} Total Events
              </Badge>
            </Group>

            {/* Upcoming Events */}
            {upcomingEvents.length > 0 && (
              <>
                <Title order={3} c="blue">
                  Upcoming Events
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {upcomingEvents.map((event) => (
                    <EventCard key={event.id} event={event} type="upcoming" />
                  ))}
                </SimpleGrid>
              </>
            )}

            {/* Past Events */}
            {pastEvents.length > 0 && (
              <>
                <Title order={3} c="gray">
                  Past Events
                </Title>
                <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                  {pastEvents.map((event) => (
                    <EventCard key={event.id} event={event} type="past" />
                  ))}
                </SimpleGrid>
              </>
            )}

            {upcomingEvents.length === 0 && pastEvents.length === 0 && (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                    <IconCalendarEvent size={40} />
                  </ThemeIcon>
                  <Text size="xl" fw={600} c="dimmed">
                    No events yet
                  </Text>
                  <Text c="dimmed" ta="center">
                    This collective hasn't organized any events yet. Stay tuned!
                  </Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="artists">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title order={2}>Artist Collective</Title>
              <Badge size="lg" variant="light" color="purple">
                {artists.length} Artists
              </Badge>
            </Group>

            {artists.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {artists.map((artist) => (
                  <ArtistCard key={artist.id} artist={artist} />
                ))}
              </SimpleGrid>
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                    <IconUsers size={40} />
                  </ThemeIcon>
                  <Text size="xl" fw={600} c="dimmed">
                    No artists yet
                  </Text>
                  <Text c="dimmed" ta="center">
                    This collective is still building their roster. Check back soon!
                  </Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="music">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title order={2}>Popular Tracks</Title>
              <Badge size="lg" variant="light" color="red">
                {popularTracks.length} Tracks
              </Badge>
            </Group>

            {popularTracks.length > 0 ? (
              <SimpleGrid cols={{ base: 1, md: 2 }} spacing="lg">
                {popularTracks.map((track, index) => (
                  <TrackCard key={track.id} track={track} index={index} />
                ))}
              </SimpleGrid>
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                    <IconMusic size={40} />
                  </ThemeIcon>
                  <Text size="xl" fw={600} c="dimmed">
                    No tracks yet
                  </Text>
                  <Text c="dimmed" ta="center">
                    No tracks have been released by this collective's artists yet.
                  </Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </Tabs.Panel>

        <Tabs.Panel value="locations">
          <Stack gap="xl">
            <Group justify="space-between">
              <Title order={2}>Operating Locations</Title>
              <Badge size="lg" variant="light" color="orange">
                {promoter.promoters_localities?.length || 0} Location{(promoter.promoters_localities?.length || 0) !== 1 ? 's' : ''}
              </Badge>
            </Group>

            {promoter.promoters_localities && promoter.promoters_localities.length > 0 ? (
              <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
                {promoter.promoters_localities.map((location: any) => (
                  <LocationCard key={location.localities.id} location={location} />
                ))}
              </SimpleGrid>
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={80} radius="xl" variant="light" color="gray">
                    <IconMapPin size={40} />
                  </ThemeIcon>
                  <Text size="xl" fw={600} c="dimmed">
                    No locations specified
                  </Text>
                  <Text c="dimmed" ta="center">
                    This collective hasn't specified their operating locations yet.
                  </Text>
                </Stack>
              </Center>
            )}
          </Stack>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}

function EventCard({ event, type }: { event: any; type: "upcoming" | "past" }) {
  return (
    <Card
      p="lg"
      radius="xl"
      withBorder
      style={{
        background: type === "upcoming" 
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #bdc3c7 0%, #95a5a6 100%)",
        color: "white",
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Stack gap="md">
        <Group justify="space-between">
          <Text fw={700} size="lg" lineClamp={1}>
            {event.name}
          </Text>
          <Badge variant="light" color={type === "upcoming" ? "yellow" : "gray"}>
            {type === "upcoming" ? "Upcoming" : "Past"}
          </Badge>
        </Group>
        
        <Group gap="xs">
          <IconMapPin size={16} />
          <Text size="sm" lineClamp={1}>
            {event.venues?.name || "Venue TBA"}
          </Text>
        </Group>

        {event.date && (
          <Text size="sm" fw={500}>
            {new Date(event.date).toLocaleDateString("en-US", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </Text>
        )}

        <Button variant="white" color="dark" size="sm" mt="auto">
          View Details
        </Button>
      </Stack>
    </Card>
  );
}

function ArtistCard({ artist }: { artist: any }) {
  return (
    <Card
      p="lg"
      radius="xl"
      withBorder
      style={{
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Stack gap="md" align="center">
        <Avatar
          src={artist.avatar_img}
          size={80}
          radius="xl"
          style={{
            border: "3px solid var(--mantine-color-blue-3)",
          }}
        >
          {artist.name?.[0]}
        </Avatar>
        
        <Stack gap="xs" align="center">
          <Text fw={700} size="lg" ta="center">
            {artist.name}
          </Text>
          {artist.bio && (
            <Text size="sm" c="dimmed" ta="center" lineClamp={2}>
              {artist.bio}
            </Text>
          )}
        </Stack>

        {artist.external_links && artist.external_links.length > 0 && (
          <ExternalLinksDisplay links={artist.external_links} />
        )}

        <Button variant="light" size="sm" fullWidth>
          View Profile
        </Button>
      </Stack>
    </Card>
  );
}

function TrackCard({ track, index }: { track: any; index: number }) {
  return (
    <Card
      p="lg"
      radius="xl"
      withBorder
      style={{
        background: index % 2 === 0 
          ? "linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)"
          : "linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)",
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Group justify="space-between" align="flex-start">
        <Group gap="md" style={{ flex: 1, minWidth: 0 }}>
          <Text
            fw={900}
            size="xl"
            c="white"
            style={{
              textShadow: "0 2px 4px rgba(0,0,0,0.3)",
              minWidth: "30px",
            }}
          >
            #{index + 1}
          </Text>
          <Avatar
            src={track.artist?.avatar_img}
            size="lg"
            radius="xl"
            style={{
              border: "2px solid white",
              boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
            }}
          >
            {track.artist?.name?.[0]}
          </Avatar>
          <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
            <Text fw={700} size="lg" c="white" lineClamp={1}>
              {track.title}
            </Text>
            <Text fw={500} c="white" opacity={0.9} lineClamp={1}>
              {track.artist?.name}
            </Text>
            <Group gap="xs">
              <Text size="sm" c="white" opacity={0.8}>
                {track.plays || 0} plays
              </Text>
              <Text size="sm" c="white" opacity={0.8}>
                •
              </Text>
              <Text size="sm" c="white" opacity={0.8}>
                {Math.floor((track.duration || 0) / 60)}:{((track.duration || 0) % 60).toString().padStart(2, '0')}
              </Text>
            </Group>
          </Stack>
        </Group>
        <ActionIcon
          size="xl"
          variant="white"
          color="dark"
          radius="xl"
          style={{
            boxShadow: "0 4px 16px rgba(0,0,0,0.2)",
          }}
        >
          <IconPlayerPlay size={24} />
        </ActionIcon>
      </Group>
    </Card>
  );
}

function LocationCard({ location }: { location: any }) {
  return (
    <Card
      p="lg"
      radius="xl"
      withBorder
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        color: "white",
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e: any) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e: any) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Stack gap="md" align="center">
        <ThemeIcon
          size={60}
          radius="xl"
          variant="white"
          color="blue"
          style={{
            background: "rgba(255,255,255,0.2)",
            backdropFilter: "blur(8px)",
          }}
        >
          <IconMapPin size={30} />
        </ThemeIcon>
        
        <Stack gap="xs" align="center">
          <Text fw={700} size="lg" ta="center">
            {location.localities.name}
          </Text>
          <Text size="sm" c="rgba(255,255,255,0.9)" ta="center">
            {location.localities.administrative_areas?.name}
          </Text>
          <Text size="sm" c="rgba(255,255,255,0.8)" ta="center">
            {location.localities.administrative_areas?.countries?.name}
          </Text>
        </Stack>

        <Badge
          variant="white"
          color="blue"
          size="sm"
          style={{ background: "rgba(255,255,255,0.9)" }}
        >
          Operating Location
        </Badge>
      </Stack>
    </Card>
  );
}
