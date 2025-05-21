

import {
    Container,
    Title,
    Text,
    Paper,
    Group,
    ThemeIcon,
    Box,
    rem,
    Button,
    Divider
} from "@mantine/core";
import { Dropzone } from '@mantine/dropzone';
import {
    IconMusic,
    IconArrowLeft,
    IconUpload,
    IconX,
    IconFileMusic
} from "@tabler/icons-react";
import Link from "next/link";

export default async function UploadTrackPage() {
    return (
        <Container size="lg" py="xl">
            <Group mb={rem(40)} align="center">
                <Button
                    component={Link}
                    href="/upload"
                    variant="subtle"
                    leftSection={<IconArrowLeft size={16} />}
                >
                    Back to upload options
                </Button>

                <Divider orientation="vertical" />

                <Group gap="xs">
                    <ThemeIcon size="lg" radius="md" color="violet" variant="light">
                        <IconMusic size={18} />
                    </ThemeIcon>
                    <Title order={2}>Upload Tracks</Title>
                </Group>
            </Group>

            <Paper
                p="xl"
                radius="md"
                withBorder
                style={{
                    borderColor: 'var(--mantine-color-violet-2)',
                    position: 'relative',
                    overflow: 'hidden'
                }}
            >
                <Box
                    style={{
                        position: 'absolute',
                        top: '-30px',
                        right: '-10px',
                        opacity: 0.04,
                        zIndex: 0,
                    }}
                >
                    <ThemeIcon size={220} radius={110} color="violet.4">
                        <IconMusic size={140} stroke={1} />
                    </ThemeIcon>
                </Box>

                <Box style={{ position: 'relative', zIndex: 1 }}>
                    <Text size="lg" mb="xl">
                        Upload individual tracks with custom artwork and metadata.
                    </Text>

                    <Dropzone
                        onDrop={(files) => console.log('dropped files', files)}
                        onReject={(files) => console.log('rejected files', files)}
                        maxSize={30 * 1024 * 1024}
                        accept={{
                            'audio/*': ['.mp3', '.wav', '.flac', '.aac', '.ogg']
                        }}
                        p="xl"
                        style={{ marginBottom: rem(20) }}
                    >
                        <Group justify="center" gap="xl" style={{ minHeight: rem(140), pointerEvents: 'none' }}>
                            <Dropzone.Accept>
                                <IconUpload
                                    size={50}
                                    stroke={1.5}
                                    color="var(--mantine-color-violet-6)"
                                />
                            </Dropzone.Accept>
                            <Dropzone.Reject>
                                <IconX
                                    size={50}
                                    stroke={1.5}
                                    color="var(--mantine-color-red-6)"
                                />
                            </Dropzone.Reject>
                            <Dropzone.Idle>
                                <IconFileMusic
                                    size={50}
                                    stroke={1.5}
                                    color="var(--mantine-color-violet-6)"
                                />
                            </Dropzone.Idle>

                            <Box style={{ textAlign: 'center' }}>
                                <Text size="xl" inline>
                                    Drag tracks here or click to browse
                                </Text>
                                <Text size="sm" c="dimmed" inline mt={7}>
                                    Attach up to 10 files at once, each file should not exceed 30MB
                                </Text>
                            </Box>
                        </Group>
                    </Dropzone>

                    <Group justify="center" mt="xl">
                        <Button
                            leftSection={<IconUpload size={18} />}
                            size="lg"
                            variant="gradient"
                            gradient={{ from: 'violet.6', to: 'indigo.6', deg: 90 }}
                        >
                            Select Tracks to Upload
                        </Button>
                    </Group>
                </Box>
            </Paper>
        </Container>
    );
}