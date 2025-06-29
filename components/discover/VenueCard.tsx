"use client";

import {
  Card,
  Badge,
  ThemeIcon,
  Box,
  Button,
  Group,
  Text,
  rem,
} from "@mantine/core";
import { 
  IconBuilding, 
  IconUsers, 
  IconCalendarEvent,
} from "@tabler/icons-react";
import { StyledTitle } from "@/components/StyledTitle";
import { LocalVenue } from "@/app/discover/actions";

interface VenueCardProps {
  venue: LocalVenue;
}

export function VenueCard({ venue }: VenueCardProps) {
  return (
    <Card 
      radius="xl" 
      shadow="lg" 
      padding="lg"
      withBorder
      style={{
        transition: 'all 0.3s ease',
        border: '1px solid var(--mantine-color-gray-2)',
        background: 'linear-gradient(135deg, rgba(var(--mantine-color-green-1-rgb), 0.3), rgba(255,255,255,0.9))',
      }}
      className="hover:shadow-2xl hover:-translate-y-1 transition-all duration-300"
    >
      {/* Header with Icon and Capacity */}
      <Group justify="space-between" mb="md">
        <ThemeIcon 
          size="xl" 
          radius="xl" 
          variant="gradient"
          gradient={{ from: 'green', to: 'teal' }}
          style={{ boxShadow: '0 4px 12px rgba(0,128,0,0.3)' }}
        >
          <IconBuilding size={24} />
        </ThemeIcon>
        {venue.capacity && (
          <Badge
            size="lg"
            variant="light"
            color="green"
            leftSection={<IconUsers size={14} />}
            style={{ fontWeight: 600 }}
          >
            {venue.capacity.toLocaleString()}
          </Badge>
        )}
      </Group>

      {/* Venue Name */}
      <StyledTitle
        selectedFont={venue.selectedFont}
        as="h3"
        style={{
          fontSize: rem(20),
          fontWeight: 700,
          marginBottom: rem(8),
          lineHeight: 1.2,
        }}
      >
        {venue.name}
      </StyledTitle>
      
      {/* Description */}
      {venue.description && (
        <Text size="sm" c="dimmed" mb="lg" lineClamp={2} style={{ lineHeight: 1.5 }}>
          {venue.description}
        </Text>
      )}
      
      {/* Stats and Action */}
      <Group justify="space-between" align="center">
        <Group gap="xs">
          <ThemeIcon size="sm" variant="light" color="green" radius="xl">
            <IconCalendarEvent size={12} />
          </ThemeIcon>
          <Text size="sm" c="green.7" fw={600}>
            {venue.upcomingEvents || 0} events
          </Text>
        </Group>
        <Button 
          variant="gradient"
          gradient={{ from: 'green', to: 'teal' }}
          size="sm"
          radius="xl"
          style={{ fontWeight: 600 }}
        >
          View Events
        </Button>
      </Group>
    </Card>
  );
}
