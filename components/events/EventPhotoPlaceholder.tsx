"use client";

import { Badge, Box, Paper, Stack, Text, Title } from "@mantine/core";
import { IconCalendar, IconClock, IconPhoto } from "@tabler/icons-react";

interface EventPhotoPlaceholderProps {
    eventName: string;
    eventDate?: string | null;
}

export function EventPhotoPlaceholder({ eventName, eventDate }: EventPhotoPlaceholderProps) {
    const now = new Date();
    const eventDateObj = eventDate ? new Date(eventDate) : null;
    const isEventPast = eventDateObj ? eventDateObj < now : false;
    const isEventToday = eventDateObj ?
        eventDateObj.toDateString() === now.toDateString() : false;

    // Calculate if we're within the 2-week upload period after the event
    const twoWeeksAfterEvent = eventDateObj ? new Date(eventDateObj.getTime() + (14 * 24 * 60 * 60 * 1000)) : null;
    const isWithinUploadPeriod = eventDateObj && twoWeeksAfterEvent ? now >= eventDateObj && now <= twoWeeksAfterEvent : false;
    const uploadPeriodExpired = eventDateObj && twoWeeksAfterEvent ? now > twoWeeksAfterEvent : false;

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
                        {uploadPeriodExpired ? "Event Photos" :
                            isEventPast ? "Photo Gallery Coming Soon" : "Photo Gallery Coming Soon"}
                    </Title>

                    {uploadPeriodExpired ? (
                        <Text c="dimmed" ta="center" size="lg">
                            Photos from {eventName} will appear here once they're uploaded
                        </Text>
                    ) : isEventPast ? (
                        <Text c="dimmed" ta="center" size="lg">
                            Photo uploads are available for 2 weeks after the event ends
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
                                color={isEventToday ? "green" :
                                    uploadPeriodExpired ? "gray" :
                                        isEventPast ? "orange" : "blue"}
                                size="lg"
                                leftSection={<IconCalendar size={14} />}
                            >
                                {isEventToday ? "Event Today" :
                                    uploadPeriodExpired ? "Upload Period Ended" :
                                        isEventPast ? "Upload Period Active" : "Upcoming Event"}
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
                            {isWithinUploadPeriod && twoWeeksAfterEvent && (
                                <Text size="xs" c="dimmed" ta="center" mt="xs">
                                    Upload period ends {twoWeeksAfterEvent.toLocaleDateString('en-US', {
                                        month: 'short',
                                        day: 'numeric',
                                        year: 'numeric'
                                    })}
                                </Text>
                            )}
                        </Box>
                    )}
                </Stack>
            </Stack>
        </Paper>
    );
}
