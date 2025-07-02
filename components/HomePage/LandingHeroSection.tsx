"use client"

import { 
  Box, 
  useMantineColorScheme,
  Container,
  Grid,
  GridCol,
  SimpleGrid,
  Flex
} from "@mantine/core";
import { 
  IconPlayerPlay, 
  IconMicrophone, 
  IconCalendarEvent,
  IconUsersGroup,
  IconStar
} from "@tabler/icons-react";
import StatCard from "./StatCard";
import BackgroundElements from "./BackgroundElements";
import HeroContent from "./HeroContent";

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
            <BackgroundElements />

            {/* Main content */}
            <Container size="xl" style={{ position: 'relative', zIndex: 2, height: '100%' }}>
                <Flex direction="column" justify="center" style={{ minHeight: '90vh' }}>
                    <Grid gutter="xl" align="center">
                        <GridCol span={{ base: 12, lg: 7 }}>
                            <HeroContent />
                        </GridCol>

                        <GridCol span={{ base: 12, lg: 5 }}>
                            <SimpleGrid cols={2} spacing="lg">
                                {[
                                    { 
                                        icon: IconMicrophone, 
                                        title: "Live Events", 
                                        subtitle: "1,000+ hosted",
                                        color: "violet" as const
                                    },
                                    { 
                                        icon: IconUsersGroup, 
                                        title: "Active Artists", 
                                        subtitle: "500+ creators",
                                        color: "blue" as const
                                    },
                                    { 
                                        icon: IconPlayerPlay, 
                                        title: "Tracks Streamed", 
                                        subtitle: "10K+ plays",
                                        color: "cyan" as const
                                    },
                                    { 
                                        icon: IconStar, 
                                        title: "User Rating", 
                                        subtitle: "4.9/5 stars",
                                        color: "indigo" as const
                                    },
                                ].map((stat, index) => (
                                    <StatCard
                                        key={index}
                                        icon={stat.icon}
                                        title={stat.title}
                                        subtitle={stat.subtitle}
                                        color={stat.color}
                                    />
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
