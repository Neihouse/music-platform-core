import { EventPhotoGallerySection } from "@/components/events/EventPhotoGallerySection";
import { EventPhotoUploadSection } from "@/components/events/EventPhotoUploadSection";
import { EventPosterSection } from "@/components/events/EventPosterSection";
import { VenueSelector } from "@/components/events/VenueSelector";
import StyledTitle from "@/components/StyledTitle";
import { getEventByHash, getEvents } from "@/db/queries/events";
import { getPhotosByEvent } from "@/db/queries/event_photos";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { Box, Button, Center, Container, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCalendar, IconMapPin, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAvailableVenues } from "./actions";

interface EventDetailPageProps {
  params: Promise<{
    eventHash: string;
  }>;
}

export default async function EventDetailPage({ params }: EventDetailPageProps) {
  try {
    const eventHash = (await params).eventHash;
    console.log("Fetching event details for hash:", eventHash);
    const supabase = await createClient();
    const event = await getEventByHash(supabase, eventHash);
    const availableVenues = await getAvailableVenues();
    const events = await getEvents(supabase);

    // Get current user to check if they are the event creator
    const currentUser = await getUser(supabase);
    const isEventCreator = !!(currentUser && event.user_id === currentUser.id);

    // Fetch event photos
    const eventPhotos = event.id ? await getPhotosByEvent(supabase, event.id) : [];

    return (
      <Container size="lg" pt="xl">
        {/* Desktop Layout */}
        <Box display={{ base: 'none', md: 'block' }}>
          <Group align="flex-start" gap="xl" style={{ minHeight: '100vh' }}>
            {/* Left Column - Portrait Poster */}
            <Box style={{ flex: '0 0 400px', position: 'sticky', top: '20px' }}>
              <Stack gap="lg">
                <EventPosterSection
                  event={event}
                  className="poster-desktop"
                  style={{ maxWidth: '400px' }}
                  isEventCreator={isEventCreator}
                />

                {/* Event Photo Upload */}
                <EventPhotoUploadSection
                  event={event}
                  isEventCreator={isEventCreator}
                />
              </Stack>
            </Box>

            {/* Right Column - Event Details */}
            <Box style={{ flex: 1, minWidth: 0 }}>
              <Stack gap="lg">
                {/* Event Header */}
                <Paper shadow="sm" p="xl" radius="md">
                  <Stack gap="md">
                    <StyledTitle selectedFont="Inter">
                      {event.name}
                    </StyledTitle>

                    <Group gap="xl" wrap="wrap">
                      {event.date && (
                        <Group gap="xs">
                          <IconCalendar size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
                          <Box>
                            <Text fw={500} size="lg">
                              {new Date(event.date).toLocaleDateString('en-US', {
                                weekday: 'long',
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric'
                              })}
                            </Text>
                            {event.date && (
                              <Text size="sm" c="dimmed">
                                {new Date(event.date).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </Text>
                            )}
                          </Box>
                        </Group>
                      )}

                      {event.venues && (
                        <Group gap="xs">
                          <IconMapPin size={20} style={{ color: 'var(--mantine-color-red-6)' }} />
                          <Box>
                            <Text fw={500} size="lg">{event.venues.name}</Text>
                            {event.venues.address && (
                              <Text size="sm" c="dimmed">{event.venues.address}</Text>
                            )}
                          </Box>
                        </Group>
                      )}

                      {!event.venues && event.address && (
                        <Group gap="xs">
                          <IconMapPin size={20} style={{ color: 'var(--mantine-color-red-6)' }} />
                          <Box>
                            <Text fw={500} size="lg">Venue</Text>
                            <Text size="sm" c="dimmed">{event.address}</Text>
                          </Box>
                        </Group>
                      )}
                    </Group>
                  </Stack>
                </Paper>

                {/* Venue Selection */}
                {isEventCreator && <VenueSelector event={event} availableVenues={availableVenues} />}

                {/* Event Photo Gallery */}
                <EventPhotoGallerySection event={event} photos={eventPhotos} />

                {/* Event Management */}
                {isEventCreator && (
                  <Paper shadow="sm" p="xl" radius="md">
                    <Stack gap="lg">
                      <Box>
                        <Title order={2} mb="sm">Event Management</Title>
                        <Text c="dimmed" size="md">
                          Use the lineup planner to organize artists across different stages for your event.
                        </Text>
                      </Box>

                      <Group>
                        <Button
                          component={Link}
                          href={`/events/${event.hash}/lineup`}
                          leftSection={<IconUsers size={18} />}
                          size="lg"
                          variant="filled"
                          style={{
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            border: 'none',
                          }}
                        >
                          Go to Lineup Planner
                        </Button>
                      </Group>
                    </Stack>
                  </Paper>
                )}

                {/* Additional Event Information */}
                <Paper shadow="sm" p="xl" radius="md">
                  <Stack gap="md">
                    <Title order={3}>Event Details</Title>

                    <Group gap="xl">
                      {event.venues?.capacity && (
                        <Box>
                          <Text size="sm" c="dimmed" fw={500}>CAPACITY</Text>
                          <Text size="lg" fw={600}>{event.venues.capacity.toLocaleString()}</Text>
                        </Box>
                      )}

                      <Box>
                        <Text size="sm" c="dimmed" fw={500}>EVENT TYPE</Text>
                        <Text size="lg" fw={600}>Live Performance</Text>
                      </Box>

                      <Box>
                        <Text size="sm" c="dimmed" fw={500}>STATUS</Text>
                        <Text size="lg" fw={600} c="green">Active</Text>
                      </Box>
                    </Group>
                  </Stack>
                </Paper>
              </Stack>
            </Box>
          </Group>
        </Box>

        {/* Mobile Layout */}
        <Box display={{ base: 'block', md: 'none' }} pt="sm">
          <Stack gap="lg">
            {/* Mobile Poster */}
            <Center>
              <EventPosterSection
                event={event}
                className="poster-mobile"
                style={{ maxWidth: '380px', width: '100%' }}
                isEventCreator={isEventCreator}
              />
            </Center>

            {/* Mobile Event Photo Upload */}
            <EventPhotoUploadSection
              event={event}
              isEventCreator={isEventCreator}
            />

            {/* Mobile Event Header */}
            <Paper shadow="sm" p="lg" radius="md">
              <Stack gap="md">
                <StyledTitle selectedFont="Inter">
                  {event.name}
                </StyledTitle>

                <Stack gap="md">
                  {event.date && (
                    <Group gap="xs">
                      <IconCalendar size={18} style={{ color: 'var(--mantine-color-blue-6)' }} />
                      <Box>
                        <Text fw={500}>
                          {new Date(event.date).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </Text>
                      </Box>
                    </Group>
                  )}

                  {event.venues && (
                    <Group gap="xs" align="center" wrap="nowrap">
                      <IconMapPin size={18} style={{ color: 'var(--mantine-color-red-6)', flexShrink: 0 }} />
                      <Box style={{ minWidth: 0, flex: 1 }}>
                        <Text fw={500}>{event.venues.name}</Text>
                        {event.venues.address && (
                          <Text size="sm" c="dimmed" style={{ wordBreak: 'break-word' }}>{event.venues.address}</Text>
                        )}
                      </Box>
                    </Group>
                  )}

                  {!event.venues && event.address && (
                    <Group gap="xs" align="center" wrap="nowrap">
                      <IconMapPin size={18} style={{ color: 'var(--mantine-color-red-6)', flexShrink: 0 }} />
                      <Box style={{ minWidth: 0, flex: 1 }}>
                        <Text fw={500}>Venue</Text>
                        <Text size="sm" c="dimmed" style={{ wordBreak: 'break-word' }}>{event.address}</Text>
                      </Box>
                    </Group>
                  )}
                </Stack>
              </Stack>
            </Paper>

            {/* Mobile Venue Selection */}
            {isEventCreator && <VenueSelector event={event} availableVenues={availableVenues} />}

            {/* Mobile Event Photo Gallery */}
            <EventPhotoGallerySection event={event} photos={eventPhotos} />

            {/* Mobile Event Management */}
            {isEventCreator && (
              <Paper shadow="sm" p="lg" radius="md">
                <Stack gap="md">
                  <Box>
                    <Title order={2} mb="sm">Event Management</Title>
                    <Text c="dimmed" size="sm">
                      Use the lineup planner to organize artists across different stages for your event.
                    </Text>
                  </Box>

                  <Button
                    component={Link}
                    href={`/events/${event.hash}/lineup`}
                    leftSection={<IconUsers size={16} />}
                    size="md"
                    variant="filled"
                    fullWidth
                    style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                    }}
                  >
                    Go to Lineup Planner
                  </Button>
                </Stack>
              </Paper>
            )}

            {/* Mobile Additional Event Information */}
            <Paper shadow="sm" p="lg" radius="md">
              <Stack gap="md">
                <Title order={3}>Event Details</Title>

                <Stack gap="md">
                  {event.venues?.capacity && (
                    <Group justify="space-between">
                      <Text size="sm" c="dimmed" fw={500}>CAPACITY</Text>
                      <Text fw={600}>{event.venues.capacity.toLocaleString()}</Text>
                    </Group>
                  )}

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={500}>EVENT TYPE</Text>
                    <Text fw={600}>Live Performance</Text>
                  </Group>

                  <Group justify="space-between">
                    <Text size="sm" c="dimmed" fw={500}>STATUS</Text>
                    <Text fw={600} c="green">Active</Text>
                  </Group>
                </Stack>
              </Stack>
            </Paper>
          </Stack>
        </Box>
      </Container>
    );
  } catch (error) {
    notFound();
  }
}
