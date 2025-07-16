"use client";

import { createClient } from "@/utils/supabase/client";
import { Button, Group, Image as MantineImage, Modal, SimpleGrid, Stack, Text, Title } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconEye, IconPhoto, IconTrash, IconUpload, IconX } from "@tabler/icons-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

export interface PhotoUploadConfig {
    /** The storage bucket name */
    storageBucket: string;
    /** The storage folder path (e.g., "event-photos") */
    storageFolder: string;
    /** Display title for the upload section */
    title: string;
    /** Description text for the upload section */
    description: string;
    /** Max file size in bytes */
    maxFileSize?: number;
    /** Allow multiple photos upload */
    multiple?: boolean;
    /** Max number of photos if multiple is true */
    maxPhotos?: number;
}

export interface PhotoItem {
    id: string;
    url: string;
    filename: string;
}

export interface IPhotoUploadProps {
    /** The entity ID (can be eventId, etc.) */
    entityId?: string;
    /** Configuration for the specific entity type */
    config: PhotoUploadConfig;
    /** Function to fetch existing photos */
    fetchExistingPhotos?: (entityId: string) => Promise<PhotoItem[]>;
    /** Function to add a new photo */
    addPhoto?: (entityId: string, filename: string) => Promise<string>; // returns photo ID
    /** Function to delete a photo */
    deletePhoto?: (photoId: string, filename: string) => Promise<void>;
    /** Callback when photos are updated */
    onPhotosUpdated?: (photos: PhotoItem[]) => void;
}

