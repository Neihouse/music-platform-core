"use client";

import { useState } from "react";
import { Button, Group, Text, Paper, Stack, Title, Anchor } from "@mantine/core";
import { IconMapPin, IconEdit, IconCheck, IconX, IconPlus } from "@tabler/icons-react";
import { updateEventVenue } from "@/app/events/[eventId]/actions";
import { VenueSearch } from "@/components/VenueSearch";
import Link from "next/link";

interface Venue {
  id: string;
  name: string;
  address?: string | null;
  capacity?: number | null;
}

interface Event {
  id: string;
  name: string;
  venue?: string | null;
  venues?: {
    id: string;
    name: string;
    address?: string | null;
  } | null;
}

interface VenueSelectorProps {
  event: Event;
  availableVenues: Venue[];
}

export function VenueSelector({ event, availableVenues }: VenueSelectorProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedVenue, setSelectedVenue] = useState(event.venue || "");
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async () => {
    if (selectedVenue === event.venue) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    try {
      await updateEventVenue(event.id, selectedVenue || null);
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update venue:", error);
      alert(`Failed to update venue: ${error instanceof Error ? error.message : 'Unknown error'}`);
      // Reset to original value
      setSelectedVenue(event.venue || "");
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setSelectedVenue(event.venue || "");
    setIsEditing(false);
  };

  const handleVenueSelect = (venue: Venue | null) => {
    setSelectedVenue(venue?.id || "");
  };

  if (isEditing) {
    return (
      <Paper shadow="sm" p="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between">
            <Title order={3} size="h4">Event Venue</Title>
          </Group>

          <VenueSearch
            venues={availableVenues}
            selectedVenueId={selectedVenue}
            onSelect={handleVenueSelect}
            placeholder="Search and select a venue..."
          />

          <Group gap="xs" justify="space-between">
            <Anchor
              component={Link}
              href="/venues/create"
              size="sm"
              target="_blank"
            >
              <Group gap={4}>
                <IconPlus size={14} />
                Create New Venue
              </Group>
            </Anchor>

            <Group gap="xs">
              <Button
                size="sm"
                onClick={handleSave}
                loading={isLoading}
                leftSection={<IconCheck size={16} />}
              >
                Save
              </Button>
              <Button
                size="sm"
                variant="outline"
                onClick={handleCancel}
                disabled={isLoading}
                leftSection={<IconX size={16} />}
              >
                Cancel
              </Button>
            </Group>
          </Group>
        </Stack>
      </Paper>
    );
  }

  return (
    <Paper shadow="sm" p="md" withBorder>
      <Group justify="space-between" align="flex-start">
        <Stack gap="xs" style={{ flex: 1 }}>
          <Title order={3} size="h4">Event Venue</Title>
          
          {event.venues ? (
            <Group gap="xs">
              <IconMapPin size={16} />
              <div>
                <Text fw={500}>{event.venues.name}</Text>
                {event.venues.address && (
                  <Text size="sm" c="dimmed">{event.venues.address}</Text>
                )}
              </div>
            </Group>
          ) : (
            <Group gap="xs">
              <IconMapPin size={16} />
              <Text c="dimmed" fs="italic">No venue selected</Text>
            </Group>
          )}
        </Stack>

        <Button
          size="sm"
          variant="outline"
          onClick={() => setIsEditing(true)}
          leftSection={<IconEdit size={16} />}
        >
          {event.venues ? 'Change Venue' : 'Add Venue'}
        </Button>
      </Group>
    </Paper>
  );
}
