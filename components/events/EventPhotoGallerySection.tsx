"use client";

import { EventPhotoGallery, PhotoItem } from "@/components/Upload";
import { createClient } from "@/utils/supabase/client";
import { Paper, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
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

// Function to fetch photos from the client side
async function fetchEventPhotos(eventId: string): Promise<PhotoItem[]> {
    try {
        const supabase = createClient();

        // First, get the event to access its hash
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("hash")
            .eq("id", eventId)
            .single();

        if (eventError || !event?.hash) {
            console.error("Error fetching event hash:", eventError);
            return [];
        }

        // Get all photo records from the database for this event
        const { data: photos, error } = await supabase
            .from("event_photos")
            .select("id, user, created_at")
            .eq("event", eventId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching event photos from database:", error);
            return [];
        }

        if (!photos || photos.length === 0) {
            return [];
        }

        // Get the actual files from storage using the new folder structure
        const photoItems: PhotoItem[] = [];

        for (const photo of photos) {
            try {
                // Build the path using the new folder structure: eventHash/userId/filename
                const folderPath = photo.user ? `${event.hash}/${photo.user}/${photo.id}` : photo.id;

                const { data: publicUrlData } = supabase.storage
                    .from("event-photos")
                    .getPublicUrl(folderPath);

                if (publicUrlData.publicUrl) {
                    photoItems.push({
                        id: photo.id,
                        url: publicUrlData.publicUrl,
                        filename: photo.id,
                    });
                }
            } catch (error) {
                console.error("Error getting public URL for photo:", photo.id, error);
                // Continue processing other photos even if one fails
                continue;
            }
        }

        return photoItems;
    } catch (error) {
        console.error("Error in fetchEventPhotos:", error);
        return [];
    }
}

export function EventPhotoGallerySection({ event, photos: initialPhotos, refreshTrigger }: EventPhotoGallerySectionProps) {
    const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
    const [key, setKey] = useState(0);

    // Mobile responsive hooks
    const isMobile = useMediaQuery('(max-width: 768px)');

    // Check if the event has started
    const eventHasStarted = event.date ? new Date(event.date) <= new Date() : false;

    // Update photos when initialPhotos change
    useEffect(() => {
        setPhotos(initialPhotos);
    }, [initialPhotos]);

    // Force re-render when refreshTrigger changes
    useEffect(() => {
        if (refreshTrigger !== undefined) {
            setKey(prev => prev + 1);
        }
    }, [refreshTrigger]);

    // Listen for photo confirmation events from upload component
    useEffect(() => {
        const handlePhotosConfirmed = async (evt: Event) => {
            const customEvent = evt as CustomEvent;
            if (customEvent.detail?.eventId === event.id && event.id) {
                // Fetch fresh photos from the database
                try {
                    const freshPhotos = await fetchEventPhotos(event.id);
                    setPhotos(freshPhotos);
                    setKey(prev => prev + 1);
                } catch (error) {
                    console.error("Error refreshing photos:", error);
                }
            }
        };

        window.addEventListener('photosConfirmed', handlePhotosConfirmed);
        return () => {
            window.removeEventListener('photosConfirmed', handlePhotosConfirmed);
        };
    }, [event.id]);

    // If event hasn't started and no photos, show placeholder
    if ((!eventHasStarted || !event.id) && photos.length === 0) {
        return (
            <Paper shadow="sm" p={isMobile ? "md" : "xl"} radius="md">
                <Stack gap={isMobile ? "sm" : "md"} align="center" py={isMobile ? "md" : "lg"}>
                    <IconPhoto size={isMobile ? 36 : 48} color="var(--mantine-color-gray-4)" />
                    <div>
                        <Title order={isMobile ? 5 : 4} ta="center" mb="xs">Event Gallery</Title>
                        <Text c="dimmed" ta="center" size={isMobile ? "xs" : "sm"}>
                            Photos will appear here once the event begins and photos are uploaded
                        </Text>
                    </div>
                </Stack>
            </Paper>
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