export function PhotoUpload({
    entityId,
    config,
    fetchExistingPhotos,
    addPhoto,
    deletePhoto,
    onPhotosUpdated,
}: IPhotoUploadProps) {
    const [uploadState, setUploadState] = React.useState<
        "initial" | "pending" | "error" | "success"
    >("initial");
    const [photos, setPhotos] = React.useState<PhotoItem[]>([]);
    const [selectedPhotoUrl, setSelectedPhotoUrl] = React.useState<string | null>(null);

    // Mobile responsive hooks
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isSmallMobile = useMediaQuery('(max-width: 480px)');

    const maxFileSize = config.maxFileSize || 10 * 1024 * 1024; // 10MB default
    const isMultiple = config.multiple ?? true;
    const maxPhotos = config.maxPhotos ?? 20;

    // Fetch existing photos when component mounts
    React.useEffect(() => {
        async function fetchPhotos() {
            if (!entityId || !fetchExistingPhotos) return;

            try {
                const existingPhotos = await fetchExistingPhotos(entityId);
                setPhotos(existingPhotos);

                if (onPhotosUpdated) {
                    onPhotosUpdated(existingPhotos);
                }
            } catch (error) {
                console.error("Error fetching existing photos:", error);
            }
        }

        fetchPhotos();
    }, [entityId, fetchExistingPhotos, onPhotosUpdated]);

    const deleteImage = async (photo: PhotoItem) => {
        const confirmed = window.confirm("Are you sure you want to delete this photo? This action cannot be undone.");

        if (!confirmed) return;

        if (!entityId || !deletePhoto) {
            // If no entityId or deletePhoto function, just remove from local state
            const updatedPhotos = photos.filter(p => p.id !== photo.id);
            setPhotos(updatedPhotos);
            if (onPhotosUpdated) {
                onPhotosUpdated(updatedPhotos);
            }
            return;
        }

        setUploadState("pending");
        try {
            const supabase = createClient();

            // Delete the file from storage
            const { error: storageError } = await supabase.storage
                .from(config.storageBucket)
                .remove([`${config.storageFolder ? `${config.storageFolder}/` : ''}${photo.filename}`]);

            if (storageError) {
                console.error("Error deleting photo file:", storageError);
            }

            // Delete the photo record
            await deletePhoto(photo.id, photo.filename);

            // Update local state
            const updatedPhotos = photos.filter(p => p.id !== photo.id);
            setPhotos(updatedPhotos);

            if (onPhotosUpdated) {
                onPhotosUpdated(updatedPhotos);
            }

            notifications.show({
                message: "Photo deleted successfully",
                color: "green",
            });
            setUploadState("initial");
        } catch (error: any) {
            console.error("Error deleting photo:", error);
            notifications.show({
                title: "Error",
                message: `Failed to delete photo: ${error.message || error}`,
                color: "red",
            });
            setUploadState("error");
        }
    };

    const onDrop = async (files: FileWithPath[]) => {
        if (files.length === 0) return;

        // Check if we're at the limit
        if (isMultiple && photos.length + files.length > maxPhotos) {
            notifications.show({
                title: "Upload Limit",
                message: `You can only upload up to ${maxPhotos} photos`,
                color: "orange",
            });
            return;
        }

        setUploadState("pending");

        try {
            const newPhotos: PhotoItem[] = [];

            for (const file of files) {
                // If no entityId is provided, we're in preview mode
                if (!entityId) {
                    const url = URL.createObjectURL(file);
                    const photoItem: PhotoItem = {
                        id: uuidv4(),
                        url,
                        filename: file.name,
                    };
                    newPhotos.push(photoItem);
                    continue;
                }

                // Generate a random UUID for the filename
                const filename = uuidv4();
                const supabase = createClient();

                // Upload the photo
                const { data, error } = await supabase.storage
                    .from(config.storageBucket)
                    .upload(`${config.storageFolder ? `${config.storageFolder}/` : ''}${filename}`, file, {
                        cacheControl: "3600",
                        contentType: file.type,
                    });

                if (error) {
                    console.error("Error uploading photo:", error);
                    continue;
                }

                // Add the photo record if function is provided
                let photoId = filename; // fallback to filename as ID
                if (addPhoto) {
                    photoId = await addPhoto(entityId, filename);
                }

                const { data: publicUrlData } = supabase.storage
                    .from(config.storageBucket)
                    .getPublicUrl(`${config.storageFolder ? `${config.storageFolder}/` : ''}${filename}`);

                const photoItem: PhotoItem = {
                    id: photoId,
                    url: publicUrlData.publicUrl,
                    filename,
                };
                newPhotos.push(photoItem);
            }

            // Update local state
            const updatedPhotos = isMultiple ? [...photos, ...newPhotos] : newPhotos;
            setPhotos(updatedPhotos);

            if (onPhotosUpdated) {
                onPhotosUpdated(updatedPhotos);
            }

            notifications.show({
                message: `${newPhotos.length} photo${newPhotos.length > 1 ? 's' : ''} uploaded successfully`,
                color: "green",
            });

            setUploadState("success");
        } catch (error: any) {
            notifications.show({
                title: "Upload Error",
                message: error.message || String(error),
                color: "red",
            });
            setUploadState("error");
        }
    };

    return (
        <>
            <Stack gap={isSmallMobile ? "sm" : "md"}>
                {config.title && (
                    <Title order={4} size={isSmallMobile ? "1rem" : undefined}>
                        {config.title}
                    </Title>
                )}
                {config.description && (
                    <Text size={isSmallMobile ? "xs" : "sm"} c="dimmed">
                        {config.description}
                    </Text>
                )}

                {photos.length > 0 && (
                    <SimpleGrid
                        cols={{ base: 2, sm: 3, md: 4 }}
                        spacing="sm"
                        style={{ marginBottom: "1rem" }}
                    >
                        {photos.map((photo) => (
                            <div key={photo.id} style={{ position: "relative" }}>
                                <MantineImage
                                    src={photo.url}
                                    alt="Event photo"
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
                                    gap="xs"
                                    style={{
                                        position: "absolute",
                                        top: 4,
                                        right: 4,
                                    }}
                                >
                                    <Button
                                        onClick={() => setSelectedPhotoUrl(photo.url)}
                                        color="blue"
                                        variant="light"
                                        size="xs"
                                        p={4}
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    >
                                        <IconEye size={12} />
                                    </Button>
                                    <Button
                                        onClick={() => deleteImage(photo)}
                                        color="red"
                                        variant="light"
                                        size="xs"
                                        p={4}
                                        style={{
                                            backgroundColor: "rgba(255, 255, 255, 0.9)",
                                            backdropFilter: "blur(4px)",
                                        }}
                                    >
                                        <IconTrash size={12} />
                                    </Button>
                                </Group>
                            </div>
                        ))}
                    </SimpleGrid>
                )}

                {(!isMultiple && photos.length > 0) ? null : (
                    <Dropzone
                        loading={uploadState === "pending"}
                        onDrop={onDrop}
                        accept={["image/png", "image/jpeg", "image/webp", "image/avif"]}
                        maxSize={maxFileSize}
                        maxFiles={isMultiple ? maxPhotos - photos.length : 1}
                        multiple={isMultiple}
                        style={{
                            minHeight: isSmallMobile ? "180px" : isMobile ? "220px" : "280px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Group justify="center" align="center" gap={isSmallMobile ? "xs" : "sm"}>
                            <Dropzone.Accept>
                                <IconUpload size={isSmallMobile ? 32 : 50} stroke={1.5} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={isSmallMobile ? 32 : 50} stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <Stack align="center" gap={isSmallMobile ? "xs" : "sm"}>
                                    <IconPhoto size={isSmallMobile ? 32 : 50} stroke={1.5} />
                                    <Text size={isSmallMobile ? "sm" : "md"} ta="center">
                                        {isSmallMobile
                                            ? `Upload photo${isMultiple ? 's' : ''}`
                                            : `Drag photo${isMultiple ? 's' : ''} here or click to select`
                                        }
                                    </Text>
                                    <Text size="sm" c="dimmed" ta="center">
                                        {isMultiple && `Up to ${maxPhotos - photos.length} more photos, `}
                                        max {Math.round(maxFileSize / (1024 * 1024))}MB each
                                    </Text>
                                </Stack>
                            </Dropzone.Idle>
                        </Group>
                    </Dropzone>
                )}
            </Stack>

            {/* Photo Preview Modal */}
            <Modal
                opened={!!selectedPhotoUrl}
                onClose={() => setSelectedPhotoUrl(null)}
                title="Photo Preview"
                size="xl"
                centered
            >
                {selectedPhotoUrl && (
                    <MantineImage
                        src={selectedPhotoUrl}
                        alt="Photo preview"
                        style={{
                            width: "100%",
                            maxHeight: "70vh",
                            objectFit: "contain",
                        }}
                    />
                )}
            </Modal>
        </>
    );
}
