import PromotersCard from "@/components/artist/PromotersCard";
import { getArtist, getArtistEvents, getArtistPromoters, getArtistShowCount, getArtistTrackCount } from "@/db/queries/artists";
import { getReceivedPromoterInvitations } from "@/db/queries/requests";
import { getArtistListensLastMonth } from "@/db/queries/tracks";
import { getUserProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { getArtistImagesServer, getAvatarUrlServer, getPromoterImagesServer } from "@/lib/images/image-utils";
import { nameToUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Avatar, Badge, Box, Button, Card, Center, Container, Grid, GridCol, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconArrowLeft, IconCalendarEvent, IconChartBar, IconHeadphones, IconMusic, IconSparkles, IconUser, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function ArtistDashboardPage() {
  const supabase = await createClient();
  const user = await getUser(supabase);

  // Redirect if not authenticated
  if (!user) {
    redirect("/login");
  }

  // Check if user has an artist profile
  const userProfile = await getUserProfile(supabase);

  if (userProfile.type !== 'artist') {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <ThemeIcon size={80} radius="xl" variant="light" color="red">
              <IconUser size={40} />
            </ThemeIcon>
            <Title order={2} c="red">Access Denied</Title>
            <Text>This page is restricted to artist accounts only.</Text>
            <Text size="sm" c="dimmed">
              {userProfile.type === 'promoter'
                ? "You currently have a promoter profile. Each user can only have one profile type."
                : "You need to create an artist profile to access this page."
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
                  href="/artists/create"
                  leftSection={<IconSparkles size={16} />}
                >
                  Create Artist Profile
                </Button>
              )}
            </Group>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Get artist data and metrics
  const artist = await getArtist(supabase);

  if (!artist) {
    return (
      <Container size="md" py="xl">
        <Paper withBorder radius="md" p="lg" shadow="md">
          <Stack gap="md" ta="center">
            <Title order={2} c="red">Artist Profile Not Found</Title>
            <Text>There was an error loading your artist profile.</Text>
            <Button component={Link} href="/artists/create">
              Create Artist Profile
            </Button>
          </Stack>
        </Paper>
      </Container>
    );
  }

  // Fetch all artist metrics in parallel
  const [upcomingEvents, promoters, trackMetrics, showMetrics, artistImages, totalListens, receivedInvitations] = await Promise.all([
    getArtistEvents(supabase, artist.id),
    getArtistPromoters(supabase, artist.id),
    getArtistTrackCount(supabase, artist.id),
    getArtistShowCount(supabase, artist.id),
    getArtistImagesServer(supabase, artist.id),
    getArtistListensLastMonth(supabase, artist.id),
    getReceivedPromoterInvitations(supabase, user.id),
  ]);

  // Process promoter avatar URLs (separate from artist images to avoid double calls)
  const promotersWithAvatars = await Promise.all(
    promoters.map(async (promoter: any) => ({
      ...promoter,
      avatarUrl: promoter.avatar_img ? await getAvatarUrlServer(promoter.avatar_img) : null,
    }))
  );

  // Process invitation promoters with avatar URLs
  const invitationsWithAvatars = await Promise.all(
    receivedInvitations.map(async (invitation: any) => ({
      ...invitation,
      promoter: {
        ...invitation.promoters,
        avatarUrl: invitation.promoters?.avatar_img
          ? await getPromoterImagesServer(supabase, invitation.promoters.id).then(images => images.avatarUrl)
          : null,
      }
    }))
  );

  const { avatarUrl, bannerUrl } = artistImages;

  return (
    <Container size="xl" py="xl">
      {/* Hero Banner Section */}
      <Paper
        radius="xl"
        p="xl"
        mb="xl"
        style={{
          background: bannerUrl
            ? `linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(205, 133, 63, 0.8) 100%), url(${bannerUrl}) center/cover`
            : "linear-gradient(135deg, #8b4513 0%, #cd853f 100%)",
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
                    Welcome back, {artist.name}!
                  </Title>
                  <Badge
                    size="lg"
                    variant="light"
                    color="orange"
                    leftSection={<IconMusic size={16} />}
                  >
                    ARTIST
                  </Badge>
                </Group>
                <Group gap="lg">
                  <Text size="lg" fw={500}>
                    🎤 {showMetrics.total} Performances
                  </Text>
                  <Text size="lg" fw={500}>
                    🎵 {trackMetrics.total} Tracks
                  </Text>
                </Group>
                {artist.bio && (
                  <Text size="md" style={{ maxWidth: "600px" }}>
                    {artist.bio}
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
                  href={`/artists/${nameToUrl(artist.name)}`}
                  variant="light"
                  size="lg"
                  leftSection={<IconUser size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                >
                  View Public Profile
                </Button>
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(artist.name)}/edit`}
                  size="lg"
                  leftSection={<IconSparkles size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#8b4513" }}
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
                  Promoters
                </Text>
                <Text fw={700} size="xl">
                  {promotersWithAvatars.length}
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
                  Total Shows
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
                  Total Listens
                </Text>
                <Text fw={700} size="xl">
                  {totalListens.toLocaleString()}
                </Text>
                <Text size="xs" c="dimmed">
                  Last 30 days
                </Text>
              </div>
              <ThemeIcon size={60} radius="xl" variant="light" color="orange">
                <IconHeadphones size={30} />
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
                          {event.venues?.name} • {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
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
                  <Button size="sm" variant="light">Find Events</Button>
                </Stack>
              </Center>
            )}
          </Card>
        </GridCol>

        {/* Promoters Overview */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <PromotersCard
            promotersWithAvatars={promotersWithAvatars}
            invitationsWithAvatars={invitationsWithAvatars}
          />
        </GridCol>
      </Grid>

      {/* Quick Actions */}
      <Card p="xl" radius="lg" withBorder mt="xl">
        <Title order={3} mb="lg">Quick Actions</Title>
        <Group>
          <Button leftSection={<IconMusic size={16} />} component={Link} href="/upload/tracks">
            Upload Track
          </Button>
          <Button variant="light" leftSection={<IconUsers size={16} />} component={Link} href="/artist/promoters">
            Find Promoters
          </Button>
          <Button variant="light" leftSection={<IconChartBar size={16} />}>
            View Analytics
          </Button>
        </Group>
      </Card>
    </Container>
  );
}
