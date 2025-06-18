import { getEvents } from "@/db/queries/events";
import { Paper, Title, Text, Button, Group, Stack, Container, Card, Badge, SimpleGrid } from "@mantine/core";
import { IconCalendar, IconMapPin, IconPlus, IconUsers } from "@tabler/icons-react";
import { nameToUrl } from "@/lib/utils";
import Link from "next/link";

export default async function EventsPage() {
  const events = await getEvents();

  return (
    <Container size="xl">
      <Stack gap="lg">
        <Paper shadow="sm" p="xl">
          <Group justify="space-between" align="center">
            <div>
              <Title order={1}>Events</Title>
              <Text c="dimmed">Manage your music events and lineups</Text>
            </div>
            <Button
              component={Link}
              href="/events/create"
              leftSection={<IconPlus size={16} />}
            >
              Create Event
            </Button>
          </Group>
        </Paper>

        {events.length === 0 ? (
          <Paper shadow="sm" p="xl" style={{ textAlign: "center" }}>
            <Stack gap="md" align="center">
              <IconCalendar size={48} stroke={1} color="#868e96" />
              <Title order={3} c="dimmed">No events yet</Title>
              <Text c="dimmed">Create your first event to get started with lineup planning</Text>
              <Button
                component={Link}
                href="/events/create"
                leftSection={<IconPlus size={16} />}
              >
                Create Your First Event
              </Button>
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
