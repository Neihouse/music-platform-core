"use client";

import {
    Box,
    Card,
    Group,
    Paper,
    SimpleGrid,
    Stack,
    Text,
    ThemeIcon,
    Title,
    rem,
} from "@mantine/core";
import {
    IconMicrophone,
    IconUsers,
} from "@tabler/icons-react";

export function UserTypeOnboarding() {
    // Define the user type options with their details
    const userTypes = [
        {
            title: "Artist",
            icon: IconMicrophone,
            description: "Upload and share your music with fans",
            type: 'artist' as const,
            color: "blue",
        },
        {
            title: "Collective",
            icon: IconUsers,
            description: "Promote events and manage artists",
            type: 'collective' as const,
            color: "orange",
        },
    ];

    const handleTypeSelect = (type: 'artist' | 'collective') => {
        // Navigate to the appropriate create page instead of showing the form inline
        if (type === 'artist') {
            window.location.href = '/artists/create';
        } else {
            window.location.href = '/promoters/create';
        }
    };

    return (
        <Paper withBorder radius="md" p="lg" shadow="md">
            <Stack gap="md">
                <div>
                    <Title order={3} ta="center" mb="xs">
                        Complete Your Profile
                    </Title>
                    <Text ta="center" size="md" c="dimmed">
                        Tell us how you want to use our platform
                    </Text>
                </div>

                <SimpleGrid cols={{ base: 1, sm: 2 }} spacing="md">
                    {userTypes.map((type) => (
                        <Card
                            key={type.title}
                            padding="md"
                            radius="md"
                            withBorder
                            onClick={() => handleTypeSelect(type.type)}
                            style={{
                                cursor: 'pointer',
                                textDecoration: "none",
                                transition: "transform 0.2s, box-shadow 0.2s",
                            }}
                            className="hover:shadow-lg hover:-translate-y-1"
                        >
                            <Group wrap="nowrap" align="flex-start" gap="xs">
                                <ThemeIcon
                                    size={rem(36)}
                                    radius="md"
                                    color={type.color}
                                    variant="light"
                                >
                                    <type.icon size={rem(20)} stroke={1.5} />
                                </ThemeIcon>
                                <Box style={{ flex: 1 }}>
                                    <Text fw={500} size="md">
                                        {type.title}
                                    </Text>
                                    <Text size="xs" c="dimmed">
                                        {type.description}
                                    </Text>
                                </Box>
                            </Group>
                        </Card>
                    ))}
                </SimpleGrid>
            </Stack>
        </Paper>
    );
}
