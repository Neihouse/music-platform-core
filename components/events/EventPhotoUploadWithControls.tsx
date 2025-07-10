"use client";

import { PhotoItem, PhotoUpload, PhotoUploadConfig } from "@/components/Upload";
import { createClient } from "@/utils/supabase/client";
import { Button, Group, Paper, Stack, Text, Title } from "@mantine/core";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface EventPhotoUploadWithControlsProps {
    eventId: string;
    eventHash: string;
    eventName: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

// Custom config for staging photos (not saved to DB immediately)
const getStagingPhotoConfig = (eventHash: string, userId: string): PhotoUploadConfig => ({
    storageBucket: "event-photos",
    storageFolder: `staging/${eventHash}`, // Staging folder for the event
    title: "", // Empty to avoid duplicate title
    description: "", // Empty to avoid duplicate description
    maxFileSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    maxPhotos: 20,
});

export function EventPhotoUploadWithControls({
    eventId,
    eventHash,
    eventName,
    onConfirm,
    onCancel,
}: EventPhotoUploadWithControlsProps) {
    const [stagingPhotos, setStagingPhotos] = useState<PhotoItem[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);

    // Get current user ID
    React.useEffect(() => {
        const getCurrentUser = async () => {
            const supabase = createClient();
            const { data: { user } } = await supabase.auth.getUser();
            if (user && !user.is_anonymous) {
                setCurrentUserId(user.id);
            }
        };
        getCurrentUser();
    }, []);

    const stagingPhotoConfig = React.useMemo(() => {
        if (!currentUserId) return null;
        return getStagingPhotoConfig(eventHash, currentUserId);
    }, [eventHash, currentUserId]);

    const handlePhotosUpdated = (updatedPhotos: PhotoItem[]) => {
        setStagingPhotos(updatedPhotos);
        setHasChanges(updatedPhotos.length > 0);
    };

    const handleConfirm = async () => {
        if (stagingPhotos.length === 0 || !currentUserId) return;

        setIsConfirming(true);

        try {
            const supabase = createClient();

            // Move photos from staging to final location and save to database
            for (const photo of stagingPhotos) {
                const newFilename = uuidv4();

                // Copy from staging to final location
                const { data: fileData, error: downloadError } = await supabase.storage
                    .from("event-photos")
                    .download(`staging/${eventHash}/${photo.filename}`);

                if (downloadError) {
                    console.error("Error downloading staging photo:", downloadError);
                    continue;
                }

                // Upload to final location (approved photos go to eventHash/userId/)
                const { error: uploadError } = await supabase.storage
                    .from("event-photos")
                    .upload(`${eventHash}/${currentUserId}/${newFilename}`, fileData, {
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
                        user: currentUserId,
                    });

                if (dbError) {
                    console.error("Error saving photo to database:", dbError);
                    continue;
                }

                // Delete staging file
                await supabase.storage
                    .from("event-photos")
                    .remove([`staging/${eventHash}/${photo.filename}`]);
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
        if (hasChanges && currentUserId) {
            // Clean up staging files
            try {
                const supabase = createClient();
                const filesToDelete = stagingPhotos.map(photo => `staging/${eventHash}/${photo.filename}`);
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
                {stagingPhotoConfig ? (
                    <PhotoUpload
                        config={stagingPhotoConfig}
                        onPhotosUpdated={handlePhotosUpdated}
                    />
                ) : (
                    <Text c="dimmed" ta="center">Loading...</Text>
                )}

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
