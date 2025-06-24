import { getEventByName } from "@/db/queries/events";
import { getAvailableVenues } from "./actions";
import { VenueSelector } from "@/components/events/VenueSelector";
import { notFound } from "next/navigation";
import { Paper, Title, Text, Button, Group, Stack, Container, Box } from "@mantine/core";
import { IconUsers, IconCalendar, IconPhoto } from "@tabler/icons-react";
import { urlToName, nameToUrl } from "@/lib/utils";
import Link from "next/link";

interface EventDetailPageProps {
  params: Promise<{
    eventName: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  try {
    const eventName = urlToName((await params).eventName);
    const event = await getEventByName(eventName);
    const availableVenues = await getAvailableVenues();

    return (
      <Container size="lg">
        <Stack gap="lg">
          {/* Event Banner Placeholder */}
          <Box
            style={{
              height: '300px',
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              overflow: 'hidden'
            }}
          >
            <Stack align="center" gap="md" style={{ color: 'white', textAlign: 'center' }}>
              <IconPhoto size={48} opacity={0.7} />
              <Text size="lg" fw={500}>Event Banner</Text>
              <Text size="sm" opacity={0.8}>Upload a banner image for this event</Text>
            </Stack>
          </Box>

          <Paper shadow="sm" p="xl">
            <Stack gap="md">
              <Title order={1}>{event.name}</Title>
              
              <Group gap="xl">
                {event.date && (
                  <Group gap="xs">
                    <IconCalendar size={16} />
                    <Text>{new Date(event.date).toLocaleDateString()}</Text>
                  </Group>
                )}
              </Group>
              
              {event.address && (
                <Text c="dimmed">{event.address}</Text>
              )}
            </Stack>
          </Paper>

          {/* Venue Selection */}
          <VenueSelector event={event} availableVenues={availableVenues} />

          <Paper shadow="sm" p="xl">
            <Stack gap="md">
              <Title order={2}>Event Management</Title>
              <Text c="dimmed">
                Use the lineup planner to organize artists across different stages for your event.
              </Text>
              
              <Group>
                <Button
                  component={Link}
                  href={`/events/${nameToUrl(event.name)}/lineup`}
                  leftSection={<IconUsers size={16} />}
                  size="lg"
                >
                  Go to Planner
                </Button>
              </Group>
            </Stack>
          </Paper>
        </Stack>
      </Container>
    );
  } catch (error) {
    notFound();
  }
}
