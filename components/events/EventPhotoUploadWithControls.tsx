"use client";

import { createClient } from "@/utils/supabase/client";
import { Button, Group, Image as MantineImage, Modal, Paper, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconCheck, IconEye, IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface EventPhotoUploadWithControlsProps {
    eventId: string;
    eventHash: string;
    eventName: string;
    onConfirm?: () => void;
    onCancel?: () => void;
}

interface PendingPhoto {
    id: string;
    file: File;
    url: string; // blob URL for preview
}

export function EventPhotoUploadWithControls({
    eventId,
    eventHash,
    eventName,
    onConfirm,
    onCancel,
}: EventPhotoUploadWithControlsProps) {
    const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([]);
    const [hasChanges, setHasChanges] = useState(false);
    const [isConfirming, setIsConfirming] = useState(false);
    const [currentUserId, setCurrentUserId] = useState<string | null>(null);
    const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);

    // Mobile responsive hooks
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isSmallMobile = useMediaQuery('(max-width: 480px)');

    const maxFileSize = 10 * 1024 * 1024; // 10MB
    const maxPhotos = 20;

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

    const onDrop = (files: FileWithPath[]) => {
        if (files.length === 0) return;

        // Check if we're at the limit
        if (pendingPhotos.length + files.length > maxPhotos) {
            notifications.show({
                title: "Upload Limit",
                message: `You can only upload up to ${maxPhotos} photos`,
                color: "orange",
            });
            return;
        }

        const newPhotos: PendingPhoto[] = files.map(file => ({
            id: uuidv4(),
            file,
            url: URL.createObjectURL(file)
        }));

        setPendingPhotos(prev => [...prev, ...newPhotos]);
        setHasChanges(true);
    };

    const deletePhoto = (photoId: string) => {
        setPendingPhotos(prev => {
            const updatedPhotos = prev.filter(p => p.id !== photoId);
            setHasChanges(updatedPhotos.length > 0);
            // Clean up blob URLs
            const photoToDelete = prev.find(p => p.id === photoId);
            if (photoToDelete) {
                URL.revokeObjectURL(photoToDelete.url);
            }
            return updatedPhotos;
        });
    };

    const handleConfirm = async () => {
        if (pendingPhotos.length === 0 || !currentUserId) return;

        setIsConfirming(true);

        try {
            const supabase = createClient();

            // Upload photos directly to final location and save to database
            for (const pendingPhoto of pendingPhotos) {
                const newFilename = uuidv4();

                // Upload to storage
                const { error: uploadError } = await supabase.storage
                    .from("event-photos")
                    .upload(`${eventHash}/${currentUserId}/${newFilename}`, pendingPhoto.file, {
                        cacheControl: "3600",
                        contentType: pendingPhoto.file.type,
                    });

                if (uploadError) {
                    console.error("Error uploading photo:", uploadError);
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
            }

            notifications.show({
                title: "Photos Confirmed",
                message: `${pendingPhotos.length} photo${pendingPhotos.length !== 1 ? 's' : ''} uploaded successfully for ${eventName}`,
                color: "green",
                icon: <IconCheck size={18} />,
            });

            // Emit event to notify gallery to refresh
            window.dispatchEvent(new CustomEvent('photosConfirmed', {
                detail: { eventId }
            }));

            // Clean up blob URLs and clear state
            pendingPhotos.forEach(photo => URL.revokeObjectURL(photo.url));
            setPendingPhotos([]);
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
            // Clean up blob URLs
            pendingPhotos.forEach(photo => URL.revokeObjectURL(photo.url));

            notifications.show({
                title: "Upload Cancelled",
                message: "Photo upload session cancelled",
                color: "blue",
                icon: <IconX size={18} />,
            });
        }
        setPendingPhotos([]);
        setHasChanges(false);
        onCancel?.();
    };

    return (
        <Paper shadow="sm" p={isMobile ? "md" : "xl"} radius="md">
            <Stack gap={isMobile ? "md" : "lg"}>
                {/* Header */}
                <div>
                    <Title order={isMobile ? 4 : 3} mb="xs">Event Photos</Title>
                    <Text c="dimmed" size={isMobile ? "xs" : "sm"}>
                        Upload photos from {eventName} to share with fans and attendees
                    </Text>
                </div>

                {/* Photo Preview Grid */}
                {pendingPhotos.length > 0 && (
                    <SimpleGrid
                        cols={{ base: 2, sm: 3, md: 4 }}
                        spacing={isMobile ? "xs" : "sm"}
                        style={{ marginBottom: isMobile ? "0.5rem" : "1rem" }}
                    >
                        {pendingPhotos.map((photo) => (
                            <div key={photo.id} style={{ position: "relative" }}>
                                <MantineImage
                                    src={photo.url}
                                    alt="Event photo preview"
                                    style={{
                                        width: "100%",
                                        aspectRatio: "1",
                                        objectFit: "cover",
                                        borderRadius: "8px",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setSelectedPhotoUrl(photo.url)}
                                />
                                <Group
                                    gap={isMobile ? "4px" : "xs"}
                                    style={{
                                        position: "absolute",
                                        top: isMobile ? 2 : 4,
                                        right: isMobile ? 2 : 4,
                                    }}
                                >
                                    <Button
                                        onClick={() => setSelectedPhotoUrl(photo.url)}
                                        color="blue"
                                        variant="light"
                                        size={isMobile ? "xs" : "xs"}
                                        p={isMobile ? 2 : 4}
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            backdropFilter: "blur(4px)",
                                            minHeight: isMobile ? "24px" : "auto",
                                            minWidth: isMobile ? "24px" : "auto",
                                        }}
                                    >
                                        <IconEye size={isMobile ? 10 : 12} />
                                    </Button>
                                    <Button
                                        onClick={() => deletePhoto(photo.id)}
                                        color="red"
                                        variant="light"
                                        size={isMobile ? "xs" : "xs"}
                                        p={isMobile ? 2 : 4}
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            backdropFilter: "blur(4px)",
                                            minHeight: isMobile ? "24px" : "auto",
                                            minWidth: isMobile ? "24px" : "auto",
                                        }}
                                    >
                                        <IconTrash size={isMobile ? 10 : 12} />
                                    </Button>
                                </Group>
                            </div>
                        ))}
                    </SimpleGrid>
                )}

                {/* Dropzone */}
                {pendingPhotos.length < maxPhotos && (
                    <Dropzone
                        onDrop={onDrop}
                        accept={["image/png", "image/jpeg", "image/webp", "image/avif"]}
                        maxSize={maxFileSize}
                        maxFiles={maxPhotos - pendingPhotos.length}
                        multiple={true}
                        style={{
                            minHeight: isMobile ? "200px" : "280px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Group justify="center" align="center" gap={isMobile ? "xs" : "sm"}>
                            <Dropzone.Accept>
                                <IconUpload size={isMobile ? 32 : 50} stroke={1.5} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={isMobile ? 32 : 50} stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <Stack align="center" gap={isMobile ? "xs" : "sm"}>
                                    <IconPhoto size={isMobile ? 32 : 50} stroke={1.5} />
                                    <Text size={isMobile ? "sm" : "md"} ta="center">
                                        {isMobile ? "Tap to upload photos" : "Drag photos here or click to select"}
                                    </Text>
                                    <Text size={isMobile ? "xs" : "sm"} c="dimmed" ta="center">
                                        {isMobile 
                                            ? `Up to ${maxPhotos - pendingPhotos.length} more, max ${Math.round(maxFileSize / (1024 * 1024))}MB`
                                            : `Up to ${maxPhotos - pendingPhotos.length} more photos, max ${Math.round(maxFileSize / (1024 * 1024))}MB each`
                                        }
                                    </Text>
                                </Stack>
                            </Dropzone.Idle>
                        </Group>
                    </Dropzone>
                )}

                {/* Action Buttons */}
                {hasChanges && (
                    <>
                        <Text size={isMobile ? "xs" : "sm"} c="dimmed" ta="center">
                            {pendingPhotos.length} photo{pendingPhotos.length !== 1 ? 's' : ''} ready for {eventName}
                        </Text>

                        <Group justify={isMobile ? "center" : "flex-end"} gap="sm">
                            <Button
                                variant="light"
                                color="gray"
                                leftSection={<IconX size={16} />}
                                onClick={handleCancel}
                                disabled={isConfirming}
                                size={isMobile ? "sm" : "md"}
                                fullWidth={isMobile}
                            >
                                Cancel
                            </Button>
                            <Button
                                variant="filled"
                                color="green"
                                leftSection={<IconCheck size={16} />}
                                onClick={handleConfirm}
                                loading={isConfirming}
                                size={isMobile ? "sm" : "md"}
                                fullWidth={isMobile}
                            >
                                Confirm Upload
                            </Button>
                        </Group>
                    </>
                )}
            </Stack>

            {/* Photo Preview Modal */}
            <Modal
                opened={!!selectedPhotoUrl}
                onClose={() => setSelectedPhotoUrl(null)}
                title={isMobile ? "" : "Photo Preview"}
                size={isMobile ? "xs" : "xl"}
                centered
                fullScreen={isMobile}
                padding={isMobile ? 0 : undefined}
            >
                {selectedPhotoUrl && (
                    <MantineImage
                        src={selectedPhotoUrl}
                        alt="Photo preview"
                        style={{
                            width: "100%",
                            maxHeight: isMobile ? "100vh" : "70vh",
                            objectFit: "contain",
                        }}
                    />
                )}
            </Modal>
        </Paper>
    );
}
