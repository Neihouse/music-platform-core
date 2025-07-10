"use client";

import { EventPhotoGallery, PhotoItem } from "@/components/Upload";
import { Card, Stack, Text, Title } from "@mantine/core";
import { IconPhoto } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface EventPhotoGallerySectionProps {
    event: {
        id?: string;
        name: string;
        date?: string | null;
    };
    photos: PhotoItem[];
    refreshTrigger?: number;
}

export function EventPhotoGallerySection({ event, photos, refreshTrigger }: EventPhotoGallerySectionProps) {
    const [key, setKey] = useState(0);

    // Check if the event has started
    const eventHasStarted = event.date ? new Date(event.date) <= new Date() : false;

    // Force re-render when refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger !== undefined) {
            setKey(prev => prev + 1);
        }
    }, [refreshTrigger]);

    // Listen for photo confirmation events from upload component
    useEffect(() => {
        const handlePhotosConfirmed = (customEvent: CustomEvent) => {
            if (customEvent.detail?.eventId === event.id) {
                setKey(prev => prev + 1);
            }
        };

        window.addEventListener('photosConfirmed', handlePhotosConfirmed as EventListener);
        return () => {
            window.removeEventListener('photosConfirmed', handlePhotosConfirmed as EventListener);
        };
    }, [event.id]);

    // If event hasn't started and no photos, show placeholder
    if ((!eventHasStarted || !event.id) && photos.length === 0) {
        return (
            <Card shadow="sm" p="lg" radius="md">
                <Stack gap="md" align="center" py="lg">
                    <IconPhoto size={48} color="var(--mantine-color-gray-4)" />
                    <div>
                        <Title order={4} ta="center" mb="xs">Event Gallery</Title>
                        <Text c="dimmed" ta="center" size="sm">
                            Photos will appear here once the event begins and photos are uploaded
                        </Text>
                    </div>
                </Stack>
            </Card>
        );
    }

    // Show the photo gallery
    return (
        <div key={key}>
            <EventPhotoGallery
                eventId={event.id || ''}
                eventName={event.name}
                embedded={true}
                photos={photos}
            />
        </div>
    );
}
