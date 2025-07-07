"use client"

import { Paper, rem, Stack, Title, Group, Button, Text, Box, ThemeIcon, useMantineColorScheme } from "@mantine/core";
import { IconPlayerPlay, IconMusic, IconHeadphones, IconMicrophone, IconPlaylist, IconNote, IconVinyl } from "@tabler/icons-react";

export default function HeroSection() {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Paper
            py={rem(60)}
            mb={rem(40)}
            radius={0}
            style={{
                backgroundColor: isDark ? 'var(--mantine-color-dark-6)' : 'var(--mantine-color-blue-0)',
                background: isDark
                    ? 'linear-gradient(135deg, var(--mantine-color-violet-9), var(--mantine-color-dark-6))'
                    : 'linear-gradient(135deg, var(--mantine-color-indigo-5), var(--mantine-color-cyan-5))',
                position: 'relative',
                overflow: 'hidden',
                borderBottom: isDark ? '1px solid var(--mantine-color-dark-4)' : 'none',
            }}
        >
            {/* Decorative elements */}
            <Box style={{ position: 'absolute', top: '-60px', right: '10%', opacity: 0.15 }}>
                <ThemeIcon size={280} radius={140} color={isDark ? "dark.4" : "blue.4"}>
                    <IconVinyl size={200} stroke={1} />
                </ThemeIcon>
            </Box>

            <Box style={{ position: 'absolute', bottom: '5%', left: '5%', opacity: 0.08 }}>
                <ThemeIcon size={160} radius={80} color={isDark ? "dark.3" : "indigo.3"}>
                    <IconMusic size={100} stroke={1} />
                </ThemeIcon>
            </Box>

            <Box style={{ position: 'absolute', top: '15%', left: '20%', opacity: 0.07 }}>
                <ThemeIcon size={120} radius={60} color={isDark ? "violet.8" : "cyan.4"}>
                    <IconHeadphones size={70} stroke={1} />
                </ThemeIcon>
            </Box>

            <Box style={{ position: 'absolute', bottom: '15%', right: '15%', opacity: 0.07 }}>
                <ThemeIcon size={140} radius={70} color={isDark ? "violet.7" : "blue.5"}>
                    <IconNote size={80} stroke={1} />
                </ThemeIcon>
            </Box>

            {/* Main content */}
            <Stack gap="lg" style={{ maxWidth: '800px', margin: '0 auto', padding: '0 1rem', position: 'relative', zIndex: 2 }}>
                <Title
                    order={1}
                    size="h1"
                    c={isDark ? 'white' : 'white'}
                    style={{
                        textShadow: isDark ? '0 2px 4px rgba(0, 0, 0, 0.4)' : '0 2px 4px rgba(0, 0, 0, 0.2)',
                        fontSize: 'clamp(2.5rem, 5vw, 3.5rem)'
                    }}
                >
                    Discover Your New Favorite Music
                </Title>
                <Text
                    size="xl"
                    c={isDark ? 'gray.1' : 'white'}
                    style={{
                        maxWidth: '600px',
                        fontWeight: 500,
                        textShadow: isDark ? '0 1px 2px rgba(0, 0, 0, 0.3)' : '0 1px 2px rgba(0, 0, 0, 0.2)'
                    }}
                >
                    Stream exclusive tracks, connect with artists, and build your perfect playlist with Myuzo.
                </Text>
                <Group mt="xl">
                    <Button
                        leftSection={<IconPlayerPlay size={18} />}
                        size="lg"
                        radius="xl"
                        gradient={{ from: isDark ? 'violet.9' : 'blue.5', to: isDark ? 'blue.9' : 'cyan.5', deg: 90 }}
                        variant="gradient"
                    >
                        Start Listening
                    </Button>
                    <Button
                        variant={isDark ? "white" : "filled"}
                        size="lg"
                        radius="xl"
                        leftSection={<IconMicrophone size={18} />}
                        color={isDark ? undefined : "white"}
                        style={{ backgroundColor: isDark ? undefined : "rgba(255, 255, 255, 0.15)" }}
                    >
                        Browse Artists
                    </Button>
                </Group>
            </Stack>
        </Paper>
    );
}