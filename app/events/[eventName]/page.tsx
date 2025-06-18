import { getEventByName } from "@/db/queries/events";
import { getAvailableVenues } from "./actions";
import { VenueSelector } from "@/components/events/VenueSelector";
import { notFound } from "next/navigation";
import { Paper, Title, Text, Button, Group, Stack, Container } from "@mantine/core";
import { IconUsers, IconCalendar } from "@tabler/icons-react";
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
