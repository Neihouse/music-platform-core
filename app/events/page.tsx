import { getEvents } from "@/db/queries/events";
import { getUserProfile } from "@/db/queries/user";
import { nameToUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { Button, Card, Container, Group, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { IconCalendar, IconMapPin, IconPlus, IconUsers } from "@tabler/icons-react";
import Link from "next/link";

export default async function EventsPage() {
  const supabase = await createClient();
  const userProfile = await getUserProfile(supabase);
  const events = await getEvents();

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Group justify="space-between" align="center">
          {userProfile?.type === 'promoter' && events.length > 0 && (
            <Button
              component={Link}
              href="/events/create"
              leftSection={<IconPlus size={16} />}
            >
              Create Event
            </Button>
          )}
        </Group>

        {events.length === 0 ? (
          <Paper shadow="sm" p="xl" style={{ textAlign: "center" }}>
            <Stack gap="md" align="center">
              <IconCalendar size={48} stroke={1} color="#868e96" />
              <Title order={3} c="dimmed">No events yet</Title>
              {userProfile?.type === 'promoter' ? (
                <>
                  <Text c="dimmed">Create your first event to get started with lineup planning</Text>
                  <Button
                    component={Link}
                    href="/events/create"
                    leftSection={<IconPlus size={16} />}
                  >
                    Create Your First Event
                  </Button>
                </>
              ) : (
                <Text c="dimmed">
                  {userProfile?.type === 'artist'
                    ? "Events will appear here once collectives start creating them"
                    : "Only collectives can create events. Sign up as a collective to start planning events."
                  }
                </Text>
              )}
            </Stack>
          </Paper>
        ) : (
          <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="lg">
            {events.map((event) => (
              <Card key={event.id} shadow="sm" padding="lg" radius="md" withBorder>
                <Stack gap="md">
                  <div>
                    <Title order={3} size="h4" mb="xs">
                      {event.name}
                    </Title>

                    {event.date && (
                      <Group gap="xs" mb="xs">
                        <IconCalendar size={16} />
                        <Text size="sm" c="dimmed">
                          {new Date(event.date).toLocaleDateString()}
                        </Text>
                      </Group>
                    )}

                    {event.venues && (
                      <Group gap="xs">
                        <IconMapPin size={16} />
                        <Text size="sm" c="dimmed">
                          {event.venues.name}
                        </Text>
                      </Group>
                    )}
                  </div>

                  <Group justify="space-between" mt="auto">
                    <Button
                      variant="outline"
                      component={Link}
                      href={`/events/${nameToUrl(event.name)}`}
                      size="sm"
                    >
                      View Details
                    </Button>
                    <Button
                      component={Link}
                      href={`/events/${nameToUrl(event.name)}/lineup`}
                      leftSection={<IconUsers size={14} />}
                      size="sm"
                    >
                      Lineup Planner
                    </Button>
                  </Group>
                </Stack>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </Stack>
    </Container>
  );
}
