"use client";

import { getPosterUrl } from "@/lib/images/image-utils-client";
import { Event, Venue, EventWithVenue } from "@/utils/supabase/global.types";
import { AspectRatio, Badge, Box, Button, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconCalendar, IconMapPin, IconPhoto, IconTicket, IconUsers } from "@tabler/icons-react";
import Link from "next/link";

// Helper to render the event poster with fallback
function renderEventPoster(event: EventWithVenue, ratio: number = 3/4, borderRadius: string = '8px', showNameInFallback: boolean = false, iconSize: number = 24) {
    const posterUrl = event.poster_img ? getPosterUrl(event.poster_img) : null;
    return (
        <AspectRatio ratio={ratio}>
            {posterUrl ? (
                <Image
                    src={posterUrl}
                    alt={`${event.name} poster`}
                    style={{
                        objectFit: 'cover',
                        borderRadius,
                        width: '100%',
                        height: '100%',
                    }}
                    fallbackSrc="/artist-not-found.svg"
                />
            ) : (
                <Box
                    style={{
                        background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                        borderRadius,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: '#ffffff',
                        width: '100%',
                        height: '100%',
                    }}
                >
                    {showNameInFallback ? (
                        <Stack align="center" gap="xs">
                            <IconPhoto size={iconSize} opacity={0.7} />
                            <Text size="sm" fw={500} ta="center">
                                {event.name}
                            </Text>
                        </Stack>
                    ) : (
                        <IconPhoto size={iconSize} opacity={0.7} />
                    )}
                </Box>
            )}
        </AspectRatio>
    );
}

interface EventsGridProps {
    events: EventWithVenue[];
}

interface EventCardProps {
    event: EventWithVenue;
}

