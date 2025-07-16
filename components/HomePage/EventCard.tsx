"use client"

import { Event, Venue } from "@/utils/supabase/global.types";
import {
  Badge,
  Box,
  Button,
  Card,
  Group,
  rem,
  Stack,
  Text,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconMapPin,
  IconMicrophone,
  IconTicket,
} from "@tabler/icons-react";
import Link from "next/link";

// Use database-first types as per TYPE_USAGE_GUIDE.md
type EventWithVenue = Pick<Event, 'id' | 'name' | 'start'> & {
  hash?: string;
  venues: Pick<Venue, 'id' | 'name' | 'address'> | null;
};

interface EventCardProps {
  event: EventWithVenue;
}

export default function EventCard({ event }: EventCardProps) {
  return (
    <Card
      shadow="md"
      padding="lg"
      radius="lg"
      withBorder
      style={{
        overflow: 'hidden',
        position: 'relative',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 8px 32px rgba(0, 0, 0, 0.12)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.12)';
      }}
    >
      {/* Event image placeholder with professional gradient */}
      <Box
        style={{
          height: rem(200),
          background: `linear-gradient(135deg, 
            var(--mantine-color-${['indigo', 'cyan', 'blue'][Number(event.id) % 3]}-6) 0%, 
            var(--mantine-color-${['cyan', 'blue', 'violet'][Number(event.id) % 3]}-5) 50%,
            var(--mantine-color-${['indigo', 'cyan', 'blue'][Number(event.id) % 3]}-7) 100%)`,
          borderRadius: rem(8),
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: rem(16),
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Subtle overlay pattern */}
        <Box
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `linear-gradient(45deg, 
              rgba(0,0,0,0.1) 0%, 
              transparent 30%, 
              rgba(255,255,255,0.05) 70%, 
              transparent 100%)`,
          }}
        />

        {/* Clean icon without background circle */}
        <IconMicrophone
          size={40}
          color="white"
          style={{
            filter: "drop-shadow(0 2px 8px rgba(0,0,0,0.3))",
            opacity: 0.9
          }}
        />
      </Box>

      <Stack gap="sm">
        <Group justify="space-between" align="flex-start">
          <Title order={4} style={{ flex: 1 }} lineClamp={2}>
            {event.name}
          </Title>
          <Badge color="indigo" variant="light" size="sm">
            Live
          </Badge>
        </Group>

        <Group gap="xs">
          <ThemeIcon size="sm" color="gray" variant="light">
            <IconCalendarEvent size={14} />
          </ThemeIcon>
          <Text size="sm" c="dimmed">
            {event.start ? new Date(event.start).toLocaleDateString() : 'Date TBA'}
          </Text>
        </Group>

        <Group gap="xs">
          <ThemeIcon size="sm" color="gray" variant="light">
            <IconMapPin size={14} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" lineClamp={1}>
            {event.venues?.name || 'Venue TBA'}
          </Text>
        </Group>

        <Button
          component={Link}
          href={`/events/${event.hash}`}
          variant="light"
          color="indigo"
          size="sm"
          mt="sm"
          fullWidth
          rightSection={<IconTicket size={14} />}
        >
          View Event
        </Button>
      </Stack>
    </Card>
  );
}
