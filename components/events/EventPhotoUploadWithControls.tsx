"use client";

import { PhotoItem, PhotoUpload, PhotoUploadConfig } from "@/components/Upload";
import { createClient } from "@/utils/supabase/client";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface EventPhotoUploadWithControlsProps {
    eventId: string;
    eventName: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

// Custom config for staging photos (not saved to DB immediately)
const stagingPhotoConfig: PhotoUploadConfig = {
    storageBucket: "event-photos",
    storageFolder: "staging", // Temporary staging folder
    title: "Event Photos",
    description: "Upload photos from your event to share with fans and attendees",
    maxFileSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    maxPhotos: 20,
};

export function EventPhotoUploadWithControls({
    eventId,
    eventName,
    onConfirm,
    onCancel,
}: EventPhotoUploadWithControlsProps) {
    const [stagingPhotos, setStagingPhotos] = useState<PhotoItem[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);

    const handlePhotosUpdated = (updatedPhotos: PhotoItem[]) => {
        setStagingPhotos(updatedPhotos);
        setHasChanges(updatedPhotos.length > 0);
    };

    const handleConfirm = async () => {
        if (stagingPhotos.length === 0) return;

        setIsConfirming(true);

        try {
            const supabase = createClient();

            // Move photos from staging to final location and save to database
            for (const photo of stagingPhotos) {
                const newFilename = uuidv4();

                // Copy from staging to final location
                const { data: fileData, error: downloadError } = await supabase.storage
                    .from("event-photos")
                    .download(`staging/${photo.filename}`);

                if (downloadError) {
                    console.error("Error downloading staging photo:", downloadError);
                    continue;
                }

                // Upload to final location
                const { error: uploadError } = await supabase.storage
                    .from("event-photos")
                    .upload(newFilename, fileData, {
                        cacheControl: "3600",
                        contentType: fileData.type,
                    });

                if (uploadError) {
                    console.error("Error uploading final photo:", uploadError);
                    continue;
                }

                // Save to database
                const { error: dbError } = await supabase
                    .from("event_photos")
                    .insert({
                        id: newFilename,
                        event: eventId,
                    });

                if (dbError) {
                    console.error("Error saving photo to database:", dbError);
                    continue;
                }

                // Delete staging file
                await supabase.storage
                    .from("event-photos")
                    .remove([`staging/${photo.filename}`]);
            }

            notifications.show({
                title: "Photos Confirmed",
                message: `${stagingPhotos.length} photo${stagingPhotos.length !== 1 ? 's' : ''} uploaded successfully for ${eventName}`,
                color: "green",
                icon: <IconCheck size={18} />,
            });

            // Emit event to notify gallery to refresh
            window.dispatchEvent(new CustomEvent('photosConfirmed', {
                detail: { eventId }
            }));

            // Clear the staging photos
            setStagingPhotos([]);
            setHasChanges(false);
            onConfirm?.();

        } catch (error) {
            console.error("Error confirming photos:", error);
            notifications.show({
                title: "Error",
                message: "Failed to confirm photos. Please try again.",
                color: "red",
            });
        } finally {
            setIsConfirming(false);
        }
    };

    const handleCancel = async () => {
        if (hasChanges) {
            // Clean up staging files
            try {
                const supabase = createClient();
                const filesToDelete = stagingPhotos.map(photo => `staging/${photo.filename}`);
                await supabase.storage
                    .from("event-photos")
                    .remove(filesToDelete);
            } catch (error) {
                console.error("Error cleaning up staging files:", error);
            }

            notifications.show({
                title: "Upload Cancelled",
                message: "Photo upload session cancelled",
                color: "blue",
                icon: <IconX size={18} />,
            });
        }
        setStagingPhotos([]);
        setHasChanges(false);
        onCancel?.();
    };

    return (
        <Paper shadow="sm" p="xl" radius="md">
            <Stack gap="lg">
                {/* Header */}
                <div>
                    <Title order={3} mb="xs">Event Photos</Title>
                    <Text c="dimmed" size="sm">
                        Upload photos from {eventName} to share with fans and attendees
                    </Text>
                </div>

                {/* Upload Component */}
                <PhotoUpload
                    config={stagingPhotoConfig}
                    onPhotosUpdated={handlePhotosUpdated}
                />

                {/* Action Buttons */}
                {hasChanges && (
                    <>
                        <Text size="sm" c="dimmed" ta="center">
                            {stagingPhotos.length} photo{stagingPhotos.length !== 1 ? 's' : ''} ready for {eventName}
                        </Text>

                        <Group justify="flex-end" gap="sm">
                            <Button
                                variant="light"
                                color="gray"
                                leftSection={<IconX size={16} />}
                                onClick={handleCancel}
                                disabled={isConfirming}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="filled"
                                color="green"
                                leftSection={<IconCheck size={16} />}
                                onClick={handleConfirm}
                                loading={isConfirming}
                            >
                                Confirm Upload
                            </Button>
                        </Group>
                    </>
                )}
            </Stack>
        </Paper>
    );
}
