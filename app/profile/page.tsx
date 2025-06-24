import { getUserEntities } from "@/db/queries/user-entities";
import { createClient } from "@/utils/supabase/server";
import { nameToUrl } from "@/lib/utils";
import {
  Container,
  Title,
  Text,
  Card,
  Group,
  Button,
  Stack,
  Badge,
  Grid,
  GridCol,
  ThemeIcon,
  rem,
  CardSection,
} from "@mantine/core";
import {
  IconMicrophone,
  IconBuilding,
  IconTicket,
  IconUser,
  IconArrowRight,
} from "@tabler/icons-react";
import Link from "next/link";

export default async function ProfilePage() {
  // Get the user's entities
  const supabase = await createClient();
  const userEntities = await getUserEntities(supabase);

  return (
    <Container>
      <Title order={1} mb="xl">
        Your Profile
      </Title>

      <Grid gutter="lg">
        {/* Fan Badge - Everyone has this */}
        <GridCol span={{ base: 12, md: 6, lg: 4 }}>
          <Card withBorder shadow="sm" padding="lg" radius="md" h="100%">
            <CardSection withBorder inheritPadding py="md">
              <Group justify="space-between">
                <Group>
                  <ThemeIcon
                    size={36}
                    radius="md"
                    color="green"
                    variant="light"
                  >
                    <IconUser size={rem(20)} />
                  </ThemeIcon>
                  <div>
                    <Title order={3}>Fan</Title>
                    <Text size="sm" c="dimmed">
                      Your fan profile
                    </Text>
                  </div>
                </Group>
                <Badge color="green" variant="light">
                  Active
                </Badge>
              </Group>
            </CardSection>

            <Stack mt="md" gap="md">
              <Text>
                Discover and enjoy new music from artists around the world.
              </Text>
              <Text size="sm" c="dimmed">
                You can follow artists, create playlists, and like tracks.
              </Text>
            </Stack>

            <Button
              component={Link}
              href="/discover"
              variant="light"
              color="green"
              fullWidth
              mt="md"
              rightSection={<IconArrowRight size={14} />}
            >
              Browse Music
            </Button>
          </Card>
        </GridCol>

        {/* Artist Card - Only shown if user has an artist entity */}
        {userEntities.artist && (
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" padding="lg" radius="md" h="100%">
              <CardSection withBorder inheritPadding py="md">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon
                      size={36}
                      radius="md"
                      color="blue"
                      variant="light"
                    >
                      <IconMicrophone size={rem(20)} />
                    </ThemeIcon>
                    <div>
                      <Title order={3}>Artist</Title>
                      <Text size="sm" c="dimmed">
                        Your artist profile
                      </Text>
                    </div>
                  </Group>
                  <Badge color="blue" variant="light">
                    Active
                  </Badge>
                </Group>
              </CardSection>

              <Stack mt="md" gap="md">
                <Text>{userEntities.artist.name}</Text>
                <Text size="sm" c="dimmed" lineClamp={2}>
                  {userEntities.artist.bio || "No bio available."}
                </Text>
              </Stack>

              <Group grow mt="md">
                <Button
                  component={Link}
                  href={`/artists/${nameToUrl(userEntities.artist.name)}`}
                  variant="light"
                  color="blue"
                  rightSection={<IconArrowRight size={14} />}
                >
                  View Profile
                </Button>
              </Group>
            </Card>
          </GridCol>
        )}

        {/* Promoter Card - Only shown if user has a promoter entity */}
        {userEntities.promoter && (
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" padding="lg" radius="md" h="100%">
              <CardSection withBorder inheritPadding py="md">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon
                      size={36}
                      radius="md"
                      color="orange"
                      variant="light"
                    >
                      <IconTicket size={rem(20)} />
                    </ThemeIcon>
                    <div>
                      <Title order={3}>Promoter</Title>
                      <Text size="sm" c="dimmed">
                        Your promoter profile
                      </Text>
                    </div>
                  </Group>
                  <Badge color="orange" variant="light">
                    Active
                  </Badge>
                </Group>
              </CardSection>

              <Stack mt="md" gap="md">
                <Text>{userEntities.promoter.name}</Text>
                <Text size="sm" c="dimmed">
                  Promote events and connect with artists and venues.
                </Text>
              </Stack>

              <Button
                component={Link}
                href={`/promoters/${nameToUrl(userEntities.promoter.name)}`}
                variant="light"
                color="orange"
                fullWidth
                mt="md"
                rightSection={<IconArrowRight size={14} />}
              >
                View Promoter Profile
              </Button>
            </Card>
          </GridCol>
        )}

        {/* Venue Card - Only shown if user has a venue entity */}
        {userEntities.venue && (
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Card withBorder shadow="sm" padding="lg" radius="md" h="100%">
              <CardSection withBorder inheritPadding py="md">
                <Group justify="space-between">
                  <Group>
                    <ThemeIcon
                      size={36}
                      radius="md"
                      color="violet"
                      variant="light"
                    >
                      <IconBuilding size={rem(20)} />
                    </ThemeIcon>
                    <div>
                      <Title order={3}>Venue</Title>
                      <Text size="sm" c="dimmed">
                        Your venue profile
                      </Text>
                    </div>
                  </Group>
                  <Badge color="violet" variant="light">
                    Active
                  </Badge>
                </Group>
              </CardSection>

              <Stack mt="md" gap="md">
                <Text>{userEntities.venue.address || "Your Venue"}</Text>
                <Text size="sm" c="dimmed">
                  Host performances and events at your venue.
                </Text>
              </Stack>

              <Button
                component={Link}
                href={`/venues/${nameToUrl(userEntities.venue.name)}`}
                variant="light"
                color="violet"
                fullWidth
                mt="md"
                rightSection={<IconArrowRight size={14} />}
              >
                View Venue Profile
              </Button>
            </Card>
          </GridCol>
        )}

        {/* Add Entity Cards - Only shown when user doesn't have all entity types */}
        {!userEntities.artist && (
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              withBorder
              shadow="sm"
              padding="lg"
              radius="md"
              h="100%"
              style={{ borderStyle: "dashed" }}
            >
              <Stack align="center" justify="center" h="100%" gap="md">
                <ThemeIcon size={48} radius="md" color="blue" variant="light">
                  <IconMicrophone size={rem(24)} />
                </ThemeIcon>
                <Title order={3} ta="center">
                  Become an Artist
                </Title>
                <Text size="sm" c="dimmed" ta="center">
                  Upload and share your music with fans
                </Text>
                <Button
                  component={Link}
                  href="/artists/create"
                  variant="light"
                  color="blue"
                  mt="md"
                >
                  Create Artist Profile
                </Button>
              </Stack>
            </Card>
          </GridCol>
        )}

        {!userEntities.promoter && (
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              withBorder
              shadow="sm"
              padding="lg"
              radius="md"
              h="100%"
              style={{ borderStyle: "dashed" }}
            >
              <Stack align="center" justify="center" h="100%" gap="md">
                <ThemeIcon size={48} radius="md" color="orange" variant="light">
                  <IconTicket size={rem(24)} />
                </ThemeIcon>
                <Title order={3} ta="center">
                  Become a Promoter
                </Title>
                <Text size="sm" c="dimmed" ta="center">
                  Promote events and artists
                </Text>
                <Button
                  component={Link}
                  href="/promoters/create"
                  variant="light"
                  color="orange"
                  mt="md"
                >
                  Create Promoter Profile
                </Button>
              </Stack>
            </Card>
          </GridCol>
        )}

        {!userEntities.venue && (
          <GridCol span={{ base: 12, md: 6, lg: 4 }}>
            <Card
              withBorder
              shadow="sm"
              padding="lg"
              radius="md"
              h="100%"
              style={{ borderStyle: "dashed" }}
            >
              <Stack align="center" justify="center" h="100%" gap="md">
                <ThemeIcon size={48} radius="md" color="violet" variant="light">
                  <IconBuilding size={rem(24)} />
                </ThemeIcon>
                <Title order={3} ta="center">
                  Register a Venue
                </Title>
                <Text size="sm" c="dimmed" ta="center">
                  Host events and performances
                </Text>
                <Button
                  component={Link}
                  href="/venues/create"
                  variant="light"
                  color="violet"
                  mt="md"
                >
                  Register Venue
                </Button>
              </Stack>
            </Card>
          </GridCol>
        )}
      </Grid>
    </Container>
  );
}
