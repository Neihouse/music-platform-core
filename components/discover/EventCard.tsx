"use client";

import {
  Card,
  Badge,
  ThemeIcon,
  Box,
  Button,
  Group,
  Text,
  Stack,
  Title,
  rem,
} from "@mantine/core";
import { 
  IconBuilding, 
  IconCalendarEvent, 
  IconTicket,
} from "@tabler/icons-react";
import { LocalEvent } from "@/app/discover/actions";

interface EventCardProps {
  event: LocalEvent;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.date);
  const isUpcoming = eventDate > new Date();
  const daysUntil = Math.ceil((eventDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24));
  
  return (
    <Card 
      radius="xl" 
      shadow="lg" 
      padding="lg"
      withBorder
      style={{
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid var(--mantine-color-gray-2)',
        background: 'linear-gradient(135deg, rgba(var(--mantine-color-pink-1-rgb), 0.5), rgba(255,255,255,0.9))',
        position: 'relative',
      }}
      className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300"
    >
      {/* Gradient Overlay */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, var(--mantine-color-pink-5), var(--mantine-color-orange-5))',
        }}
      />

      {/* Header */}
      <Group justify="space-between" mb="md" align="flex-start">
        <ThemeIcon 
          size="xl" 
          radius="xl" 
          variant="gradient" 
          gradient={{ from: 'pink', to: 'orange' }}
          style={{ 
            boxShadow: '0 4px 20px rgba(255,20,147,0.3)',
            flexShrink: 0 
          }}
        >
          <IconTicket size={24} />
        </ThemeIcon>
        
        <Stack gap={4} align="flex-end" style={{ flex: 1, minWidth: 0 }}>
          {event.price && (
            <Badge
              size="lg"
              variant="gradient"
              gradient={{ from: 'green', to: 'teal' }}
              style={{ fontWeight: 700, fontSize: rem(12) }}
            >
              {event.price}
            </Badge>
          )}
          {isUpcoming && daysUntil <= 7 && (
            <Badge
              size="sm"
              variant="light"
              color="red"
              style={{ fontWeight: 600 }}
            >
              {daysUntil === 0 ? 'Today!' : `${daysUntil}d`}
            </Badge>
          )}
        </Stack>
      </Group>

      {/* Event Details */}
      <Stack gap="sm" mb="lg">
        <Title order={3} size={rem(18)} fw={700} lineClamp={1} style={{ lineHeight: 1.3 }}>
          {event.name}
        </Title>
        
        <Group gap="xs" align="center">
          <ThemeIcon size="sm" variant="light" color="gray" radius="xl">
            <IconBuilding size={12} />
          </ThemeIcon>
          <Text size="sm" c="dimmed" fw={500}>
            {event.venue}
          </Text>
        </Group>
        
        <Group gap="xs" align="center">
          <ThemeIcon size="sm" variant="light" color="blue" radius="xl">
            <IconCalendarEvent size={12} />
          </ThemeIcon>
          <Text size="sm" fw={600} c="blue.7">
            {eventDate.toLocaleDateString('en-US', { 
              weekday: 'short', 
              month: 'short', 
              day: 'numeric' 
            })} at {eventDate.toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </Text>
        </Group>
        
        {event.artists.length > 0 && (
          <Box>
            <Text size="xs" c="dimmed" fw={600} tt="uppercase" mb={4} style={{ letterSpacing: '0.5px' }}>
              Featuring
            </Text>
            <Text size="sm" c="dark" fw={500} lineClamp={1}>
              {event.artists.join(' • ')}
            </Text>
          </Box>
        )}
      </Stack>
      
      {/* Action Button */}
      <Button 
        fullWidth 
        variant="gradient" 
        gradient={{ from: 'pink', to: 'orange' }}
        size="md"
        radius="xl"
        leftSection={<IconTicket size={16} />}
        style={{ 
          fontWeight: 700,
          boxShadow: '0 4px 15px rgba(255,20,147,0.3)',
        }}
      >
        Get Tickets
      </Button>
    </Card>
  );
}
