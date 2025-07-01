"use client";

import { Container, Title, Text, Stack } from "@mantine/core";
import EventCard from "@/components/events/EventCard";

interface Event {
  id: string;
  name: string;
  date: string | null;
  venues?: {
    id: string;
    name: string;
  } | null;
}

interface EventsListProps {
  events: Event[];
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
  const upcomingEvents = events.filter(event => event.date);

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
              date={event.date!}
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
