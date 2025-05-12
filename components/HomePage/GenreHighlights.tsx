"use client"

import {
    Card,
    Group,
    Box,
    Title,
    ThemeIcon,
    Grid,
    GridCol,
    Text,
    rem
} from "@mantine/core";
import {
    IconPlaylist,
    IconVinyl,
    IconHeadphones
} from "@tabler/icons-react";

interface GenreHighlightsProps {
    genres?: string[];
}

export default function GenreHighlights({ genres = ['Electronic', 'Hip-Hop', 'Indie', 'Jazz'] }: GenreHighlightsProps) {
    return (
        <Card
            shadow="sm"
            padding="xl"
            radius="md"
            withBorder
            style={{
                overflow: 'hidden',
                position: 'relative',
                borderColor: 'var(--mantine-color-violet-2)'
            }}
        >
            {/* Decorative background element */}
            <Box
                style={{
                    position: 'absolute',
                    left: -40,
                    top: -10,
                    opacity: 0.06,
                    zIndex: 0,
                    transform: 'rotate(-15deg)',
                }}
            >
                <ThemeIcon size={200} radius={100} color="violet.4">
                    <IconVinyl size={120} stroke={1} />
                </ThemeIcon>
            </Box>

            <Group justify="space-between" mb="xl" style={{ position: 'relative', zIndex: 1 }}>
                <Group gap="xs">
                    <ThemeIcon size="md" radius="md" color="violet" variant="light">
                        <IconPlaylist size={14} />
                    </ThemeIcon>
                    <Title order={3}>Genre Highlights</Title>
                </Group>
            </Group>

            <Grid gutter="xs" style={{ position: 'relative', zIndex: 1 }}>
                {genres.map((genre, index) => (
                    <GridCol key={genre} span={{ base: 6, md: 3 }}>
                        <Card
                            padding="xs"
                            radius="md"
                            withBorder
                            style={{ height: '100%', textAlign: 'center', borderColor: 'var(--mantine-color-gray-2)' }}
                        >
                            <ThemeIcon
                                size={60}
                                radius={30}
                                color={['blue', 'cyan', 'violet', 'indigo'][index % 4]}
                                variant="light"
                                mb="md"
                                style={{ margin: '0 auto' }}
                            >
                                <IconHeadphones size={30} stroke={1.5} />
                            </ThemeIcon>
                            <Text fw={600} mb="xs">{genre}</Text>
                            <Text size="sm" c="dimmed">Explore the latest tracks</Text>
                        </Card>
                    </GridCol>
                ))}
            </Grid>
        </Card>
    );
}
