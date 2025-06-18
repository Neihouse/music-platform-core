"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/app/events/create/actions";
import { nameToUrl } from "@/lib/utils";
import { 
  Button, 
  TextInput, 
  Textarea, 
  Paper, 
  Title, 
  Stack, 
  Group
} from "@mantine/core";
import { VenueSearch } from "@/components/VenueSearch";

interface EventCreateFormProps {
  venues?: Array<{
    id: string;
    name: string;
    address?: string | null;
    capacity?: number | null;
  }>;
}

export function EventCreateForm({ venues = [] }: EventCreateFormProps) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    venue: "",
    address: "",
    locality: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const event = await createEvent({
        name: formData.name,
        date: formData.date || null,
        venue: formData.venue || null,
        address: formData.address || null,
        locality: formData.locality || null,
      });

      router.push(`/events/${nameToUrl(event.name)}`);
    } catch (error) {
      console.error("Failed to create event:", error);
      alert("Failed to create event. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVenueSelect = (venue: any) => {
    setFormData(prev => ({
      ...prev,
      venue: venue?.id || ""
    }));
  };

  return (
    <Paper shadow="md" p="xl" style={{ maxWidth: 600, margin: "0 auto" }}>
      <Title order={2} mb="lg">Create New Event</Title>
      
      <form onSubmit={handleSubmit}>
        <Stack gap="md">
          <TextInput
            label="Event Name"
            placeholder="Enter event name"
            required
            value={formData.name}
            onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
          />

          <TextInput
            label="Event Date"
            type="date"
            value={formData.date}
            onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
          />

          <div>
            <label style={{ fontSize: '14px', fontWeight: 500, marginBottom: '8px', display: 'block' }}>
              Venue (optional)
            </label>
            <VenueSearch
              venues={venues}
              selectedVenueId={formData.venue}
              onSelect={handleVenueSelect}
              placeholder="Search and select a venue..."
            />
          </div>

          <TextInput
            label="Address"
            placeholder="Event address"
            value={formData.address}
            onChange={(e) => setFormData(prev => ({ ...prev, address: e.target.value }))}
          />

          <TextInput
            label="Locality"
            placeholder="City/Locality"
            value={formData.locality}
            onChange={(e) => setFormData(prev => ({ ...prev, locality: e.target.value }))}
          />

          <Group justify="flex-end" mt="md">
            <Button
              variant="outline"
              onClick={() => router.back()}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button type="submit" loading={isLoading}>
              Create Event
            </Button>
          </Group>
        </Stack>
      </form>
    </Paper>
  );
}
