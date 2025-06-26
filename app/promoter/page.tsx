import { Container, Title, Text, Paper, Stack, Button, Box, Grid, GridCol, Card, Group, Badge, Avatar, Center, ThemeIcon } from "@mantine/core";
import { IconUser, IconCalendarEvent, IconUsers, IconMusic, IconTrendingUp, IconChartBar, IconSparkles, IconArrowLeft } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/server";
import { getUser } from "@/db/queries/users";
import { getUserProfile } from "@/db/queries/user";
import { getPromoter, getPromoterEvents, getPromoterArtists, getPromoterTrackCount, getPromoterShowCount } from "@/db/queries/promoters";
import { getPromoterImagesServer } from "@/lib/images/image-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";

export default async function PromoterDashboardPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);
  
  // Redirect if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Check if user has a promoter profile
  const userProfile = await getUserProfile(supabase);
  
 
  if (userProfile.type !== 'promoter') {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <ThemeIcon size={80} radius="xl" variant="light" color="red">
              <IconUser size={40} />
            </ThemeIcon>
            <Title order={2} c="red">Access Denied</Title>
            <Text>This page is restricted to promoter accounts only.</Text>
            <Text size="sm" c="dimmed">
              {userProfile.type === 'artist' 
                ? "You currently have an artist profile. Each user can only have one profile type."
                : "You need to create a promoter profile to access this page."
              }
            </Text>
            <Group justify="center" gap="md">
              <Button 
                component={Link} 
                href="/dashboard"
                variant="light"
                leftSection={<IconArrowLeft size={16} />}
              >
                Go to Dashboard
              </Button>
              {userProfile.type === null && (
                <Button 
                  component={Link} 
                  href="/promoters/create"
                  leftSection={<IconSparkles size={16} />}
                >
                  Create Promoter Profile
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Get promoter data and metrics
  const promoter = await getPromoter(supabase);
  
  if (!promoter) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="red">Promoter Profile Not Found</Title>
            <Text>There was an error loading your promoter profile.</Text>
            <Button component={Link} href="/promoters/create">
              Create Promoter Profile
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Fetch all promoter metrics in parallel
  const [upcomingEvents, artists, trackMetrics, showMetrics, promoterImages] = await Promise.all([
    getPromoterEvents(supabase, promoter.id),
    getPromoterArtists(supabase, promoter.id),
    getPromoterTrackCount(supabase, promoter.id),
    getPromoterShowCount(supabase, promoter.id),
    getPromoterImagesServer(supabase, promoter.id),
  ]);

  const { avatarUrl, bannerUrl } = promoterImages;

  return (
    <Container size="xl" py="xl">
      {/* Hero Banner Section */}
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
        {/* Decorative elements */}
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
                    Welcome back, {promoter.name}!
                  </Title>
                  <Badge
                    size="lg"
                    variant="light"
                    color="yellow"
                    leftSection={<IconSparkles size={16} />}
                  >
                    PROMOTER
                  </Badge>
                </Group>
                <Group gap="lg">
                  <Text size="lg" fw={500}>
                    🎉 {showMetrics.total} Epic Events
                  </Text>
                  <Text size="lg" fw={500}>
                    🎵 {artists.length} Amazing Artists
                  </Text>
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
              <Group gap="md">
                <Button
                  component={Link}
                  href={`/promoters/${nameToUrl(promoter.name)}`}
                  variant="light"
                  size="lg"
                  leftSection={<IconUser size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                >
                  View Public Profile
                </Button>
                <Button
                  component={Link}
                  href={`/promoters/${nameToUrl(promoter.name)}/edit`}
                  size="lg"
                  leftSection={<IconSparkles size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#667eea" }}
                >
                  Edit Profile
                </Button>
              </Group>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      {/* Stats Grid */}
      <Grid gutter="xl" mb="xl">
        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <Card p="xl" radius="lg" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Artists
                </Text>
                <Text fw={700} size="xl">
                  {artists.length}
                </Text>
              </div>
              <ThemeIcon size={60} radius="xl" variant="light" color="blue">
                <IconUsers size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <Card p="xl" radius="lg" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Events
                </Text>
                <Text fw={700} size="xl">
                  {showMetrics.total}
                </Text>
                <Text size="xs" c="dimmed">
                  {showMetrics.upcoming} upcoming
                </Text>
              </div>
              <ThemeIcon size={60} radius="xl" variant="light" color="green">
                <IconCalendarEvent size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <Card p="xl" radius="lg" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Tracks
                </Text>
                <Text fw={700} size="xl">
                  {trackMetrics.total}
                </Text>
                <Text size="xs" c="dimmed">
                  {trackMetrics.recent} this month
                </Text>
              </div>
              <ThemeIcon size={60} radius="xl" variant="light" color="purple">
                <IconMusic size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <Card p="xl" radius="lg" withBorder>
            <Group justify="space-between">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Performance
                </Text>
                <Text fw={700} size="xl">
                  {Math.round((trackMetrics.recent / Math.max(trackMetrics.total, 1)) * 100)}%
                </Text>
                <Text size="xs" c="dimmed">
                  Activity rate
                </Text>
              </div>
              <ThemeIcon size={60} radius="xl" variant="light" color="orange">
                <IconTrendingUp size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>
      </Grid>

      {/* Content Grid */}
      <Grid gutter="xl">
        {/* Upcoming Events */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <Card p="xl" radius="lg" withBorder h="100%">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Upcoming Events</Title>
              <Button size="xs" variant="light">View All</Button>
            </Group>
            
            {upcomingEvents.length > 0 ? (
              <Stack gap="md">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <Paper key={event.id} p="md" radius="md" withBorder>
                    <Group justify="space-between">
                      <div>
                        <Text fw={600}>{event.name}</Text>
                        <Text size="sm" c="dimmed">
                          {event.venues?.name} • {new Date(event.date).toLocaleDateString()}
                        </Text>
                      </div>
                      <Badge variant="light" color="green">
                        Upcoming
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                    <IconCalendarEvent size={30} />
                  </ThemeIcon>
                  <Text c="dimmed" ta="center">No upcoming events</Text>
                  <Button size="sm" variant="light">Create Event</Button>
                </Stack>
              </Center>
            )}
          </Card>
        </GridCol>

        {/* Artists Overview */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <Card p="xl" radius="lg" withBorder h="100%">
            <Group justify="space-between" mb="lg">
              <Title order={3}>Your Artists</Title>
              <Button size="xs" variant="light">View All</Button>
            </Group>
            
            {artists.length > 0 ? (
              <Stack gap="md">
                {artists.slice(0, 3).map((artist) => (
                  <Paper key={artist.id} p="md" radius="md" withBorder>
                    <Group>
                      <Avatar
                        src={artist.avatar_img ? `/api/storage/images/avatars/${artist.avatar_img}` : null}
                        size="md"
                        radius="xl"
                      >
                        {artist.name?.[0]}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Text fw={600}>{artist.name}</Text>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                          {artist.bio || "No bio available"}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                    <IconUsers size={30} />
                  </ThemeIcon>
                  <Text c="dimmed" ta="center">No artists in your collective yet</Text>
                  <Button size="sm" variant="light" component={Link} href="/promoter/artists">Add Artists</Button>
                </Stack>
              </Center>
            )}
          </Card>
        </GridCol>
      </Grid>

      {/* Quick Actions */}
      <Card p="xl" radius="lg" withBorder mt="xl">
        <Title order={3} mb="lg">Quick Actions</Title>
        <Group>
          <Button leftSection={<IconCalendarEvent size={16} />}>
            Create Event
          </Button>
          <Button variant="light" leftSection={<IconUsers size={16} />} component={Link} href="/promoter/artists">
            Add Artists
          </Button>
          <Button variant="light" leftSection={<IconChartBar size={16} />}>
            View Analytics
          </Button>
        </Group>
      </Card>
    </Container>
  );
}
