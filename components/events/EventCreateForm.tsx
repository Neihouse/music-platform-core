"use client";

import { ArtistSearch, ArtistSearchResult } from "@/components/ArtistSearch";
import { LocationInput } from "@/components/LocationInput";
import { EventPosterUpload } from "@/components/Upload";
import { createClient } from "@/utils/supabase/client";
import { StoredLocality } from "@/utils/supabase/global.types";
import {
  Button,
  Container,
  Group,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
  useMantineColorScheme
} from "@mantine/core";
import { Calendar } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCalendar, IconMapPin, IconPhoto, IconUsers } from "@tabler/icons-react";
import crypto from "crypto";
import { useRouter } from "next/navigation";
import { useState } from "react";

interface EventFormData {
  name: string;
  date: Date | null;
}

export interface IEventFormProps {
  // Removed onSubmit prop since we'll handle it internally
}

export function EventForm({ }: IEventFormProps) {
  const router = useRouter();
  const { colorScheme } = useMantineColorScheme();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'form' | 'poster'>('form');
  const [createdEvent, setCreatedEvent] = useState<any>(null);

  // Form state
  const [selectedPlace, setSelectedPlace] = useState<StoredLocality | undefined>();
  const [selectedArtists, setSelectedArtists] = useState<ArtistSearchResult[]>([]);

  // Responsive breakpoints
  const isMobile = useMediaQuery('(max-width: 480px)');
  const isTablet = useMediaQuery('(max-width: 768px)');
  const isSmallScreen = useMediaQuery('(max-width: 1024px)');

  const form = useForm({
    initialValues: {
      name: "",
      date: null as Date | null,
    },
    validate: {
      name: (value: string) =>
        value.trim().length > 0 ? null : "Event name is required",
    },
  });

  // Form submission
  const handleSubmit = async (values: EventFormData) => {
    if (!selectedPlace) {
      notifications.show({
        title: "Location Required",
        message: "Please select a location for your event",
        color: "red",
      });
      return;
    }

    setLoading(true);
    try {
      const supabase = createClient();

      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        throw new Error("Authentication required");
      }

      let posterUrl: string | null = null;

      // Create the event
      const { data: event, error: eventError } = await supabase
        .from('events')
        .insert({
          name: values.name,
          date: values.date ? values.date.toISOString() : null,
          address: selectedPlace.fullAddress || `${selectedPlace.locality.name}, ${selectedPlace.administrativeArea.name}, ${selectedPlace.country.name}`,
          locality: selectedPlace.locality.id,
          poster_img: posterUrl,
          user_id: user.id
        })
        .select()
        .single();

      if (eventError) {
        throw new Error(`Failed to create event: ${eventError.message}`);
      }

      // Generate hash from event name and created_at
      const hashInput = `${event.name}${event.created_at}`;
      const hash = crypto.createHash('sha256').update(hashInput).digest('hex').substring(0, 6);

      // Update the event with the generated hash
      const { error: hashUpdateError } = await supabase
        .from('events')
        .update({ hash })
        .eq('id', event.id);

      if (hashUpdateError) {
        console.error('Error updating event with hash:', hashUpdateError);
        // Don't throw error here, just log it - the event was created successfully
      }

      // Update the local event object with the hash for later use
      event.hash = hash;

      // Create artist-event relationships if artists are selected
      if (selectedArtists.length > 0) {
        const artistEventData = selectedArtists.map(artist => ({
          event: event.id,
          artist: artist.id,
          // Start and end times can be null for now, can be set later
          start_time: null,
          end_time: null,
        }));

        const { error: artistEventError } = await supabase
          .from('events_artists')
          .insert(artistEventData);

        if (artistEventError) {
          console.error('Error linking artists to event:', artistEventError);
          // Don't throw error here, just log it - the event was created successfully
          notifications.show({
            title: "Warning",
            message: "Event created but some artists couldn't be added. You can add them later.",
            color: "orange",
          });
        }
      }

      notifications.show({
        title: "Success",
        message: selectedArtists.length > 0
          ? `Event created successfully with ${selectedArtists.length} artist${selectedArtists.length > 1 ? 's' : ''}!`
          : "Event created successfully!",
        color: "green",
      });

      // Store the created event and move to poster step
      setCreatedEvent(event);
      setStep('poster');

    } catch (error: any) {
      notifications.show({
        title: "Error",
        message: error.message || "Failed to create event",
        color: "red",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSkipPoster = () => {
    // Navigate to the created event without poster using hash
    router.push(`/events/${createdEvent.hash}`);
  };

  const handleBackToForm = () => {
    // Go back to form (if user wants to edit before poster)
    setStep('form');
  };

  return (
    <Container
      size="lg"
      px={isMobile ? "sm" : isTablet ? "md" : "xl"}
      py={isMobile ? "md" : "xl"}
    >
      <Paper
        p={isMobile ? "md" : isTablet ? "lg" : "xl"}
        radius={isMobile ? "md" : "lg"}
        shadow={isMobile ? "xs" : isTablet ? "sm" : "md"}
        maw={isMobile ? "100%" : isTablet ? 600 : isSmallScreen ? 700 : 800}
        mx="auto"
        bg={colorScheme === 'dark' ? 'dark.7' : 'white'}
        withBorder
      >
        {step === 'form' ? (
          <form onSubmit={form.onSubmit(handleSubmit)}>
            <Stack gap={isMobile ? "md" : isTablet ? "lg" : "xl"}>
              {/* Header Section */}
              <Group justify="center" mb={isMobile ? "md" : "lg"}>
                <Title
                  order={isMobile ? 2 : 1}
                  size={isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2.2rem"}
                  ta="center"
                  c="blue.7"
                  fw={isMobile ? 600 : 700}
                >
                  Create New Event
                </Title>
              </Group>

              {/* Event Name */}
              <TextInput
                label="Event Name"
                placeholder="Enter your event name"
                size={isMobile ? "sm" : "md"}
                radius={isMobile ? "sm" : "md"}
                {...form.getInputProps("name")}
                styles={{
                  label: {
                    fontSize: "var(--mantine-font-size-sm)",
                    fontWeight: 500,
                    marginBottom: "0.25rem"
                  }
                }}
              />

              {/* Event Date Section */}
              <Paper
                p={isMobile ? "sm" : "md"}
                bg={colorScheme === 'dark' ? 'dark.6' : 'blue.0'}
                radius={isMobile ? "sm" : "md"}
                withBorder
              >
                <Stack gap={isMobile ? "sm" : "md"}>
                  <Group>
                    <IconCalendar size={20} />
                    <Text
                      size={isMobile ? "sm" : "md"}
                      fw={500}
                      c={colorScheme === 'dark' ? 'white' : 'dark.8'}
                    >
                      Date (Optional)
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    Select the date when your event will take place.
                  </Text>
                  {form.values.date && (
                    <Group justify="space-between" mb="sm">
                      <Text size="sm" c="blue.6">
                        Selected: {form.values.date.toLocaleDateString()}
                      </Text>
                      <Text
                        size="sm"
                        c="red.6"
                        style={{ cursor: 'pointer', textDecoration: 'underline' }}
                        onClick={() => form.setFieldValue('date', null)}
                      >
                        Clear
                      </Text>
                    </Group>
                  )}
                  <Group justify="center">
                    <Calendar
                      size={isMobile ? "sm" : "md"}
                      getDayProps={(date) => ({
                        selected: form.values.date ? new Date(date).toDateString() === form.values.date.toDateString() : false,
                        onClick: () => form.setFieldValue('date', new Date(date))
                      })}
                    />
                  </Group>
                </Stack>
              </Paper>

              {/* Artist Selection Section */}
              <Paper
                p={isMobile ? "sm" : "md"}
                bg={colorScheme === 'dark' ? 'dark.6' : 'green.0'}
                radius={isMobile ? "sm" : "md"}
                withBorder
              >
                <Stack gap={isMobile ? "sm" : "md"}>
                  <Group>
                    <IconUsers size={20} />
                    <Text
                      size={isMobile ? "sm" : "md"}
                      fw={500}
                      c={colorScheme === 'dark' ? 'white' : 'dark.8'}
                    >
                      Artists (Optional)
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    Search and add artists who will be performing at your event.
                  </Text>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <div style={{ width: '100%', maxWidth: isMobile ? '100%' : '500px' }}>
                      <ArtistSearch
                        onArtistsChange={setSelectedArtists}
                        selectedArtists={selectedArtists}
                        maxArtists={20}
                        placeholder="Search and add artists..."
                      />
                    </div>
                  </div>
                </Stack>
              </Paper>

              {/* Location Section */}
              <Paper
                p={isMobile ? "sm" : "md"}
                bg={colorScheme === 'dark' ? 'dark.6' : 'gray.0'}
                radius={isMobile ? "sm" : "md"}
                withBorder
              >
                <Stack gap={isMobile ? "sm" : "md"}>
                  <Group>
                    <IconMapPin size={20} />
                    <Text
                      size={isMobile ? "sm" : "md"}
                      fw={500}
                      c={colorScheme === 'dark' ? 'white' : 'dark.8'}
                    >
                      Address
                    </Text>
                  </Group>
                  <Text size="sm" c="dimmed" mb="md">
                    Select the specific location where your event will take place.
                  </Text>
                  <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
                    <LocationInput
                      onPlaceSelect={setSelectedPlace}
                      onRemovePlace={async () => setSelectedPlace(undefined)}
                      storedLocality={selectedPlace}
                      searchFullAddress={true}
                    />
                  </div>
                </Stack>
              </Paper>

              {/* Submit Button */}
              <Group justify="center" mt={isMobile ? "md" : "lg"}>
                <Button
                  disabled={loading}
                  type="submit"
                  size={isMobile ? "md" : "lg"}
                  radius={isMobile ? "md" : "lg"}
                  w={isMobile ? "100%" : "auto"}
                  px={isMobile ? "xl" : "3rem"}
                  loading={loading}
                  gradient={{ from: "blue", to: "cyan", deg: 45 }}
                  variant="gradient"
                  style={{
                    minHeight: isMobile ? '44px' : '48px',
                  }}
                >
                  Create Event
                </Button>
              </Group>
            </Stack>
          </form>
        ) : (
          // Poster upload step
          <Stack gap={isMobile ? "md" : isTablet ? "lg" : "xl"}>
            {/* Header Section */}
            <Group justify="center" mb={isMobile ? "md" : "lg"}>
              <Title
                order={isMobile ? 2 : 1}
                size={isMobile ? "1.5rem" : isTablet ? "1.8rem" : "2.2rem"}
                ta="center"
                c="green.7"
                fw={isMobile ? 600 : 700}
              >
                Event Created Successfully!
              </Title>
            </Group>

            <Text ta="center" c="dimmed" mb="lg">
              Your event "{createdEvent?.name}" has been created.
              Now you can upload a poster to make it more visually appealing.
            </Text>

            {/* Poster Upload Section */}
            <Paper
              p={isMobile ? "sm" : "md"}
              bg={colorScheme === 'dark' ? 'dark.6' : 'purple.0'}
              radius={isMobile ? "sm" : "md"}
              withBorder
            >
              <Stack gap={isMobile ? "sm" : "md"}>
                <Group>
                  <IconPhoto size={20} />
                  <Text
                    size={isMobile ? "sm" : "md"}
                    fw={500}
                    c={colorScheme === 'dark' ? 'white' : 'dark.8'}
                  >
                    Add Event Poster
                  </Text>
                </Group>
                <Text size="sm" c="dimmed" mb="md">
                  Upload a poster image for your event to make it more visually appealing.
                </Text>
                <EventPosterUpload
                  eventId={createdEvent?.id}
                />
              </Stack>
            </Paper>

            {/* Action Buttons */}
            <Group justify="center" mt={isMobile ? "md" : "lg"} gap="md">
              <Button
                onClick={handleSkipPoster}
                variant="outline"
                size={isMobile ? "md" : "lg"}
                radius={isMobile ? "md" : "lg"}
                px={isMobile ? "xl" : "3rem"}
                style={{
                  minHeight: isMobile ? '44px' : '48px',
                }}
              >
                Skip for Now
              </Button>
              <Button
                onClick={handleBackToForm}
                variant="light"
                size={isMobile ? "md" : "lg"}
                radius={isMobile ? "md" : "lg"}
                px={isMobile ? "xl" : "3rem"}
                style={{
                  minHeight: isMobile ? '44px' : '48px',
                }}
              >
                Back to Edit
              </Button>
            </Group>
          </Stack>
        )}
      </Paper>
    </Container>
  );
}