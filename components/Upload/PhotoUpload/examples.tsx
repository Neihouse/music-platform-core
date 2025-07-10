"use client";

import { Container, Stack, Text, Title } from "@mantine/core";
import { EventPhotoUpload, PhotoItem } from "../index";

export interface EventPhotoUploadExampleProps {
    eventId?: string;
}

export function EventPhotoUploadExample({ eventId }: EventPhotoUploadExampleProps) {
    const handlePhotosUploaded = (photos: PhotoItem[]) => {
        console.log("Photos updated:", photos.length, "photos");
    };

    return (
        <Container size="md">
            <Stack gap="md">
                <div>
                    <Title order={3}>Event Photo Upload Example</Title>
                    <Text size="sm" c="dimmed">
                        {eventId
                            ? `Uploading photos for event: ${eventId}`
                            : "Preview mode - no event ID provided"
                        }
                    </Text>
                </div>

                <EventPhotoUpload
                    eventId={eventId}
                    onPhotosUploaded={handlePhotosUploaded}
                />
            </Stack>
        </Container>
    );
}
