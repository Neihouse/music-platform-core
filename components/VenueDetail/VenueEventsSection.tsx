"use client";

import {
  Card,
  Group,
  Stack,
  Text,
  Title,
  Badge,
  Button,
  SimpleGrid,
  Center,
  ThemeIcon,
  Paper,
  Box,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconClock,
  IconMapPin,
  IconUsers,
  IconCalendarOff,
} from "@tabler/icons-react";

// Helper functions for date formatting
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

interface VenueEventsSectionProps {
  events: any[];
  type: "upcoming" | "past";
  emptyMessage: string;
}

export function VenueEventsSection({
  events,
  type,
  emptyMessage,
}: VenueEventsSectionProps) {
  if (events.length === 0) {
    return (
      <Paper p="xl" radius="lg" withBorder style={{ background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)" }}>
        <Center py="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} variant="light" color="gray" radius="xl">
              <IconCalendarOff size={40} />
            </ThemeIcon>
            <Text size="xl" fw={500} ta="center" c="dimmed">
              {emptyMessage}
            </Text>
          </Stack>
        </Center>
      </Paper>
    );
  }

  return (
    <SimpleGrid cols={{ base: 1, sm: 2, lg: 3 }} spacing="xl">
      {events.map((event) => (
        <EventCard key={event.id} event={event} type={type} />
      ))}
    </SimpleGrid>
  );
}

interface EventCardProps {
  event: any;
  type: "upcoming" | "past";
}

function EventCard({ event, type }: EventCardProps) {
  const artists = event.events_artists?.map((ea: any) => ea.artists?.name).filter(Boolean) || [];

  return (
    <Card 
      shadow="md" 
      p="lg" 
      radius="xl" 
      withBorder 
      h="100%"
      style={{
        background: type === "upcoming" 
          ? "linear-gradient(135deg, #667eea 0%, #764ba2 100%)"
          : "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)",
        color: "white",
        transition: "transform 0.2s ease",
        cursor: "pointer",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      <Stack gap="md" h="100%">
        <Group justify="space-between" align="flex-start">
          <Badge
            color={type === "upcoming" ? "yellow" : "pink"}
            variant="light"
            size="sm"
            style={{ color: "white", fontWeight: 600 }}
          >
            {type === "upcoming" ? "Upcoming" : "Past Event"}
          </Badge>
          <ThemeIcon size="sm" variant="light" color="white" opacity={0.3}>
            <IconCalendarEvent size={16} />
          </ThemeIcon>
        </Group>

        <Title order={4} lineClamp={2} c="white" fw={600}>
          {event.name}
        </Title>

        {event.date && (
          <Group gap="lg" mb="sm">
            <Group gap="xs">
              <IconCalendarEvent size={16} opacity={0.8} />
              <Text size="sm" opacity={0.9}>
                {formatDate(event.date)}
              </Text>
            </Group>
            <Group gap="xs">
              <IconClock size={16} opacity={0.8} />
              <Text size="sm" opacity={0.9}>
                {formatTime(event.date)}
              </Text>
            </Group>
          </Group>
        )}

        {event.address && (
          <Group gap="xs" mb="sm">
            <IconMapPin size={16} opacity={0.8} />
            <Text size="sm" opacity={0.9} lineClamp={1}>
              {event.address}
            </Text>
          </Group>
        )}

        {artists.length > 0 && (
          <Box mb="sm">
            <Text size="sm" fw={500} mb={6} opacity={0.8}>
              Featured Artists:
            </Text>
            <Group gap="xs">
              {artists.slice(0, 2).map((artist: string, index: number) => (
                <Badge key={index} variant="light" size="xs" color="white" opacity={0.9}>
                  {artist}
                </Badge>
              ))}
              {artists.length > 2 && (
                <Badge variant="light" size="xs" color="white" opacity={0.7}>
                  +{artists.length - 2} more
                </Badge>
              )}
            </Group>
          </Box>
        )}

        <Button 
          variant="white" 
          size="sm" 
          mt="auto"
          style={{ color: type === "upcoming" ? "#667eea" : "#f5576c" }}
        >
          View Details
        </Button>
      </Stack>
    </Card>
  );
}
