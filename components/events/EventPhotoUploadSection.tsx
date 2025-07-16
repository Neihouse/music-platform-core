"use client";

import { createClient } from "@/utils/supabase/client";
import { Button, Paper, Stack, Text, Title } from "@mantine/core";
import { IconLogin, IconPhoto } from "@tabler/icons-react";
import Link from "next/link";
import React from "react";
import { EventPhotoPlaceholder } from "./EventPhotoPlaceholder";
import { EventPhotoUploadWithControls } from "./EventPhotoUploadWithControls";

interface EventPhotoUploadSectionProps {
    event: {
        id?: string;
        hash?: string | null;
        name: string;
        date?: string | null;
    };
    isEventCreator?: boolean;
    onPhotosConfirmed?: () => void;
}

export function EventPhotoUploadSection({
    event,
    isEventCreator = false,
    onPhotosConfirmed
}: EventPhotoUploadSectionProps) {
    const [currentUserId, setCurrentUserId] = React.useState<string | null>(null);
    const [isLoadingAuth, setIsLoadingAuth] = React.useState(true);

    // Check authentication status
    React.useEffect(() => {
        const checkAuth = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            setCurrentUserId(user?.id || null);
            setIsLoadingAuth(false);
        };
        checkAuth();
    }, []);

    // Check if upload period is active (event date to 2 weeks after)
    const now = new Date();
    const eventDate = event.date ? new Date(event.date) : null;

    // Allow uploads for up to 2 weeks (14 days) after the event date
    const twoWeeksAfterEvent = eventDate ? new Date(eventDate.getTime() + (14 * 24 * 60 * 60 * 1000)) : null;
    const isWithinUploadPeriod = eventDate && twoWeeksAfterEvent ? now >= eventDate && now <= twoWeeksAfterEvent : false;

    // Show loading while checking auth
    if (isLoadingAuth) {
        return (
            <Paper shadow="sm" p="xl" radius="md">
                <Text>Loading...</Text>
            </Paper>
        );
    }

    // Show upload interface if within upload period and event has required data
    if (isWithinUploadPeriod && event.id && event.hash) {
        // If user is not authenticated, show login prompt
        if (!currentUserId) {
            return (
                <Paper shadow="sm" p="xl" radius="md">
                    <Stack gap="lg" align="center">
                        <div style={{ textAlign: 'center' }}>
                            <IconPhoto size={48} style={{ color: 'var(--mantine-color-blue-6)', marginBottom: '16px' }} />
                            <Title order={3} mb="sm">Share Your Event Photos</Title>
                            <Text c="dimmed" size="md" mb="lg">
                                Log in to upload and share photos from {event.name}
                            </Text>
                        </div>

                        <Button
                            component={Link}
                            href="/login"
                            leftSection={<IconLogin size={16} />}
                            size="lg"
                            variant="filled"
                        >
                            Log in to Upload Photos
                        </Button>
                    </Stack>
                </Paper>
            );
        }

        // User is authenticated, show upload interface
        return (
            <EventPhotoUploadWithControls
                eventId={event.id}
                eventHash={event.hash}
                eventName={event.name}
                onConfirm={() => {
                    // Photo upload confirmed
                    onPhotosConfirmed?.();
                }}
                onCancel={() => {
                    // Photo upload cancelled
                }}
            />
        );
    }

    // Show placeholder for events outside upload period or missing data
    return (
        <EventPhotoPlaceholder
            eventName={event.name}
            eventDate={event.date}
        />
    );
}
