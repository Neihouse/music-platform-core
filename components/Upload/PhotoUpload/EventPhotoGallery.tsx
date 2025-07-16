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
    Paper,
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
        <Stack gap={fullscreen ? "lg" : isMobile ? "md" : "xl"}>
            {/* Header */}
            {!embedded && (
                <Card p={fullscreen ? "xl" : isMobile ? "md" : "lg"} withBorder>
                    <Group justify="space-between" align="flex-start">
                        <div>
                            <Title order={fullscreen ? 1 : isMobile ? 3 : 2}>Event Photos</Title>
                            <Text c="dimmed" size={fullscreen ? "md" : isMobile ? "xs" : "sm"}>
                                {eventName}
                            </Text>
                            <Group gap="xs" mt="xs">
                                <Badge variant="light" color="blue" size={fullscreen ? "md" : isMobile ? "xs" : "sm"}>
                                    {photos.length} photo{photos.length !== 1 ? 's' : ''}
                                </Badge>
                            </Group>
                        </div>
                    </Group>
                </Card>
            )}

            {/* Photo Gallery Display */}
            <Paper shadow="sm" p={isMobile ? "md" : "xl"} radius="md">
                {photos.length > 0 ? (
                    <Stack gap={isMobile ? "md" : "lg"}>
                        <Group justify="space-between" align="center">
                            <div>
                                <Title order={isMobile ? 5 : 4}>Event Gallery</Title>
                                <Text size={isMobile ? "xs" : "sm"} c="dimmed">
                                    Check out photos from this event
                                </Text>
                            </div>
                            <Text size={isMobile ? "xs" : "sm"} fw={500}>
                                {photos.length} photo{photos.length !== 1 ? 's' : ''}
                            </Text>
                        </Group>
                        <PhotoGrid photos={photos} />
                    </Stack>
                ) : (
                    <Stack align="center" gap={isMobile ? "sm" : "md"} py={isMobile ? "md" : "xl"}>
                        <IconPhoto size={isMobile ? 36 : 48} color="var(--mantine-color-gray-5)" />
                        <Text size={isMobile ? "md" : "lg"} c="dimmed" ta="center">
                            No photos have been uploaded for this event yet.
                        </Text>
                        <Text size={isMobile ? "xs" : "sm"} c="dimmed" ta="center">
                            Check back later to see photos from this event!
                        </Text>
                    </Stack>
                )}
            </Paper>
        </Stack>
    );

    return (
        <>
            {embedded ? (
                renderContent()
            ) : (
                <Container 
                    size={fullscreen ? "xl" : "lg"} 
                    p={isMobile ? "xs" : (fullscreen ? "xl" : "md")}
                    style={isMobile ? { maxWidth: "100%", margin: 0 } : undefined}
                >
                    {renderContent()}
                </Container>
            )}

            {/* Photo Modal for full-size viewing */}
            <Modal
                opened={selectedPhotoIndex !== null}
                onClose={closePhotoModal}
                size={isMobile ? "100%" : "xl"}
                padding={0}
                centered
                withCloseButton={false}
                fullScreen={isMobile}
                styles={{
                    body: {
                        backgroundColor: "transparent",
                        padding: 0,
                    },
                    inner: isMobile ? {
                        padding: 0,
                    } : undefined,
                }}
            >
                {selectedPhotoIndex !== null && photos[selectedPhotoIndex] && (
                    <Box style={{ position: "relative" }}>
                        <MantineImage
                            src={photos[selectedPhotoIndex].url}
                            alt={`Event photo ${selectedPhotoIndex + 1}`}
                            style={{
                                width: "100%",
                                maxHeight: isMobile ? "100vh" : "90vh",
                                objectFit: "contain",
                                borderRadius: isMobile ? 0 : "8px",
                            }}
                        />

                        {/* Close button */}
                        <ActionIcon
                            onClick={closePhotoModal}
                            variant="filled"
                            color="dark"
                            size={isMobile ? "md" : "lg"}
                            radius="xl"
                            style={{
                                position: "absolute",
                                top: isMobile ? 12 : 16,
                                right: isMobile ? 12 : 16,
                                backgroundColor: "rgba(0, 0, 0, 0.7)",
                                color: "white",
                                zIndex: 1000,
                            }}
                        >
                            <IconX size={isMobile ? 16 : 20} />
                        </ActionIcon>

                        {/* Navigation buttons */}
                        {photos.length > 1 && (
                            <>
                                <ActionIcon
                                    onClick={() => navigatePhoto('prev')}
                                    variant="filled"
                                    color="dark"
                                    size={isMobile ? "lg" : "xl"}
                                    radius="xl"
                                    style={{
                                        position: "absolute",
                                        left: isMobile ? 12 : 16,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                        zIndex: 1000,
                                    }}
                                >
                                    <IconChevronLeft size={isMobile ? 20 : 24} />
                                </ActionIcon>

                                <ActionIcon
                                    onClick={() => navigatePhoto('next')}
                                    variant="filled"
                                    color="dark"
                                    size={isMobile ? "lg" : "xl"}
                                    radius="xl"
                                    style={{
                                        position: "absolute",
                                        right: isMobile ? 12 : 16,
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        backgroundColor: "rgba(0, 0, 0, 0.7)",
                                        color: "white",
                                        zIndex: 1000,
                                    }}
                                >
                                    <IconChevronRight size={isMobile ? 20 : 24} />
                                </ActionIcon>
                            </>
                        )}

                        {/* Photo counter */}
                        {photos.length > 1 && (
                            <Box
                                style={{
                                    position: "absolute",
                                    bottom: isMobile ? 20 : 16,
                                    left: "50%",
                                    transform: "translateX(-50%)",
                                    backgroundColor: "rgba(0, 0, 0, 0.7)",
                                    color: "white",
                                    padding: isMobile ? "6px 12px" : "8px 16px",
                                    borderRadius: "20px",
                                    fontSize: isMobile ? "12px" : "14px",
                                    zIndex: 1000,
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
