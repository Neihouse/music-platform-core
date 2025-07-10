"use client";

import { EventPhotoUpload, PhotoItem } from "@/components/Upload";
import { Badge, Card, Container, Group, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

interface EventPhotoGalleryProps {
    eventId: string;
    eventName: string;
    isEventOwner?: boolean;
}

export function EventPhotoGallery({
    eventId,
    eventName,
    isEventOwner = false
}: EventPhotoGalleryProps) {
    const [photos, setPhotos] = useState<PhotoItem[]>([]);
    const [uploading, setUploading] = useState(false);

    const handlePhotosUpdated = (updatedPhotos: PhotoItem[]) => {
        setPhotos(updatedPhotos);

        // Show notification when photos are added/removed
        if (updatedPhotos.length > photos.length) {
            const addedCount = updatedPhotos.length - photos.length;
            notifications.show({
                title: "Photos Added",
                message: `${addedCount} photo${addedCount > 1 ? 's' : ''} uploaded successfully!`,
                color: "green",
            });
        } else if (updatedPhotos.length < photos.length) {
            notifications.show({
                title: "Photo Removed",
                message: "Photo deleted successfully",
                color: "blue",
            });
        }
    };

    return (
        <Container size="lg">
            <Stack gap="xl">
                {/* Header */}
                <Card p="lg" withBorder>
                    <Group justify="space-between" align="flex-start">
                        <div>
                            <Title order={2}>Event Photos</Title>
                            <Text c="dimmed" size="sm">
                                {eventName}
                            </Text>
                            <Group gap="xs" mt="xs">
                                <Badge variant="light" color="blue">
                                    {photos.length} photo{photos.length !== 1 ? 's' : ''}
                                </Badge>
                                {isEventOwner && (
                                    <Badge variant="light" color="green">
                                        You can upload photos
                                    </Badge>
                                )}
                            </Group>
                        </div>
                    </Group>
                </Card>

                {/* Photo Upload Component */}
                {isEventOwner ? (
                    <EventPhotoUpload
                        eventId={eventId}
                        onPhotosUploaded={handlePhotosUpdated}
                    />
                ) : (
                    <Card p="lg" withBorder>
                        {photos.length > 0 ? (
                            <Stack gap="md">
                                <Title order={4}>Event Gallery</Title>
                                <Text size="sm" c="dimmed">
                                    Check out photos from this event
                                </Text>
                                {/* Here you would display the photos in read-only mode */}
                                <Text size="sm">
                                    {photos.length} photo{photos.length !== 1 ? 's' : ''} available
                                </Text>
                            </Stack>
                        ) : (
                            <Stack align="center" gap="md" py="xl">
                                <Text size="lg" c="dimmed" ta="center">
                                    No photos have been uploaded for this event yet.
                                </Text>
                                <Text size="sm" c="dimmed" ta="center">
                                    Check back later to see photos from this event!
                                </Text>
                            </Stack>
                        )}
                    </Card>
                )}

                {/* Usage Tips */}
                {isEventOwner && (
                    <Card p="md" bg="gray.0" withBorder>
                        <Title order={5} mb="sm">Photo Upload Tips</Title>
                        <Stack gap="xs">
                            <Text size="sm">• Upload up to 20 photos per event</Text>
                            <Text size="sm">• Supported formats: JPEG, PNG, WebP, AVIF</Text>
                            <Text size="sm">• Maximum file size: 10MB per photo</Text>
                            <Text size="sm">• Click on photos to view them in full size</Text>
                            <Text size="sm">• Use the trash icon to delete photos</Text>
                        </Stack>
                    </Card>
                )}
            </Stack>
        </Container>
    );
}

export default EventPhotoGallery;
