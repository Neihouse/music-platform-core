"use client";

import { PhotoItem } from "@/components/Upload";
import {
    ActionIcon,
    Badge,
    Box,
    Card,
    Container,
    Group,
    Image as MantineImage,
    Modal,
    SimpleGrid,
    Stack,
    Text,
    Title
} from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconChevronLeft, IconChevronRight, IconEye, IconPhoto, IconX } from "@tabler/icons-react";
import { useEffect, useState } from "react";

interface EventPhotoGalleryProps {
    eventId: string;
    eventName: string;
    /** Whether this component is being used as a fullscreen page */
    fullscreen?: boolean;
    /** Whether to hide the container wrapper for embedded usage */
    embedded?: boolean;
    /** Pre-fetched photos to display */
    photos?: PhotoItem[];
}

export function EventPhotoGallery({
    eventId,
    eventName,
    fullscreen = false,
    embedded = false,
    photos: initialPhotos = []
}: EventPhotoGalleryProps) {
    const [photos, setPhotos] = useState<PhotoItem[]>(initialPhotos);
    const [selectedPhotoIndex, setSelectedPhotoIndex] = useState<number | null>(null);

    // Update photos when the prop changes
    useEffect(() => {
        setPhotos(initialPhotos);
    }, [initialPhotos]);

    // Mobile responsive hooks
    const isMobile = useMediaQuery('(max-width: 768px)');
    const isTablet = useMediaQuery('(max-width: 1024px)');

    // Determine grid columns based on screen size and usage
    const getGridCols = () => {
        if (fullscreen) {
            return { base: 2, xs: 3, sm: 4, md: 5, lg: 6, xl: 7 };
        }
        return { base: 2, xs: 2, sm: 3, md: 4, lg: 4 };
    };

    const handlePhotosUpdated = (updatedPhotos: PhotoItem[]) => {
        setPhotos(updatedPhotos);
    };

    const openPhotoModal = (index: number) => {
        setSelectedPhotoIndex(index);
    };

    const closePhotoModal = () => {
        setSelectedPhotoIndex(null);
    };

    const navigatePhoto = (direction: 'prev' | 'next') => {
        if (selectedPhotoIndex === null) return;

        const newIndex = direction === 'prev'
            ? (selectedPhotoIndex - 1 + photos.length) % photos.length
            : (selectedPhotoIndex + 1) % photos.length;

        setSelectedPhotoIndex(newIndex);
    };

    const PhotoGrid = ({ photos }: { photos: PhotoItem[] }) => (
        <SimpleGrid
            cols={getGridCols()}
            spacing={fullscreen ? "md" : "sm"}
            style={{ width: "100%" }}
        >
            {photos.map((photo, index) => (
                <Box
                    key={photo.id}
                    style={{
                        position: "relative",
                        aspectRatio: "1",
                        borderRadius: "8px",
                        overflow: "hidden",
                        cursor: "pointer",
                        transition: "transform 0.2s ease, box-shadow 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.transform = "scale(1.02)";
                        e.currentTarget.style.boxShadow = "0 8px 25px rgba(0, 0, 0, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.transform = "scale(1)";
                        e.currentTarget.style.boxShadow = "none";
                    }}
                    onClick={() => openPhotoModal(index)}
                >
                    <MantineImage
                        src={photo.url}
                        alt={`Event photo ${index + 1}`}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                        }}
                        fallbackSrc="https://via.placeholder.com/300x300/f8f9fa/6c757d?text=Photo"
                    />

                    {/* Hover overlay */}
                    <Box
                        style={{
                            position: "absolute",
                            inset: 0,
                            background: "rgba(0, 0, 0, 0.4)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: 0,
                            transition: "opacity 0.2s ease",
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.opacity = "1";
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.opacity = "0";
                        }}
                    >
                        <ActionIcon
                            variant="filled"
                            color="white"
                            size="lg"
                            radius="xl"
                            style={{ backgroundColor: "rgba(255, 255, 255, 0.9)" }}
                        >
                            <IconEye size={20} color="black" />
                        </ActionIcon>
                    </Box>
                </Box>
            ))}
        </SimpleGrid>
    );

    const renderContent = () => (
        <Stack gap={fullscreen ? "lg" : "xl"}>
            {/* Header */}
            {!embedded && (
                <Card p={fullscreen ? "xl" : "lg"} withBorder>
                    <Group justify="space-between" align="flex-start">
                        <div>
                            <Title order={fullscreen ? 1 : 2}>Event Photos</Title>
                            <Text c="dimmed" size={fullscreen ? "md" : "sm"}>
                                {eventName}
                            </Text>
                            <Group gap="xs" mt="xs">
                                <Badge variant="light" color="blue" size={fullscreen ? "md" : "sm"}>
                                    {photos.length} photo{photos.length !== 1 ? 's' : ''}
                                </Badge>
                            </Group>
                        </div>
                    </Group>
                </Card>
            )}

            {/* Photo Gallery Display */}
            <Card p={fullscreen ? "xl" : "lg"} withBorder>
                {photos.length > 0 ? (
                    <Stack gap="lg">
                        <Group justify="space-between" align="center">
                            <div>
                                <Title order={4}>Event Gallery</Title>
                                <Text size="sm" c="dimmed">
                                    Check out photos from this event
                                </Text>
                            </div>
                            <Text size="sm" fw={500}>
                                {photos.length} photo{photos.length !== 1 ? 's' : ''}
                            </Text>
                        </Group>
                        <PhotoGrid photos={photos} />
                    </Stack>
                ) : (
                    <Stack align="center" gap="md" py="xl">
                        <IconPhoto size={48} color="var(--mantine-color-gray-5)" />
                        <Text size="lg" c="dimmed" ta="center">
                            No photos have been uploaded for this event yet.
                        </Text>
                        <Text size="sm" c="dimmed" ta="center">
                            Check back later to see photos from this event!
                        </Text>
                    </Stack>
                )}
            </Card>
        </Stack>
    );

    return (
        <>
            {embedded ? (
                renderContent()
            ) : (
                <Container size={fullscreen ? "xl" : "lg"} p={fullscreen ? "xl" : "md"}>
                    {renderContent()}
                </Container>
            )}

            {/* Photo Modal for full-size viewing */}
            <Modal
                opened={selectedPhotoIndex !== null}
                onClose={closePhotoModal}
                size="xl"
                padding={0}
                centered
                withCloseButton={false}
                styles={{
                    body: {
                        backgroundColor: "transparent",
                        padding: 0,
                    },
                }}
            >
                {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
                    <Box style={{ position: "relative" }}>
                        <MantineImage
                            src={photos[selectedPhotoIndex].url}
                            alt={`Event photo ${selectedPhotoIndex + 1}`}
                            style={{
                                width: "100%",
                                maxHeight: "90vh",
                                objectFit: "contain",
                                borderRadius: "8px",
                            }}
                        />

                        {/* Close button */}
                        <ActionIcon
                            onClick={closePhotoModal}
                            variant="filled"
                            color="dark"
                            size="lg"
                            radius="xl"
                            style={{
                                position: "absolute",
                                top: 16,
                                right: 16,
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                            }}
                        >
                            <IconX size={20} />
                        </ActionIcon>

                        {/* Navigation buttons */}
                        {photos.length > 1 && (
                            <>
                                <ActionIcon
                                    onClick={() => navigatePhoto('prev')}
                                    variant="filled"
                                    color="dark"
                                    size="xl"
                                    radius="xl"
                                    style={{
                                        position: "absolute",
                                        left: 16,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                    }}
                                >
                                    <IconChevronLeft size={24} />
                                </ActionIcon>

                                <ActionIcon
                                    onClick={() => navigatePhoto('next')}
                                    variant="filled"
                                    color="dark"
                                    size="xl"
                                    radius="xl"
                                    style={{
                                        position: "absolute",
                                        right: 16,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                    }}
                                >
                                    <IconChevronRight size={24} />
                                </ActionIcon>
                            </>
                        )}

                        {/* Photo counter */}
                        {photos.length > 1 && (
                            <Box
                                style={{
                                    position: "absolute",
                                    bottom: 16,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    color: "white",
                                    padding: "8px 16px",
                                    borderRadius: "20px",
                                    fontSize: "14px",
                                }}
                            >
                                {selectedPhotoIndex + 1} of {photos.length}
                            </Box>
                        )}
                    </Box>
                )}
            </Modal>
        </>
    );
}

export default EventPhotoGallery;
