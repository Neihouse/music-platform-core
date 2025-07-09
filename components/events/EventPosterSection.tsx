"use client";

import { EventPosterUpload } from "@/components/Upload";
import { getPosterUrl } from "@/lib/images/image-utils-client";
import { AspectRatio, Box, Button, Image, Modal, Stack, Text } from "@mantine/core";
import { IconEdit, IconPhoto, IconUpload } from "@tabler/icons-react";
import { useState } from "react";

interface EventPosterSectionProps {
    event: {
        id: string;
        name: string;
        hash: string | null;
        poster_img: string | null;
    };
    className?: string;
    style?: React.CSSProperties;
    isEventCreator?: boolean;
}

export function EventPosterSection({ event, className, style, isEventCreator = false }: EventPosterSectionProps) {
    const [showUploadModal, setShowUploadModal] = useState(false);
    const [currentPosterUrl, setCurrentPosterUrl] = useState(
        event.poster_img ? getPosterUrl(event.poster_img) : null
    );

    const handlePosterUploaded = (url: string) => {
        setCurrentPosterUrl(url);
        setShowUploadModal(false);
    };

    return (
        <>
            <AspectRatio ratio={2 / 3} className={className} style={style}>
                {currentPosterUrl ? (
                    <Box style={{ position: 'relative', width: '100%', height: '100%' }}>
                        <Image
                            src={currentPosterUrl}
                            alt={`${event.name} poster`}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                borderRadius: '12px',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                            }}
                            fallbackSrc="/artist-not-found.svg"
                        />
                        {/* Edit overlay - only show if user is event creator */}
                        {isEventCreator && (
                            <Button
                                variant="filled"
                                color="blue"
                                size="sm"
                                leftSection={<IconEdit size={16} />}
                                onClick={() => setShowUploadModal(true)}
                                style={{
                                    position: 'absolute',
                                    top: '12px',
                                    right: '12px',
                                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                                    backdropFilter: 'blur(4px)',
                                    border: '1px solid rgba(255, 255, 255, 0.2)',
                                }}
                            >
                                Edit
                            </Button>
                        )}
                    </Box>
                ) : (
                    // Only show upload placeholder if user is event creator
                    isEventCreator ? (
                        <Box
                            style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
                                cursor: 'pointer',
                            }}
                            onClick={() => setShowUploadModal(true)}
                        >
                            <Stack align="center" gap="md" style={{ color: 'white', textAlign: 'center' }}>
                                <IconUpload size={48} opacity={0.7} />
                                <Text size="lg" fw={500}>Upload Poster</Text>
                                <Text size="sm" opacity={0.8}>Click to upload a poster for this event</Text>
                            </Stack>
                        </Box>
                    ) : (
                        // Show placeholder for non-creators
                        <Box
                            style={{
                                width: '100%',
                                height: '100%',
                                background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 8px 32px rgba(0, 0, 0, 0.1)',
                            }}
                        >
                            <Stack align="center" gap="md" style={{ color: 'var(--mantine-color-gray-6)', textAlign: 'center' }}>
                                <IconPhoto size={48} opacity={0.5} />
                                <Text size="lg" fw={500}>No Poster</Text>
                                <Text size="sm" opacity={0.8}>Event poster will appear here when uploaded</Text>
                            </Stack>
                        </Box>
                    )
                )}
            </AspectRatio>

            {/* Upload Modal - only show if user is event creator */}
            {isEventCreator && (
                <Modal
                    opened={showUploadModal}
                    onClose={() => setShowUploadModal(false)}
                    title={`${currentPosterUrl ? 'Update' : 'Upload'} Event Poster`}
                    size="md"
                    centered
                >
                    <Stack gap="md">
                        <EventPosterUpload
                            eventId={event.id}
                            onPosterUploaded={handlePosterUploaded}
                        />
                    </Stack>
                </Modal>
            )}
        </>
    );
}
