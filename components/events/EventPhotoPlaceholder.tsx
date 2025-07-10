"use client";

import { Badge, Box, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCalendar, IconClock, IconPhoto } from "@tabler/icons-react";

interface EventPhotoPlaceholderProps {
    eventName: string;
    eventDate?: string | null;
}

export function EventPhotoPlaceholder({ eventName, eventDate }: EventPhotoPlaceholderProps) {
    const isEventPast = eventDate ? new Date(eventDate) < new Date() : false;
    const isEventToday = eventDate ?
        new Date(eventDate).toDateString() === new Date().toDateString() : false;

    return (
        <Paper shadow="sm" p="xl" radius="md">
            <Stack gap="lg" align="center" py="xl">
                <Box style={{ position: "relative" }}>
                    <IconPhoto
                        size={80}
                        color="var(--mantine-color-gray-4)"
                        stroke={1.5}
                    />
                    {!isEventPast && (
                        <IconClock
                            size={24}
                            color="var(--mantine-color-blue-6)"
                            style={{
                                position: "absolute",
                                bottom: -5,
                                right: -5,
                                backgroundColor: "white",
                                borderRadius: "50%",
                                padding: 2
                            }}
                        />
                    )}
                </Box>

                <Stack gap="sm" align="center">
                    <Title order={3} ta="center">
                        {isEventPast ? "Event Photos" : "Photo Gallery Coming Soon"}
                    </Title>

                    {isEventPast ? (
                        <Text c="dimmed" ta="center" size="lg">
                            Photos from {eventName} will appear here once they're uploaded
                        </Text>
                    ) : (
                        <Text c="dimmed" ta="center" size="lg">
                            Photos will be available once {eventName} begins
                        </Text>
                    )}

                    {eventDate && (
                        <Box>
                            <Badge
                                variant="light"
                                color={isEventToday ? "green" : isEventPast ? "gray" : "blue"}
                                size="lg"
                                leftSection={<IconCalendar size={14} />}
                            >
                                {isEventToday ? "Event Today" :
                                    isEventPast ? "Event Ended" : "Upcoming Event"}
                            </Badge>
                            <Text size="sm" c="dimmed" ta="center" mt="xs">
                                {new Date(eventDate).toLocaleDateString('en-US', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric',
                                    hour: 'numeric',
                                    minute: '2-digit'
                                })}
                            </Text>
                        </Box>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}
