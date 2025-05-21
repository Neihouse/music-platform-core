


import {
    Container,
    Title,
    Text,
    Paper,
    Group,
    ThemeIcon,
    Box,
    rem,
    Stepper,
    Button,
    Divider
} from "@mantine/core";
import { IconDisc, IconArrowLeft, IconUpload } from "@tabler/icons-react";
import Link from "next/link";

export default async function UploadAlbumPage() {
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
                    <ThemeIcon size="lg" radius="md" color="blue" variant="light">
                        <IconDisc size={18} />
                    </ThemeIcon>
                    <Title order={2}>Upload Album</Title>
                </Group>
            </Group>

            <Paper
                p="xl"
                radius="md"
                withBorder
                style={{
                    borderColor: 'var(--mantine-color-blue-2)',
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
                    <ThemeIcon size={220} radius={110} color="blue.4">
                        <IconDisc size={140} stroke={1} />
                    </ThemeIcon>
                </Box>

                <Box style={{ position: 'relative', zIndex: 1 }}>
                    <Text size="lg" mb="xl">
                        Create a new album release with multiple tracks and shared artwork.
                    </Text>

                    <Stepper active={0} color="blue">
                        <Stepper.Step
                            label="Album Details"
                            description="Name, genre, release date"
                        />
                        <Stepper.Step
                            label="Upload Artwork"
                            description="Cover image for your album"
                        />
                        <Stepper.Step
                            label="Add Tracks"
                            description="Upload and organize your songs"
                        />
                        <Stepper.Step
                            label="Review & Publish"
                            description="Check and release your album"
                        />
                    </Stepper>
                </Box>

                {/* Album upload form would go here */}
                <Box mt="xl">
                    <Text c="dimmed" mb="md">Album upload functionality coming soon...</Text>
                    <Button
                        leftSection={<IconUpload size={18} />}
                        size="lg"
                        variant="gradient"
                        gradient={{ from: 'blue.6', to: 'cyan.6', deg: 90 }}
                    >
                        Start Album Upload
                    </Button>
                </Box>
            </Paper>
        </Container>
    );
}