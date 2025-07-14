import { getPromoter, getPromoterArtists, getPromoterEvents, getPromoterShowCount, getPromoterTrackCount } from "@/db/queries/promoters";
import { getSentRequests } from "@/db/queries/requests";
import { getUserProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { getAvatarUrlServer, getPromoterImagesServer } from "@/lib/images/image-utils";
import { nameToUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Avatar, Badge, Button, Card, Center, Container, Grid, GridCol, Group, Paper, Stack, Text, ThemeIcon, Title } from "@mantine/core";
import { IconArrowLeft, IconCalendarEvent, IconChartBar, IconMusic, IconSparkles, IconTrendingUp, IconUser, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { redirect } from "next/navigation";

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
  const [upcomingEvents, artists, trackMetrics, showMetrics, promoterImages, sentRequests] = await Promise.all([
    getPromoterEvents(supabase, promoter.id),
    getPromoterArtists(supabase, promoter.id),
    getPromoterTrackCount(supabase, promoter.id),
    getPromoterShowCount(supabase, promoter.id),
    getPromoterImagesServer(supabase, promoter.id),
    getSentRequests(supabase, user.id),
  ]);

  // Process artist avatar URLs (separate from promoter images to avoid double calls)
  const artistsWithAvatars = await Promise.all(
    artists.map(async (artist: any) => ({
      ...artist,
      avatarUrl: artist.avatar_img ? await getAvatarUrlServer(artist.avatar_img) : null,
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
        p={{ base: "md", sm: "lg", md: "xl" }}
        mb={{ base: "md", sm: "lg", md: "xl" }}
        bg="dark.8"
        withBorder
        style={{ borderColor: "var(--mantine-color-dark-6)" }}
      >
        <Grid align="center" gutter={{ base: "md", sm: "lg" }}>
          <GridCol span={12}>
            <Stack
              gap="lg"
              align="center"
              style={{
                '@media (min-width: 48em)': {
                  alignItems: 'flex-start',
                }
              }}
            >
              <Group
                gap="lg"
                align="flex-start"
                justify="center"
                wrap="nowrap"
                w="100%"
                style={{
                  '@media (min-width: 48em)': {
                    justifyContent: 'flex-start',
                  }
                }}
              >
                <Avatar
                  src={avatarUrl}
                  size={120}
                  radius="xl"
                  style={{
                    border: "2px solid var(--mantine-color-dark-5)",
                    background: avatarUrl ? "transparent" : "var(--mantine-color-dark-6)",
                    width: '80px',
                    height: '80px',
                    '@media (min-width: 48em)': {
                      width: '100px',
                      height: '100px',
                    },
                    '@media (min-width: 62em)': {
                      width: '120px',
                      height: '120px',
                    }
                  }}
                >
                  {!avatarUrl && <IconSparkles size={32} />}
                </Avatar>
                <Stack gap="sm" align="center" style={{ flex: 1, minWidth: 0 }}>
                  <Group gap="sm" align="center" justify="center" wrap="wrap">
                    <Title
                      order={1}
                      fw={600}
                      c="gray.0"
                      ta="center"
                      style={{
                        fontSize: '1.5rem',
                        '@media (min-width: 48em)': {
                          fontSize: '1.75rem',
                          textAlign: 'left',
                        },
                        '@media (min-width: 62em)': {
                          fontSize: '2rem',
                        }
                      }}
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
                    gap="sm"
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
                      ta="center"
                      lineClamp={2}
                      style={{
                        '@media (min-width: 48em)': {
                          textAlign: 'left',
                        }
                      }}
                    >
                      {promoter.bio}
                    </Text>
                  )}
                </Stack>
              </Group>
              <Group
                gap="sm"
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
          <Card
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="md"
            withBorder
            bg="dark.8"
            style={{ borderColor: "var(--mantine-color-dark-6)" }}
          >
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
          </Card>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <Card
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="md"
            withBorder
            bg="dark.8"
            style={{ borderColor: "var(--mantine-color-dark-6)" }}
          >
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
          </Card>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <Card
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="md"
            withBorder
            bg="dark.8"
            style={{ borderColor: "var(--mantine-color-dark-6)" }}
          >
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
          </Card>
        </GridCol>

        <GridCol span={{ base: 12, sm: 6, lg: 3 }}>
          <Card
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="md"
            withBorder
            bg="dark.8"
            style={{ borderColor: "var(--mantine-color-dark-6)" }}
          >
            <Group justify="space-between" wrap="nowrap">
              <div style={{ minWidth: 0, flex: 1 }}>
                <Text
                  size="xs"
                  tt="uppercase"
                  fw={700}
                  c="gray.5"
                  mb={4}
                >
                  Performance
                </Text>
                <Text
                  fw={700}
                  size="xl"
                  c="gray.0"
                >
                  {Math.round((trackMetrics.recent / Math.max(trackMetrics.total, 1)) * 100)}%
                </Text>
                <Text size="xs" c="gray.6">
                  Activity rate
                </Text>
              </div>
              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color="blue"
              >
                <IconTrendingUp size={30} />
              </ThemeIcon>
            </Group>
          </Card>
        </GridCol>
      </Grid>

      {/* Content Grid */}
      <Grid gutter={{ base: "md", sm: "lg", md: "xl" }}>
        {/* Upcoming Events */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <Card
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="md"
            withBorder
            h="100%"
            bg="dark.8"
            style={{ borderColor: "var(--mantine-color-dark-6)" }}
          >
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
                          {event.venues?.name} • {new Date(event.date).toLocaleDateString()}
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
          </Card>
        </GridCol>

        {/* Artists Overview */}
        <GridCol span={{ base: 12, lg: 6 }}>
          <Card
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="md"
            withBorder
            h="100%"
            bg="dark.8"
            style={{ borderColor: "var(--mantine-color-dark-6)" }}
          >
            <Group justify="space-between" mb="lg" wrap="wrap">
              <Stack gap={4}>
                <Title order={3} c="gray.0" fz={{ base: "lg", sm: "xl" }}>Your Artists</Title>
                <Text size="sm" c="gray.5">
                  {pendingInvites > 0
                    ? `${pendingInvites} pending invite${pendingInvites === 1 ? '' : 's'}`
                    : "All artists in your collective"
                  }
                </Text>
              </Stack>
              <Button size="xs" variant="light" component={Link} href="/promoter/artists">
                View All
              </Button>
            </Group>

            {artistsWithAvatars.length > 0 ? (
              <Stack gap="md">
                {artistsWithAvatars.slice(0, 3).map((artist) => (
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
            ) : (
              <Center py="xl">
                <Stack align="center" gap="md">
                  <ThemeIcon size={60} radius="xl" variant="light" color="gray">
                    <IconUsers size={30} />
                  </ThemeIcon>
                  <Text c="gray.5" ta="center">No artists in your collective yet</Text>
                  <Button size="sm" variant="light" component={Link} href="/promoter/artists">Add Artists</Button>
                </Stack>
              </Center>
            )}
          </Card>
        </GridCol>
      </Grid>

      {/* Quick Actions */}
      <Card
        p={{ base: "md", sm: "lg", md: "xl" }}
        radius="md"
        withBorder
        mt="xl"
        bg="dark.8"
        style={{ borderColor: "var(--mantine-color-dark-6)" }}
      >
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
      </Card>
    </Container>
  );
}
