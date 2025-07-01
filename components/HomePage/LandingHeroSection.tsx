"use client"

import { 
  Box, 
  rem, 
  Stack, 
  Title, 
  Group, 
  Button, 
  Text, 
  useMantineColorScheme,
  Container,
  Grid,
  GridCol,
  Badge,
  SimpleGrid,
  Paper,
  ThemeIcon,
  Flex
} from "@mantine/core";
import { 
  IconPlayerPlay, 
  IconMicrophone, 
  IconCalendarEvent,
  IconUsersGroup,
  IconArrowRight,
  IconStar
} from "@tabler/icons-react";
import Link from "next/link";

export default function LandingHeroSection() {
    const { colorScheme } = useMantineColorScheme();
    const isDark = colorScheme === 'dark';

    return (
        <Box
            style={{
                position: 'relative',
                minHeight: '90vh',
                background: isDark
                    ? 'linear-gradient(135deg, #0c0a1b 0%, #1a1432 30%, #2d1b4e 60%, #1e1b4b 100%)'
                    : 'linear-gradient(135deg, #ffffff 0%, #f8faff 30%, #f1f5f9 70%, #e2e8f0 100%)',
                overflow: 'hidden',
            }}
        >
            {/* Sophisticated background elements */}
            <Box
                style={{
                    position: 'absolute',
                    top: '15%',
                    right: '10%',
                    width: '400px',
                    height: '400px',
                    borderRadius: '50%',
                    background: isDark 
                        ? 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 0%, rgba(139, 92, 246, 0.04) 50%, transparent 100%)'
                        : 'radial-gradient(circle, rgba(99, 102, 241, 0.03) 0%, rgba(139, 92, 246, 0.02) 50%, transparent 100%)',
                    filter: 'blur(1px)',
                }}
            />
            
            <Box
                style={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '5%',
                    width: '300px',
                    height: '300px',
                    borderRadius: '40% 60% 60% 40% / 60% 40% 60% 40%',
                    background: isDark 
                        ? 'linear-gradient(135deg, rgba(14, 165, 233, 0.06), rgba(6, 182, 212, 0.03))'
                        : 'linear-gradient(135deg, rgba(14, 165, 233, 0.02), rgba(6, 182, 212, 0.01))',
                    filter: 'blur(0.5px)',
                }}
            />

            {/* Grid pattern overlay */}
            <Box
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: isDark 
                        ? 'radial-gradient(circle, rgba(139, 92, 246, 0.1) 1px, transparent 1px)'
                        : 'radial-gradient(circle, rgba(99, 102, 241, 0.08) 1px, transparent 1px)',
                    backgroundSize: '50px 50px',
                    opacity: 0.3,
                }}
            />

            {/* Main content */}
            <Container size="xl" style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                <Flex direction="column" justify="center" style={{ minHeight: '90vh' }}>
                    <Grid gutter="xl" align="center">
                        <GridCol span={{ base: 12, lg: 7 }}>
                            <Stack gap="xl">
                                <Badge 
                                    size="lg" 
                                    variant="dot"
                                    color={isDark ? "violet" : "indigo"}
                                >
                                    <Text size="sm" fw={600}>Live Music Platform</Text>
                                </Badge>
                                
                                <Title
                                    order={1}
                                    style={{
                                        fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                                        fontWeight: 800,
                                        lineHeight: 1.1,
                                        color: isDark ? '#ffffff' : '#1e293b',
                                        letterSpacing: '-0.02em',
                                    }}
                                >
                                    Where Music
                                    <br />
                                    <Text
                                        span
                                        inherit
                                        style={{
                                            background: isDark 
                                                ? 'linear-gradient(135deg, #8b5cf6, #06b6d4)'
                                                : 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                                            WebkitBackgroundClip: 'text',
                                            WebkitTextFillColor: 'transparent',
                                            backgroundClip: 'text',
                                        }}
                                    >
                                        Comes Alive
                                    </Text>
                                </Title>
                                
                                <Text
                                    size="xl"
                                    style={{
                                        maxWidth: '600px',
                                        fontWeight: 400,
                                        fontSize: 'clamp(1.1rem, 2vw, 1.3rem)',
                                        lineHeight: 1.6,
                                        color: isDark ? '#cbd5e1' : '#64748b',
                                    }}
                                >
                                    Connect with the world's most talented artists, discover groundbreaking live performances, 
                                    and create unforgettable musical experiences that resonate with audiences everywhere.
                                </Text>

                                <Group gap="lg">
                                    <Button
                                        component={Link}
                                        href="/events/create"
                                        leftSection={<IconCalendarEvent size={20} />}
                                        rightSection={<IconArrowRight size={16} />}
                                        size="xl"
                                        radius="xl"
                                        style={{
                                            background: isDark 
                                                ? 'linear-gradient(135deg, #8b5cf6, #3b82f6)'
                                                : 'linear-gradient(135deg, #6366f1, #0ea5e9)',
                                            fontSize: rem(16),
                                            fontWeight: 600,
                                            padding: `${rem(14)} ${rem(28)}`,
                                            boxShadow: isDark 
                                                ? '0 8px 32px rgba(139, 92, 246, 0.3)'
                                                : '0 8px 32px rgba(99, 102, 241, 0.25)',
                                            border: 'none',
                                        }}
                                    >
                                        Book Event
                                    </Button>
                                    
                                    <Button
                                        component={Link}
                                        href="/artists"
                                        variant="outline"
                                        size="xl"
                                        radius="xl"
                                        leftSection={<IconUsersGroup size={20} />}
                                        style={{ 
                                            fontSize: rem(16),
                                            fontWeight: 600,
                                            padding: `${rem(14)} ${rem(28)}`,
                                            borderColor: isDark ? '#475569' : '#cbd5e1',
                                            color: isDark ? '#e2e8f0' : '#475569',
                                        }}
                                    >
                                        Explore Artists
                                    </Button>
                                </Group>
                            </Stack>
                        </GridCol>

                        <GridCol span={{ base: 12, lg: 5 }}>
                            <SimpleGrid cols={2} spacing="lg">
                                {[
                                    { 
                                        icon: IconMicrophone, 
                                        title: "Live Events", 
                                        subtitle: "1,000+ hosted",
                                        color: "violet"
                                    },
                                    { 
                                        icon: IconUsersGroup, 
                                        title: "Active Artists", 
                                        subtitle: "500+ creators",
                                        color: "blue"
                                    },
                                    { 
                                        icon: IconPlayerPlay, 
                                        title: "Tracks Streamed", 
                                        subtitle: "10K+ plays",
                                        color: "cyan"
                                    },
                                    { 
                                        icon: IconStar, 
                                        title: "User Rating", 
                                        subtitle: "4.9/5 stars",
                                        color: "indigo"
                                    },
                                ].map((stat, index) => (
                                    <Paper
                                        key={index}
                                        p="lg"
                                        radius="xl"
                                        style={{
                                            background: isDark 
                                                ? 'rgba(30, 41, 59, 0.5)'
                                                : 'rgba(255, 255, 255, 0.7)',
                                            backdropFilter: 'blur(10px)',
                                            border: isDark 
                                                ? '1px solid rgba(71, 85, 105, 0.3)'
                                                : '1px solid rgba(203, 213, 225, 0.3)',
                                            transition: 'transform 0.2s ease',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.transform = 'translateY(-4px)';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.transform = 'translateY(0)';
                                        }}
                                    >
                                        <Stack gap="sm" align="center">
                                            <ThemeIcon 
                                                size="xl" 
                                                radius="xl" 
                                                color={stat.color}
                                                variant="light"
                                                style={{ 
                                                    background: isDark 
                                                        ? `rgba(${stat.color === 'violet' ? '139, 92, 246' : stat.color === 'blue' ? '59, 130, 246' : stat.color === 'cyan' ? '6, 182, 212' : '99, 102, 241'}, 0.1)`
                                                        : `rgba(${stat.color === 'violet' ? '139, 92, 246' : stat.color === 'blue' ? '59, 130, 246' : stat.color === 'cyan' ? '6, 182, 212' : '99, 102, 241'}, 0.1)`
                                                }}
                                            >
                                                <stat.icon size={24} />
                                            </ThemeIcon>
                                            <Box style={{ textAlign: 'center' }}>
                                                <Text 
                                                    fw={700} 
                                                    size="lg"
                                                    style={{ 
                                                        color: isDark ? '#ffffff' : '#1e293b' 
                                                    }}
                                                >
                                                    {stat.title}
                                                </Text>
                                                <Text 
                                                    size="sm" 
                                                    style={{ 
                                                        color: isDark ? '#94a3b8' : '#64748b' 
                                                    }}
                                                >
                                                    {stat.subtitle}
                                                </Text>
                                            </Box>
                                        </Stack>
                                    </Paper>
                                ))}
                            </SimpleGrid>
                        </GridCol>
                    </Grid>
                </Flex>
            </Container>

            {/* Bottom wave decoration */}
            <Box
                style={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: '100px',
                    background: isDark 
                        ? 'linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(59, 130, 246, 0.05))'
                        : 'linear-gradient(135deg, rgba(99, 102, 241, 0.05), rgba(14, 165, 233, 0.03))',
                    clipPath: 'polygon(0 60%, 100% 100%, 0 100%)',
                }}
            />
        </Box>
    );
}