function EventCard({ event }: EventCardProps) {
    const eventDate = event.start ? new Date(event.start) : null;

    return (
        <Grid.Col span={{ base: 4, sm: 6, md: 4, lg: 3 }}>
            {/* Mobile: Simple poster layout (base: 4 = 3 cards per row) */}
            <Box
                display={{ base: 'block', sm: 'none' }}
                component={Link}
                href={`/events/${event.hash}`}
                pos="relative"
                style={{
                    transition: 'all 0.2s ease',
                    cursor: 'pointer',
                    textDecoration: 'none',
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(0.98)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                }}
            >
                {renderEventPoster(event)}

                {/* Mobile Date Badge - Fixed to include month abbreviation */}
                {eventDate && (
                    <Badge
                        size="xs"
                        variant="filled"
                        color="blue"
                        style={{
                            position: 'absolute',
                            top: 6,
                            right: 6,
                            borderRadius: '4px',
                            fontSize: '0.6rem',
                            lineHeight: 1,
                            padding: '2px 4px',
                            minHeight: 'auto',
                            height: 'auto',
                            zIndex: 10,
                        }}
                    >
                        {`${eventDate.getDate()} ${eventDate.toLocaleString('default', { month: 'short' })}`}
                    </Badge>
                )}

                {/* Mobile Venue overlay */}
                {event.venues && (
                    <Box
                        style={{
                            position: 'absolute',
                            bottom: 8,
                            left: 8,
                            zIndex: 10,
                        }}
                    >
                        <Text
                            size="xs"
                            c="white"
                            lineClamp={1}
                            style={{
                                fontSize: '0.65rem',
                                textShadow: '0 1px 2px rgba(0,0,0,0.8)',
                                background: 'rgba(0,0,0,0.75)',
                                backdropFilter: 'blur(4px)',
                                padding: '3px 8px',
                                borderRadius: '12px',
                                display: 'inline-block',
                                border: '1px solid rgba(255,255,255,0.1)',
                            }}
                        >
                            {event.venues.name}
                        </Text>
                    </Box>
                )}
            </Box>

            {/* Tablet: Card layout (sm: 6 = 2 cards per row) */}
            <Box display={{ base: 'none', sm: 'block', md: 'none' }}>
                <Card
                    shadow="md"
                    radius="md"
                    withBorder
                    h="100%"
                    p="sm"
                    style={{
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        background: 'linear-gradient(145deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-8) 100%)',
                        borderColor: 'var(--mantine-color-dark-5)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-4px)';
                        e.currentTarget.style.boxShadow = '0 12px 24px var(--mantine-color-dark-9)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}
                >
                    <Stack gap="xs" h="100%">
                        <Box pos="relative" mb="xs">
                            {renderEventPoster(event, 3/4, '10px', true, 28)}

                            {eventDate && (
                                <Badge
                                    size="sm"
                                    variant="filled"
                                    style={{
                                        position: 'absolute',
                                        top: 6,
                                        right: 6,
                                        background: 'var(--mantine-color-blue-6)',
                                        backdropFilter: 'blur(8px)',
                                        color: 'var(--mantine-color-white)',
                                        borderRadius: '6px',
                                        padding: '3px 6px',
                                        fontSize: '0.65rem',
                                    }}
                                >
                                    {eventDate.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Badge>
                            )}
                        </Box>

                        <Stack gap="xs" style={{ flex: 1 }}>
                            <div>
                                <Title
                                    order={5}
                                    size="h6"
                                    lineClamp={1}
                                    mb={4}
                                    style={{
                                        color: 'var(--mantine-color-gray-0)',
                                        fontSize: '0.85rem',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {event.name}
                                </Title>

                                {event.venues && (
                                    <Group gap={4}>
                                        <IconMapPin size={14} style={{ color: 'var(--mantine-color-gray-4)' }} />
                                        <Text size="xs" c="dimmed" lineClamp={1} style={{ fontSize: '0.72rem' }}>
                                            {event.venues.name}
                                        </Text>
                                    </Group>
                                )}
                            </div>

                            <Button
                                component={Link}
                                href={`/events/${event.hash}`}
                                size="sm"
                                leftSection={<IconTicket size={12} />}
                                mt="auto"
                                style={{
                                    background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                                    color: 'var(--mantine-color-white)',
                                    border: 'none',
                                    fontSize: '0.7rem',
                                    height: '32px',
                                }}
                            >
                                View Event
                            </Button>
                        </Stack>
                    </Stack>
                </Card>
            </Box>

            {/* Desktop: Full card layout (md: 4, lg: 3) */}
            <Box display={{ base: 'none', md: 'block' }}>
                <Card
                    shadow="lg"
                    radius="md"
                    withBorder
                    h="100%"
                    p="xs"
                    style={{
                        overflow: 'hidden',
                        transition: 'all 0.3s ease',
                        cursor: 'pointer',
                        background: 'linear-gradient(145deg, var(--mantine-color-dark-7) 0%, var(--mantine-color-dark-8) 100%)',
                        borderColor: 'var(--mantine-color-dark-5)',
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = 'translateY(-8px)';
                        e.currentTarget.style.boxShadow = '0 20px 40px var(--mantine-color-dark-9)';
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = 'translateY(0)';
                        e.currentTarget.style.boxShadow = '';
                    }}
                >
                    <Stack gap={0} h="100%">
                        <Box pos="relative" mb="xs">
                            {renderEventPoster(event, 3/4, '12px', true, 32)}

                            {eventDate && (
                                <Badge
                                    size="sm"
                                    variant="filled"
                                    style={{
                                        position: 'absolute',
                                        top: 8,
                                        right: 8,
                                        background: 'var(--mantine-color-blue-6)',
                                        backdropFilter: 'blur(10px)',
                                        color: 'var(--mantine-color-white)',
                                        borderRadius: '8px',
                                        padding: '4px 8px',
                                        fontSize: '0.7rem',
                                    }}
                                >
                                    {eventDate.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric'
                                    })}
                                </Badge>
                            )}
                        </Box>

                        <Stack gap="xs" style={{ flex: 1 }}>
                            <div>
                                <Title
                                    order={5}
                                    size="h6"
                                    lineClamp={1}
                                    mb={4}
                                    style={{
                                        color: 'var(--mantine-color-gray-0)',
                                        fontSize: '0.9rem',
                                        lineHeight: 1.2,
                                    }}
                                >
                                    {event.name}
                                </Title>

                                {eventDate && (
                                    <Group gap={4} mb={4}>
                                        <IconCalendar size={12} style={{ color: 'var(--mantine-color-gray-4)' }} />
                                        <Text size="xs" c="dimmed" style={{ fontSize: '0.7rem' }}>
                                            {eventDate.toLocaleDateString('en-US', {
                                                month: 'short',
                                                day: 'numeric'
                                            })}
                                        </Text>
                                    </Group>
                                )}

                                {event.venues && (
                                    <Group gap={4}>
                                        <IconMapPin size={12} style={{ color: 'var(--mantine-color-gray-4)' }} />
                                        <Text size="xs" c="dimmed" lineClamp={1} style={{ fontSize: '0.7rem' }}>
                                            {event.venues.name}
                                        </Text>
                                    </Group>
                                )}
                            </div>

                            <Group justify="space-between" mt="auto" pt="xs" gap="xs">
                                <Button
                                    variant="subtle"
                                    component={Link}
                                    href={`/events/${event.hash}`}
                                    size="xs"
                                    leftSection={<IconTicket size={10} />}
                                    style={{
                                        flex: 1,
                                        color: 'var(--mantine-color-blue-4)',
                                        backgroundColor: 'var(--mantine-color-dark-6)',
                                        fontSize: '0.65rem',
                                        height: '28px',
                                        padding: '4px 8px',
                                    }}
                                >
                                    View
                                </Button>
                                <Button
                                    component={Link}
                                    href={`/events/${event.hash}/lineup`}
                                    leftSection={<IconUsers size={10} />}
                                    size="xs"
                                    style={{
                                        flex: 1,
                                        background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                                        color: 'var(--mantine-color-white)',
                                        border: 'none',
                                        fontSize: '0.65rem',
                                        height: '28px',
                                        padding: '4px 8px',
                                    }}
                                >
                                    Lineup
                                </Button>
                            </Group>
                        </Stack>
                    </Stack>
                </Card>
            </Box>
        </Grid.Col>
    );
}

export default function EventsGrid({ events }: EventsGridProps) {
    return (
        <Grid gutter={{ base: "sm", sm: "md", md: "xl" }}>
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </Grid>
    );
}
