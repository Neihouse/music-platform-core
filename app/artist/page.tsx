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
    <Container size="xl" py={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} px={{ base: "xs", sm: "md" }}>
      {/* Hero Banner Section */}
      <Paper
        radius="lg"
        p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
        mb={{ base: "md", sm: "lg", md: "xl" }}
        hiddenFrom="sm"
        style={{
          background: bannerUrl
            ? `linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(205, 133, 63, 0.8) 100%), url(${bannerUrl}) center/cover`
            : "linear-gradient(135deg, #8b4513 0%, #cd853f 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          minHeight: "180px",
        }}
      >
        {/* Content for mobile */}
        <Grid align="center" style={{ position: "relative", zIndex: 1 }}>
          <GridCol span={12}>
            <Stack gap="lg" align="center">
              <Group gap="xl" align="center" justify="center" wrap="wrap">
                <Avatar
                  src={avatarUrl}
                  size={60}
                  radius="xl"
                  style={{
                    border: "4px solid rgba(255,255,255,0.3)",
                    background: avatarUrl ? "transparent" : "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                  }}
                >
                  {!avatarUrl && <IconSparkles size={24} />}
                </Avatar>
                <Stack gap="md" align="center">
                  <Stack gap="xs" align="center">
                    <Title
                      order={1}
                      size="1.2rem"
                      fw={900}
                      ta="center"
                    >
                      Welcome back, {artist.name}!
                    </Title>
                    <Badge
                      size="sm"
                      variant="light"
                      color="orange"
                      leftSection={<IconMusic size={16} />}
                    >
                      ARTIST
                    </Badge>
                  </Stack>
                  <Group gap="md" justify="center" wrap="wrap">
                    <Text size="xs" fw={500}>
                      🎤 {showMetrics.total} Shows
                    </Text>
                    <Text size="xs" fw={500}>
                      🎵 {trackMetrics.total} Tracks
                    </Text>
                  </Group>
                  {artist.bio && (
                    <Text
                      size="xs"
                      ta="center"
                      style={{ maxWidth: "300px" }}
                      lineClamp={2}
                    >
                      {artist.bio}
                    </Text>
                  )}
                </Stack>
              </Group>
              <Stack gap="xs" w="100%">
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(artist.name)}`}
                  variant="light"
                  size="xs"
                  leftSection={<IconUser size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                  fullWidth
                >
                  View Profile
                </Button>
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(artist.name)}/edit`}
                  size="xs"
                  leftSection={<IconSparkles size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#8b4513" }}
                  fullWidth
                >
                  Edit Profile
                </Button>
              </Stack>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      <Paper
        radius="xl"
        p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}
        mb={{ base: "md", sm: "lg", md: "xl" }}
        visibleFrom="sm"
        style={{
          background: bannerUrl
            ? `linear-gradient(135deg, rgba(139, 69, 19, 0.8) 0%, rgba(205, 133, 63, 0.8) 100%), url(${bannerUrl}) center/cover`
            : "linear-gradient(135deg, #8b4513 0%, #cd853f 100%)",
          color: "white",
          position: "relative",
          overflow: "hidden",
          minHeight: "200px",
        }}
      >
        {/* Decorative elements - hide on mobile */}
        <Box
          visibleFrom="sm"
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
          visibleFrom="sm"
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
          <GridCol span={12}>
            <Stack gap="lg" align="center">
              <Group gap="xl" align="center" justify="center" wrap="wrap">
                <Avatar
                  src={avatarUrl}
                  size={80}
                  radius="xl"
                  style={{
                    border: "4px solid rgba(255,255,255,0.3)",
                    background: avatarUrl ? "transparent" : "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                  }}
                  visibleFrom="sm"
                  hiddenFrom="md"
                >
                  {!avatarUrl && <IconSparkles size={32} />}
                </Avatar>
                <Avatar
                  src={avatarUrl}
                  size={120}
                  radius="xl"
                  style={{
                    border: "4px solid rgba(255,255,255,0.3)",
                    background: avatarUrl ? "transparent" : "linear-gradient(45deg, #ff6b6b, #4ecdc4)",
                  }}
                  visibleFrom="md"
                >
                  {!avatarUrl && <IconSparkles size={48} />}
                </Avatar>
                <Stack gap="md" align="center">
                  <Stack gap="xs" align="center">
                    <Title
                      order={1}
                      size="1.8rem"
                      fw={900}
                      ta="center"
                      visibleFrom="sm"
                      hiddenFrom="md"
                    >
                      Welcome back, {artist.name}!
                    </Title>
                    <Title
                      order={1}
                      size="3rem"
                      fw={900}
                      ta="center"
                      visibleFrom="md"
                    >
                      Welcome back, {artist.name}!
                    </Title>
                    <Badge
                      size="md"
                      variant="light"
                      color="orange"
                      leftSection={<IconMusic size={16} />}
                      visibleFrom="sm"
                      hiddenFrom="md"
                    >
                      ARTIST
                    </Badge>
                    <Badge
                      size="lg"
                      variant="light"
                      color="orange"
                      leftSection={<IconMusic size={16} />}
                      visibleFrom="md"
                    >
                      ARTIST
                    </Badge>
                  </Stack>
                  <Group gap="md" justify="center" wrap="wrap">
                    <Text size="sm" fw={500} visibleFrom="sm" hiddenFrom="md">
                      🎤 {showMetrics.total} Performances
                    </Text>
                    <Text size="lg" fw={500} visibleFrom="md">
                      🎤 {showMetrics.total} Performances
                    </Text>
                    <Text size="sm" fw={500} visibleFrom="sm" hiddenFrom="md">
                      🎵 {trackMetrics.total} Tracks
                    </Text>
                    <Text size="lg" fw={500} visibleFrom="md">
                      🎵 {trackMetrics.total} Tracks
                    </Text>
                  </Group>
                  {artist.bio && (
                    <>
                      <Text
                        size="sm"
                        ta="center"
                        style={{ maxWidth: "500px" }}
                        lineClamp={3}
                        visibleFrom="sm"
                        hiddenFrom="md"
                      >
                        {artist.bio}
                      </Text>
                      <Text
                        size="md"
                        ta="center"
                        style={{ maxWidth: "600px" }}
                        visibleFrom="md"
                      >
                        {artist.bio}
                      </Text>
                    </>
                  )}
                </Stack>
              </Group>
              <Group gap="md" justify="center" visibleFrom="sm">
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(artist.name)}`}
                  variant="light"
                  size="sm"
                  leftSection={<IconUser size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                  hiddenFrom="md"
                >
                  View Profile
                </Button>
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(artist.name)}/edit`}
                  size="sm"
                  leftSection={<IconSparkles size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#8b4513" }}
                  hiddenFrom="md"
                >
                  Edit Profile
                </Button>
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(artist.name)}`}
                  variant="light"
                  size="lg"
                  leftSection={<IconUser size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.2)", color: "white" }}
                  visibleFrom="md"
                >
                  View Public Profile
                </Button>
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(artist.name)}/edit`}
                  size="lg"
                  leftSection={<IconSparkles size={16} />}
                  style={{ backgroundColor: "rgba(255,255,255,0.9)", color: "#8b4513" }}
                  visibleFrom="md"
                >
                  Edit Profile
                </Button>
              </Group>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      {/* Stats Grid */}
      <Grid gutter={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} mb={{ base: "md", sm: "lg", md: "xl" }}>
        <GridCol span={{ base: 6, sm: 6, md: 3 }}>
          <Card p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} radius="lg" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Promoters
                </Text>
                <Text fw={700} size="lg" hiddenFrom="sm">
                  {promotersWithAvatars.length}
                </Text>
                <Text fw={700} size="xl" visibleFrom="sm">
                  {promotersWithAvatars.length}
                </Text>
              </div>
              <ThemeIcon size={30} radius="xl" variant="light" color="blue" hiddenFrom="sm">
                <IconUsers size={16} />
              </ThemeIcon>
              <ThemeIcon size={40} radius="xl" variant="light" color="blue" visibleFrom="sm" hiddenFrom="md">
                <IconUsers size={20} />
              </ThemeIcon>
              <ThemeIcon size={60} radius="xl" variant="light" color="blue" visibleFrom="md">
                <IconUsers size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>

        <GridCol span={{ base: 6, sm: 6, md: 3 }}>
          <Card p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} radius="lg" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Shows
                </Text>
                <Text fw={700} size="lg" hiddenFrom="sm">
                  {showMetrics.total}
                </Text>
                <Text fw={700} size="xl" visibleFrom="sm">
                  {showMetrics.total}
                </Text>
                <Text size="xs" c="dimmed">
                  {showMetrics.upcoming} upcoming
                </Text>
              </div>
              <ThemeIcon size={30} radius="xl" variant="light" color="green" hiddenFrom="sm">
                <IconCalendarEvent size={16} />
              </ThemeIcon>
              <ThemeIcon size={40} radius="xl" variant="light" color="green" visibleFrom="sm" hiddenFrom="md">
                <IconCalendarEvent size={20} />
              </ThemeIcon>
              <ThemeIcon size={60} radius="xl" variant="light" color="green" visibleFrom="md">
                <IconCalendarEvent size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>

        <GridCol span={{ base: 6, sm: 6, md: 3 }}>
          <Card p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} radius="lg" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Tracks
                </Text>
                <Text fw={700} size="lg" hiddenFrom="sm">
                  {trackMetrics.total}
                </Text>
                <Text fw={700} size="xl" visibleFrom="sm">
                  {trackMetrics.total}
                </Text>
                <Text size="xs" c="dimmed">
                  {trackMetrics.recent} this month
                </Text>
              </div>
              <ThemeIcon size={30} radius="xl" variant="light" color="purple" hiddenFrom="sm">
                <IconMusic size={16} />
              </ThemeIcon>
              <ThemeIcon size={40} radius="xl" variant="light" color="purple" visibleFrom="sm" hiddenFrom="md">
                <IconMusic size={20} />
              </ThemeIcon>
              <ThemeIcon size={60} radius="xl" variant="light" color="purple" visibleFrom="md">
                <IconMusic size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>

        <GridCol span={{ base: 6, sm: 6, md: 3 }}>
          <Card p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} radius="lg" withBorder>
            <Group justify="space-between" align="flex-start">
              <div>
                <Text size="xs" tt="uppercase" fw={700} c="dimmed">
                  Total Listens
                </Text>
                <Text fw={700} size="lg" hiddenFrom="sm">
                  {totalListens.toLocaleString()}
                </Text>
                <Text fw={700} size="xl" visibleFrom="sm">
                  {totalListens.toLocaleString()}
                </Text>
                <Text size="xs" c="dimmed">
                  Last 30 days
                </Text>
              </div>
              <ThemeIcon size={30} radius="xl" variant="light" color="orange" hiddenFrom="sm">
                <IconHeadphones size={16} />
              </ThemeIcon>
              <ThemeIcon size={40} radius="xl" variant="light" color="orange" visibleFrom="sm" hiddenFrom="md">
                <IconHeadphones size={20} />
              </ThemeIcon>
              <ThemeIcon size={60} radius="xl" variant="light" color="orange" visibleFrom="md">
                <IconHeadphones size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>
      </Grid>

      {/* Content Grid */}
      <Grid gutter={{ base: "sm", sm: "md", md: "lg", lg: "xl" }}>
        {/* Upcoming Events */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <Card p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} radius="lg" withBorder h="100%">
            <Group justify="space-between" mb={{ base: "sm", sm: "md", md: "lg" }} wrap="nowrap">
              <Title order={3} size="lg" hiddenFrom="sm">Upcoming Events</Title>
              <Title order={3} size="xl" visibleFrom="sm">Upcoming Events</Title>
              <Button size="xs" variant="light">View All</Button>
            </Group>

            {upcomingEvents.length > 0 ? (
              <Stack gap="xs" hiddenFrom="sm">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <Paper key={event.id} p="xs" radius="md" withBorder>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text fw={600} lineClamp={1} size="sm">{event.name}</Text>
                        <Text size="xs" c="dimmed" lineClamp={1}>
                          {event.venues?.name} • {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                        </Text>
                      </div>
                      <Badge variant="light" color="green" size="xs">
                        Upcoming
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Center py="lg" hiddenFrom="sm">
                <Stack align="center" gap="sm">
                  <ThemeIcon size={40} radius="xl" variant="light" color="gray">
                    <IconCalendarEvent size={20} />
                  </ThemeIcon>
                  <Text c="dimmed" ta="center" size="sm">No upcoming events</Text>
                  <Button size="sm" variant="light">Find Events</Button>
                </Stack>
              </Center>
            )}

            {upcomingEvents.length > 0 ? (
              <Stack gap="md" visibleFrom="sm">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <Paper key={event.id} p={{ base: "sm", md: "md" }} radius="md" withBorder>
                    <Group justify="space-between" align="flex-start" wrap="nowrap">
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <Text fw={600} lineClamp={1}>{event.name}</Text>
                        <Text size="sm" c="dimmed" lineClamp={1}>
                          {event.venues?.name} • {event.date ? new Date(event.date).toLocaleDateString() : 'Date TBD'}
                        </Text>
                      </div>
                      <Badge variant="light" color="green" size="sm">
                        Upcoming
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Center py="xl" visibleFrom="sm">
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
      <Card p={{ base: "sm", sm: "md", md: "lg", lg: "xl" }} radius="lg" withBorder mt={{ base: "md", sm: "lg", md: "xl" }}>
        <Title order={3} mb={{ base: "sm", sm: "md", md: "lg" }} size="lg" hiddenFrom="sm">Quick Actions</Title>
        <Title order={3} mb={{ base: "sm", sm: "md", md: "lg" }} size="xl" visibleFrom="sm">Quick Actions</Title>
        <Stack gap="sm" hiddenFrom="sm">
          <Button leftSection={<IconMusic size={16} />} component={Link} href="/upload/tracks" fullWidth size="sm">
            Upload Track
          </Button>
          <Button variant="light" leftSection={<IconUsers size={16} />} component={Link} href="/artist/promoters" fullWidth size="sm">
            Find Promoters
          </Button>
          <Button variant="light" leftSection={<IconChartBar size={16} />} fullWidth size="sm">
            View Analytics
          </Button>
        </Stack>
        <Group visibleFrom="sm" gap="sm" wrap="wrap" hiddenFrom="md">
          <Button leftSection={<IconMusic size={16} />} component={Link} href="/upload/tracks" size="sm">
            Upload Track
          </Button>
          <Button variant="light" leftSection={<IconUsers size={16} />} component={Link} href="/artist/promoters" size="sm">
            Find Promoters
          </Button>
          <Button variant="light" leftSection={<IconChartBar size={16} />} size="sm">
            View Analytics
          </Button>
        </Group>
        <Group visibleFrom="md" gap="md" wrap="wrap">
          <Button leftSection={<IconMusic size={16} />} component={Link} href="/upload/tracks" size="md">
            Upload Track
          </Button>
          <Button variant="light" leftSection={<IconUsers size={16} />} component={Link} href="/artist/promoters" size="md">
            Find Promoters
          </Button>
          <Button variant="light" leftSection={<IconChartBar size={16} />} size="md">
            View Analytics
          </Button>
        </Group>
      </Card>
    </Container>
  );
}
