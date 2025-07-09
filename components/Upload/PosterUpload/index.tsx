"use client";

import { createClient } from "@/utils/supabase/client";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

export interface PosterUploadConfig {
    /** The storage bucket name */
    storageBucket: string;
    /** The storage folder path (e.g., "posters") */
    storageFolder: string;
    /** Display title for the upload section */
    title: string;
    /** Description text for the upload section */
    description: string;
    /** Max file size in bytes */
    maxFileSize?: number;
}

export interface IPosterUploadProps {
    /** The entity ID (can be eventId, etc.) */
    entityId?: string;
    /** Configuration for the specific entity type */
    config: PosterUploadConfig;
    /** Function to fetch existing poster filename */
    fetchExistingPoster?: (entityId: string) => Promise<string | null>;
    /** Function to update the entity with new poster filename */
    updateEntityPoster?: (entityId: string, filename: string | null) => Promise<void>;
    /** Callback when poster is uploaded */
    onPosterUploaded?: (url: string) => void;
}

export function PosterUpload({
    entityId,
    config,
    fetchExistingPoster,
    updateEntityPoster,
    onPosterUploaded,
}: IPosterUploadProps) {
    const [uploadState, setUploadState] = React.useState<
        "initial" | "pending" | "error" | "success"
    >("initial");
    const [imageUrl, setImageUrl] = React.useState<string | null>(null);
    const [currentPosterFilename, setCurrentPosterFilename] = React.useState<string | null>(null);

    // Mobile responsive hooks
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isSmallMobile = useMediaQuery('(max-width: 480px)');

    const maxFileSize = config.maxFileSize || 10 * 1024 * 1024; // 10MB default

    // Fetch existing poster when component mounts
    React.useEffect(() => {
        async function fetchPoster() {
            if (!entityId || !fetchExistingPoster) return;

            try {
                const posterFilename = await fetchExistingPoster(entityId);

                if (posterFilename) {
                    // Check if the file exists in storage before getting the URL
                    const supabase = createClient();
                    const { data, error } = await supabase.storage
                        .from(config.storageBucket)
                        .list(config.storageFolder, {
                            search: posterFilename
                        });

                    if (error) {
                        console.error("Error checking file existence:", error);
                        return;
                    }

                    // Check if the file was found in the storage bucket
                    const fileExists = data && data.some(file => file.name === posterFilename);

                    if (fileExists) {
                        const { data: publicUrlData } = supabase.storage
                            .from(config.storageBucket)
                            .getPublicUrl(`${config.storageFolder ? `${config.storageFolder}/` : ''}${posterFilename}`);

                        const url = publicUrlData.publicUrl;
                        setImageUrl(url);
                        setCurrentPosterFilename(posterFilename);

                        if (onPosterUploaded) {
                            onPosterUploaded(url);
                        }
                    } else {
                        console.warn(`Poster file ${posterFilename} not found in storage`);
                    }
                }
            } catch (error) {
                console.error("Error fetching existing poster:", error);
            }
        }

        fetchPoster();
    }, [entityId, onPosterUploaded, config, fetchExistingPoster]);

    return (
        <Card withBorder p={isSmallMobile ? "sm" : "md"}>
            <Stack gap={isSmallMobile ? "sm" : "md"}>
                <Title order={4} size={isSmallMobile ? "1rem" : undefined}>
                    {config.title}
                </Title>
                <Text size={isSmallMobile ? "xs" : "sm"} c="dimmed">
                    {config.description}
                </Text>
                {imageUrl ? (
                    <div>
                        <div
                            style={{
                                position: "relative",
                                width: "100%",
                                marginBottom: "0.5rem",
                            }}
                        >
                            <img
                                src={imageUrl}
                                alt="Poster image"
                                style={{
                                    width: "100%",
                                    height: isSmallMobile ? "300px" : isMobile ? "400px" : "500px",
                                    objectFit: "contain",
                                    borderRadius: "8px",
                                    backgroundColor: "var(--mantine-color-gray-1)",
                                }}
                            />
                            <Button
                                onClick={deleteImage}
                                color="red"
                                variant="light"
                                style={{
                                    position: "absolute",
                                    top: 8,
                                    right: 8,
                                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                                    backdropFilter: "blur(4px)",
                                    border: "1px solid rgba(0, 0, 0, 0.1)",
                                    boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                                }}
                                radius="md"
                                size={isSmallMobile ? "xs" : "sm"}
                            >
                                <IconX size={isSmallMobile ? 12 : 16} />
                            </Button>
                        </div>
                    </div>
                ) : (
                    <Dropzone
                        loading={uploadState === "pending"}
                        onDrop={onDrop}
                        accept={["image/png", "image/jpeg", "image/webp"]}
                        maxSize={maxFileSize}
                        maxFiles={1}
                        style={{
                            minHeight: isSmallMobile ? "200px" : isMobile ? "250px" : "300px",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                        }}
                    >
                        <Group justify="center" align="center" gap={isSmallMobile ? "xs" : "sm"}>
                            <Dropzone.Accept>
                                <IconUpload size={isSmallMobile ? 24 : 40} stroke={1.5} />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX size={isSmallMobile ? 24 : 40} stroke={1.5} />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <Stack align="center" gap={isSmallMobile ? "xs" : "sm"}>
                                    <IconPhoto size={isSmallMobile ? 24 : 40} stroke={1.5} />
                                    <Text size={isSmallMobile ? "xs" : "sm"} ta="center">
                                        {isSmallMobile ? "Upload poster" : "Drag poster image here or click to select"}
                                    </Text>
                                    <Text size="xs" c="dimmed" ta="center">
                                        Poster format recommended (2:3 ratio), max {Math.round(maxFileSize / (1024 * 1024))}MB
                                    </Text>
                                </Stack>
                            </Dropzone.Idle>
                        </Group>
                    </Dropzone>
                )}
            </Stack>
        </Card>
    );

    async function deleteImage() {
        if (!entityId) {
            setImageUrl(null);
            setCurrentPosterFilename(null);
            if (onPosterUploaded) {
                onPosterUploaded("");
            }
            return;
        }

        setUploadState("pending");
        try {
            const supabase = createClient();

            // Delete the file from storage if it exists
            if (currentPosterFilename) {
                const { error: storageError } = await supabase.storage
                    .from(config.storageBucket)
                    .remove([`${config.storageFolder ? `${config.storageFolder}/` : ''}${currentPosterFilename}`]);

                if (storageError) {
                    console.error("Error deleting poster file:", storageError);
                }
            }

            // Update the entity to remove the poster filename
            if (updateEntityPoster) {
                await updateEntityPoster(entityId, null);
            }

            setImageUrl(null);
            setCurrentPosterFilename(null);

            if (onPosterUploaded) {
                onPosterUploaded("");
            }
            notifications.show({
                message: "Poster image deleted successfully",
                color: "green",
            });
            setUploadState("initial");
        } catch (error: any) {
            console.error("Error deleting poster image:", error);
            notifications.show({
                title: "Error",
                message: `Failed to delete poster image: ${error.message || error}`,
                color: "red",
            });
            setUploadState("error");
        }
    }

    async function onDrop(files: FileWithPath[]) {
        if (files.length === 0) return;

        setUploadState("pending");
        const file = files[0];

        try {
            // If no entityId is provided, we're in create mode and just want to preview the image
            if (!entityId) {
                const reader = new FileReader();
                reader.onload = (e) => {
                    const url = e.target?.result as string;
                    setImageUrl(url);
                    if (onPosterUploaded) {
                        onPosterUploaded(url);
                    }
                };
                reader.readAsDataURL(file);
                setUploadState("success");
                return;
            }

            // Generate a random UUID for the filename
            const fileExt = file.name.split('.').pop();
            const filename = `${uuidv4()}.${fileExt}`;

            const supabase = createClient();

            // Delete old poster file if it exists
            if (currentPosterFilename) {
                await supabase.storage
                    .from(config.storageBucket)
                    .remove([`${config.storageFolder ? `${config.storageFolder}/` : ''}${currentPosterFilename}`]);
            }

            console.log("Uploading new poster with filename:", filename);
            // Upload new poster with UUID filename
            const { data, error } = await supabase.storage
                .from(config.storageBucket)
                .upload(`${config.storageFolder ? `${config.storageFolder}/` : ''}${filename}`, file, {
                    cacheControl: "3600",
                    contentType: file.type,
                });

            if (error) {
                console.error("Error uploading file:", error);
                notifications.show({
                    title: "Upload Error",
                    message: error.message,
                    color: "red",
                });
                setUploadState("error");
                return;
            }

            // Update the entity with the new poster filename
            if (updateEntityPoster) {
                await updateEntityPoster(entityId, filename);
            }

            const { data: publicUrlData } = supabase.storage
                .from(config.storageBucket)
                .getPublicUrl(`${config.storageFolder ? `${config.storageFolder}/` : ''}${filename}`);

            const url = publicUrlData.publicUrl;
            setImageUrl(url);
            setCurrentPosterFilename(filename);

            if (onPosterUploaded) {
                onPosterUploaded(url);
            }

            notifications.show({
                message: "Poster image uploaded successfully",
                color: "green",
            });

            setUploadState("success");
        } catch (error: any) {
            console.error("Error uploading file:", error);
            notifications.show({
                title: "Upload Error",
                message: error.message || String(error),
                color: "red",
            });
            setUploadState("error");
        }
    }
}
