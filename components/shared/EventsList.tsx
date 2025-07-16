"use client";

import EventCard from "@/components/events/EventCard";
import { Event, Venue } from "@/utils/supabase/global.types";
import { Container, Stack, Text, Title } from "@mantine/core";

// Type for events with populated venue data
type EventWithVenue = Pick<Event, 'id' | 'name' | 'start'> & {
  venues?: Pick<Venue, 'id' | 'name'> | null;
};

interface EventsListProps {
  events: EventWithVenue[];
  title?: string;
  artistName?: string;
  emptyStateMessage?: string;
}

const EventsList = ({
  events,
  title = "Upcoming Events",
  artistName = "",
  emptyStateMessage = "No upcoming events scheduled."
}: EventsListProps) => {
  const upcomingEvents = events.filter(event => event.start);

  return (
    <Container size="md">
      <Title order={2} mb="md" c="gray.0">{title}</Title>
      {upcomingEvents.length > 0 ? (
        <Stack gap="lg">
          {upcomingEvents.map((event) => (
            <EventCard
              key={event.id}
              id={event.id}
              title={event.name}
              description={artistName ? `Join ${artistName} for a live performance at ${event.venues?.name || 'this venue'}.` : event.name}
              date={event.start!}
              venue={{
                name: event.venues?.name || 'TBA',
                location: 'Location TBA'
              }}
              category="LIVE PERFORMANCE"
              artistName={artistName}
            />
          ))}
        </Stack>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          {emptyStateMessage}
        </Text>
      )}
    </Container>
  );
};

export default EventsList;
