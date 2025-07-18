import { RequestActions } from "@/components/promoter/RequestActions";
import { ThemedCard } from "@/components/shared/ThemedCard";
import { getPromoter, getPromoterArtists, getPromoterEvents, getPromoterShowCount, getPromoterTrackCount, getPromoterTrackPlaysLast30Days } from "@/db/queries/promoters";
import { getReceivedArtistRequests, getSentRequests } from "@/db/queries/requests";
import { getUserProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { getAvatarUrlServer, getPromoterImagesServer } from "@/lib/images/image-utils";
import { nameToUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Avatar, Badge, Button, Center, Container, Grid, GridCol, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconArrowLeft, IconCalendarEvent, IconChartBar, IconMusic, IconPlayerPlay, IconSparkles, IconUser, IconUserPlus, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import styles from "./promoter-dashboard.module.css";

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
                href={userProfile.type === 'artist' ? '/artist' : '/discover'}
                variant="light"
                leftSection={<IconArrowLeft size={16} />}
              >
                {userProfile.type === 'artist' ? 'Go to Artist Dashboard' : 'Go to Discover'}
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
  const [upcomingEvents, artists, trackMetrics, showMetrics, promoterImages, sentRequests, receivedArtistRequests, trackPlaysLast30Days] = await Promise.all([
    getPromoterEvents(supabase, promoter.id),
    getPromoterArtists(supabase, promoter.id),
    getPromoterTrackCount(supabase, promoter.id),
    getPromoterShowCount(supabase, promoter.id),
    getPromoterImagesServer(supabase, promoter.id),
    getSentRequests(supabase, user.id),
    getReceivedArtistRequests(supabase, promoter.id),
    getPromoterTrackPlaysLast30Days(supabase, promoter.id),
  ]);

  // Process artist avatar URLs (separate from promoter images to avoid double calls)
  const artistsWithAvatars = await Promise.all(
    artists.map(async (artist: any) => ({
      ...artist,
      avatarUrl: artist.avatar_img ? await getAvatarUrlServer(artist.avatar_img) : null,
    }))
  );

  // Process received artist requests with avatar URLs
  const receivedRequestsWithAvatars = await Promise.all(
    receivedArtistRequests.map(async (request: any) => ({
      ...request,
      artist: {
        ...request.artist,
        avatarUrl: request.artist?.avatar_img ? await getAvatarUrlServer(request.artist.avatar_img) : null,
      }
    }))
  );

  // Count pending invites to artists
  const pendingInvites = sentRequests.filter(request =>
    request.status === "pending" &&
    request.invited_to_entity === "promoter" &&
    request.invitee_entity === "artist"
  ).length;

  const { avatarUrl, bannerUrl } = promoterImages;

  return (
    <Container
      size="xl"
      py={{ base: "md", sm: "lg", md: "xl" }}
      px={{ base: "sm", sm: "md" }}
    >
      {/* Hero Banner Section */}
      <Paper
        radius="md"
        p={{ base: "md", sm: "lg" }}
        mb={{ base: "md", sm: "lg", md: "xl" }}
        bg="dark.8"
        withBorder
        style={{ borderColor: "var(--mantine-color-dark-6)" }}
      >
        <Grid align="center" gutter={{ base: "md", sm: "lg" }}>
          <GridCol span={12}>
            <Stack
              gap="md"
              className={styles.heroStack}
            >
              <Group
                gap="md"
                align="flex-start"
                className={styles.heroGroup}
                wrap="nowrap"
                w="100%"
              >
                <Avatar
                  src={avatarUrl}
                  size={120}
                  radius="xl"
                  className={styles.avatar}
                  style={{
                    border: "2px solid var(--mantine-color-dark-5)",
                    background: avatarUrl ? "transparent" : "var(--mantine-color-dark-6)",
                  }}
                >
                  {!avatarUrl && <IconSparkles size={32} />}
                </Avatar>
                <Stack gap="xs" className={styles.titleContainer} style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="sm" align="center" justify="center" wrap="wrap">
                    <Title
                      order={1}
                      fw={600}
                      c="gray.0"
                      className={styles.title}
                    >
                      Welcome back, {promoter.name}!
                    </Title>
                    <Badge
                      size="md"
                      variant="light"
                      color="blue"
                      leftSection={<IconSparkles size={14} />}
                    >
                      PROMOTER
                    </Badge>
                  </Group>
                  <Group
                    gap="xs"
                    justify="center"
                    wrap="wrap"
                  >
                    <Text
                      size="sm"
                      fw={500}
                      c="gray.2"
                    >
                      🎉 {showMetrics.total} Events
                    </Text>
                    <Text
                      size="sm"
                      fw={500}
                      c="gray.2"
                    >
                      🎵 {artistsWithAvatars.length} Artists
                    </Text>
                  </Group>
                  {promoter.bio && (
                    <Text
                      size="sm"
                      c="gray.3"
                      className={styles.bioText}
                      lineClamp={2}
                    >
                      {promoter.bio}
                    </Text>
                  )}
                </Stack>
              </Group>
              <Group
                gap="xs"
                justify="center"
                w="100%"
              >
                <Button
                  component={Link}
                  href={`/promoters/${nameToUrl(promoter.name)}`}
                  variant="light"
                  size="sm"
                  leftSection={<IconUser size={16} />}
                  w={{ base: "100%", sm: "auto" }}
                  maw={{ base: "none", sm: 200 }}
                >
                  View Public Profile
                </Button>
                <Button
                  component={Link}
                  href={`/promoters/${nameToUrl(promoter.name)}/edit`}
                  size="sm"
                  leftSection={<IconSparkles size={16} />}
                  w={{ base: "100%", sm: "auto" }}
                  maw={{ base: "none", sm: 200 }}
                >
                  Edit Profile
                </Button>
              </Group>
            </Stack>
          </GridCol>
        </Grid>
      </Paper>

      {/* Stats Grid */}
      <Grid
        gutter={{ base: "md", sm: "lg", md: "xl" }}
        mb={{ base: "md", sm: "lg", md: "xl" }}
      >
        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <ThemedCard>
            <Group justify="space-between" wrap="nowrap">
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  c="gray.5"
                  mb={4}
                >
                  Artists
                </Text>
                <Text
                  fw={700}
                  size="xl"
                  c="gray.0"
                >
                  {artistsWithAvatars.length}
                </Text>
              </div>
              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color="gray"
              >
                <IconUsers size={30} />
              </ThemeIcon>
            </Group>
          </ThemedCard>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <ThemedCard>
            <Group justify="space-between" wrap="nowrap">
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  c="gray.5"
                  mb={4}
                >
                  Total Events
                </Text>
                <Text
                  fw={700}
                  size="xl"
                  c="gray.0"
                >
                  {showMetrics.total}
                </Text>
                <Text size="xs" c="gray.6">
                  {showMetrics.upcoming} upcoming
                </Text>
              </div>
              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color="blue"
              >
                <IconCalendarEvent size={30} />
              </ThemeIcon>
            </Group>
          </ThemedCard>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <ThemedCard>
            <Group justify="space-between" wrap="nowrap">
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  c="gray.5"
                  mb={4}
                >
                  Total Tracks
                </Text>
                <Text
                  fw={700}
                  size="xl"
                  c="gray.0"
                >
                  {trackMetrics.total}
                </Text>
                <Text size="xs" c="gray.6">
                  {trackMetrics.recent} this month
                </Text>
              </div>
              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color="gray"
              >
                <IconMusic size={30} />
              </ThemeIcon>
            </Group>
          </ThemedCard>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <ThemedCard>
            <Group justify="space-between" wrap="nowrap">
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  c="gray.5"
                  mb={4}
                >
                  Track Plays
                </Text>
                <Text
                  fw={700}
                  size="xl"
                  c="gray.0"
                >
                  {trackPlaysLast30Days.toLocaleString()}
                </Text>
                <Text size="xs" c="gray.6">
                  Last 30 days
                </Text>
              </div>
              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color="green"
              >
                <IconPlayerPlay size={30} />
              </ThemeIcon>
            </Group>
          </ThemedCard>
        </GridCol>
      </Grid>

      {/* Content Grid */}
      <Grid gutter={{ base: "md", sm: "lg", md: "xl" }}>
        {/* Upcoming Events */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <ThemedCard h="100%">
            <Group justify="space-between" mb="lg" wrap="wrap">
              <Title order={3} c="gray.0" fz={{ base: "lg", sm: "xl" }}>
                Upcoming Events
              </Title>
              <Button size="xs" variant="light">View All</Button>
            </Group>

            {upcomingEvents.length > 0 ? (
              <Stack gap="md">
                {upcomingEvents.slice(0, 3).map((event) => (
                  <Paper
                    key={event.id}
                    p="md"
                    radius="md"
                    withBorder
                    bg="dark.7"
                    style={{ borderColor: "var(--mantine-color-dark-5)" }}
                  >
                    <Group justify="space-between" wrap="wrap">
                      <div style={{ minWidth: 0, flex: 1 }}>
                        <Text fw={600} c="gray.0" fz={{ base: "sm", sm: "md" }}>
                          {event.name}
                        </Text>
                        <Text
                          fz={{ base: "xs", sm: "sm" }}
                          c="gray.4"
                          style={{ wordBreak: "break-word" }}
                        >
                          {event.venues?.name} • {new Date(event.start).toLocaleDateString()}
                        </Text>
                      </div>
                      <Badge variant="light" color="blue" size="sm">
                        Upcoming
                      </Badge>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon
                    size={50}
                    radius="xl"
                    variant="light"
                    color="gray"
                  >
                    <IconCalendarEvent size={25} />
                  </ThemeIcon>
                  <Text c="gray.5" ta="center" fz={{ base: "sm", sm: "md" }}>
                    No upcoming events
                  </Text>
                  <Button
                    component={Link}
                    href="/promoter/events/create"
                    size="sm"
                    variant="light"
                  >
                    Create Event
                  </Button>
                </Stack>
              </Center>
            )}
          </ThemedCard>
        </GridCol>

        {/* Artists Overview */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <ThemedCard h="100%">
            <Group justify="space-between" mb="lg" wrap="wrap">
              <Stack gap={4}>
                <Title order={3} c="gray.0" fz={{ base: "lg", sm: "xl" }}>Your Artists</Title>
                <Text size="sm" c="gray.5">
                  {pendingInvites > 0
                    ? `${pendingInvites} pending invite${pendingInvites === 1 ? '' : 's'}`
                    : receivedRequestsWithAvatars.length > 0
                      ? `${receivedRequestsWithAvatars.length} artist request${receivedRequestsWithAvatars.length === 1 ? '' : 's'} pending`
                      : "All artists in your collective"
                  }
                </Text>
              </Stack>
              <Button size="xs" variant="light" component={Link} href="/promoter/artists">
                View All
              </Button>
            </Group>

            {/* Show received artist requests first if any */}
            {receivedRequestsWithAvatars.length > 0 && (
              <Stack gap="md" mb="lg">
                <Group gap="xs">
                  <ThemeIcon size="sm" radius="xl" variant="light" color="blue">
                    <IconUserPlus size={12} />
                  </ThemeIcon>
                  <Text size="sm" fw={600} c="blue">Artist Requests</Text>
                </Group>
                {receivedRequestsWithAvatars.slice(0, 2).map((request) => (
                  <Paper
                    key={request.id}
                    p="md"
                    radius="md"
                    withBorder
                    bg="dark.7"
                    style={{ borderColor: "var(--mantine-color-blue-9)" }}
                  >
                    <Group justify="space-between" wrap="wrap">
                      <Group>
                        <Avatar
                          src={request.artist?.avatarUrl}
                          size="md"
                          radius="xl"
                        >
                          {request.artist?.name?.[0]}
                        </Avatar>
                        <div style={{ flex: 1 }}>
                          <Text fw={600} c="gray.0">{request.artist?.name}</Text>
                          <Text size="sm" c="gray.4" lineClamp={1}>
                            {request.artist?.bio || "No bio available"}
                          </Text>
                        </div>
                      </Group>
                      <RequestActions requestId={request.id} />
                    </Group>
                  </Paper>
                ))}
              </Stack>
            )}

            {artistsWithAvatars.length > 0 ? (
              <Stack gap="md">
                {receivedRequestsWithAvatars.length > 0 && (
                  <Group gap="xs">
                    <ThemeIcon size="sm" radius="xl" variant="light" color="gray">
                      <IconUsers size={12} />
                    </ThemeIcon>
                    <Text size="sm" fw={600} c="gray.4">Current Artists</Text>
                  </Group>
                )}
                {artistsWithAvatars.slice(0, receivedRequestsWithAvatars.length > 0 ? 2 : 3).map((artist) => (
                  <Paper
                    key={artist.id}
                    p="md"
                    radius="md"
                    withBorder
                    bg="dark.7"
                    style={{ borderColor: "var(--mantine-color-dark-5)" }}
                  >
                    <Group>
                      <Avatar
                        src={artist.avatarUrl}
                        size="md"
                        radius="xl"
                      >
                        {artist.name?.[0]}
                      </Avatar>
                      <div style={{ flex: 1 }}>
                        <Text fw={600} c="gray.0">{artist.name}</Text>
                        <Text size="sm" c="gray.4" lineClamp={1}>
                          {artist.bio || "No bio available"}
                        </Text>
                      </div>
                    </Group>
                  </Paper>
                ))}
              </Stack>
            ) : receivedRequestsWithAvatars.length === 0 ? (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                    <IconUsers size={30} />
                  </ThemeIcon>
                  <Text c="gray.5" ta="center">No artists in your collective yet</Text>
                  <Button size="sm" variant="light" component={Link} href="/promoter/artists">Add Artists</Button>
                </Stack>
              </Center>
            ) : null}
          </ThemedCard>
        </GridCol>
      </Grid>

      {/* Quick Actions */}
      <ThemedCard mt="xl">
        <Title order={3} mb="lg" c="gray.0" fz={{ base: "lg", sm: "xl" }}>Quick Actions</Title>
        <Group gap="md" justify="center">
          <Button
            component={Link}
            href="/promoter/events/create"
            leftSection={<IconCalendarEvent size={16} />}
            w={{ base: "100%", sm: "auto" }}
            maw={{ base: "none", sm: 200 }}
          >
            Create Event
          </Button>
          <Button
            variant="light"
            leftSection={<IconUsers size={16} />}
            component={Link}
            href="/promoter/artists"
            w={{ base: "100%", sm: "auto" }}
            maw={{ base: "none", sm: 200 }}
          >
            Add Artists
          </Button>
          <Button
            variant="light"
            leftSection={<IconChartBar size={16} />}
            w={{ base: "100%", sm: "auto" }}
            maw={{ base: "none", sm: 200 }}
          >
            View Analytics
          </Button>
        </Group>
      </ThemedCard>
    </Container>
  );
}
