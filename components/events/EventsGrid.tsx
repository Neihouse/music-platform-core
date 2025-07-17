"use client";

import { getPosterUrl } from "@/lib/images/image-utils-client";
import { Event, Venue } from "@/utils/supabase/global.types";
import { AspectRatio, Badge, Box, Button, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconCalendar, IconMapPin, IconPhoto, IconTicket, IconUsers } from "@tabler/icons-react";
import Link from "next/link";

// Use proper type composition following TYPE_USAGE guide
type EventWithVenue = Pick<Event, 'id' | 'name' | 'start' | 'hash' | 'poster_img'> & {
    venues?: Pick<Venue, 'id' | 'name' | 'address'> | null;
};

interface EventsGridProps {
    events: EventWithVenue[];
}

interface EventCardProps {
    event: EventWithVenue;
}

function EventCard({ event }: EventCardProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isMedium = useMediaQuery('(min-width: 769px) and (max-width: 1024px)');

    const posterUrl = event.poster_img ? getPosterUrl(event.poster_img) : null;
    const eventDate = event.start ? new Date(event.start) : null;

    // Mobile version - just clickable poster with minimal info
    if (isMobile) {
        return (
            <Grid.Col span={6} p={0}>
                <Box
                    component={Link}
                    href={`/events/${event.hash}`}
                    pos="relative"
                    style={{
                        display: 'block',
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
                    <AspectRatio ratio={3 / 4}>
                        {posterUrl ? (
                            <Image
                                src={posterUrl}
                                alt={`${event.name} poster`}
                                style={{
                                    objectFit: 'cover',
                                    borderRadius: '8px',
                                    width: '100%',
                                    height: '100%',
                                }}
                                fallbackSrc="/artist-not-found.svg"
                            />
                        ) : (
                            <Box
                                style={{
                                    background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                                    borderRadius: '8px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    color: '#ffffff',
                                    width: '100%',
                                    height: '100%',
                                }}
                            >
                                <IconPhoto size={24} opacity={0.7} />
                            </Box>
                        )}
                    </AspectRatio>

                    {/* Small Date Badge */}
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
                            {eventDate.getDate()}
                        </Badge>
                    )}

                    {/* Venue overlay at bottom */}
                    {event.venues && (
                        <Box
                            style={{
                                position: 'absolute',
                                bottom: 0,
                                left: 0,
                                right: 0,
                                background: 'linear-gradient(transparent, rgba(0,0,0,0.7))',
                                borderRadius: '0 0 8px 8px',
                                padding: '8px',
                                zIndex: 10,
                            }}
                        >
                            <Text
                                size="xs"
                                c="white"
                                lineClamp={1}
                                style={{
                                    fontSize: '0.65rem',
                                    textShadow: '0 1px 2px rgba(0,0,0,0.5)',
                                }}
                            >
                                {event.venues.name}
                            </Text>
                        </Box>
                    )}
                </Box>
            </Grid.Col>
        );
    }

    // Medium screens (tablets) - simplified version with basic info
    if (isMedium) {
        return (
            <Grid.Col span={4}>
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
                        {/* Poster Section */}
                        <Box pos="relative" mb="xs">
                            <AspectRatio ratio={3 / 4}>
                                {posterUrl ? (
                                    <Image
                                        src={posterUrl}
                                        alt={`${event.name} poster`}
                                        style={{
                                            objectFit: 'cover',
                                            borderRadius: '10px',
                                        }}
                                        fallbackSrc="/artist-not-found.svg"
                                    />
                                ) : (
                                    <Box
                                        style={{
                                            background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                                            borderRadius: '10px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            color: 'var(--mantine-color-white)',
                                        }}
                                    >
                                        <Stack align="center" gap="xs">
                                            <IconPhoto size={28} opacity={0.7} />
                                            <Text size="sm" fw={500} ta="center">
                                                {event.name}
                                            </Text>
                                        </Stack>
                                    </Box>
                                )}
                            </AspectRatio>

                            {/* Date Badge */}
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

                        {/* Event Details */}
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

                            {/* Single Action Button */}
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
            </Grid.Col>
        );
    }

    // Desktop version - full featured
    return (
        <Grid.Col span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
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
                    {/* Poster Section */}
                    <Box pos="relative" mb="xs">
                        <AspectRatio ratio={3 / 4}>
                            {posterUrl ? (
                                <Image
                                    src={posterUrl}
                                    alt={`${event.name} poster`}
                                    style={{
                                        objectFit: 'cover',
                                        borderRadius: '12px',
                                    }}
                                    fallbackSrc="/artist-not-found.svg"
                                />
                            ) : (
                                <Box
                                    style={{
                                        background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                                        borderRadius: '12px',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        color: 'var(--mantine-color-white)',
                                    }}
                                >
                                    <Stack align="center" gap="xs">
                                        <IconPhoto size={32} opacity={0.7} />
                                        <Text size="sm" fw={500} ta="center">
                                            {event.name}
                                        </Text>
                                    </Stack>
                                </Box>
                            )}
                        </AspectRatio>

                        {/* Date Badge */}
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

                    {/* Event Details */}
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

                        {/* Action Buttons */}
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
        </Grid.Col>
    );
}

export default function EventsGrid({ events }: EventsGridProps) {
    const isMobile = useMediaQuery('(max-width: 768px)');

    return (
        <Grid gutter={{ base: "xs", sm: "md", md: "xl" }}>
            {events.map((event) => (
                <EventCard key={event.id} event={event} />
            ))}
        </Grid>
    );
}
