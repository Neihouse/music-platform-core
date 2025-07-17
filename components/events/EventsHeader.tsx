"use client";

import { Affix, Button, Group, Stack, Text, Title } from "@mantine/core";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";

interface Event {
    id: string;
    name: string;
    start: string | null;
    hash: string | null;
    poster_img: string | null;
    venues: {
        id: string;
        name: string;
        address: string | null;
    } | null;
}

interface EventsHeaderProps {
    events: Event[];
    userType?: 'artist' | 'promoter' | null;
}

export default function EventsHeader({ events, userType }: EventsHeaderProps) {
    return (
        <>
            <Group justify="space-between" align="start">
                <Stack gap="xs">
                    <Title
                        order={1}
                        fw={700}
                        style={{
                            fontSize: 'clamp(1.8rem, 4vw, 2.5rem)'
                        }}
                    >
                        Events
                    </Title>
                    <Text
                        c="dimmed"
                        style={{
                            fontSize: 'clamp(1rem, 2.5vw, 1.125rem)'
                        }}
                    >
                        Discover upcoming music events and performances
                    </Text>
                </Stack>

                {/* Desktop Create Button */}
                {userType === 'promoter' && (
                    <Button
                        component={Link}
                        href="/promoter/events/create"
                        leftSection={<IconPlus size={16} />}
                        size="lg"
                        variant="filled"
                        display={{ base: 'none', sm: 'block' }}
                    >
                        Create Event
                    </Button>
                )}
            </Group>

            {/* Mobile Floating Action Button */}
            {userType === 'promoter' && (
                <Affix position={{ bottom: 20, right: 20 }}>
                    <Button
                        component={Link}
                        href="/promoter/events/create"
                        size="lg"
                        radius="xl"
                        display={{ base: 'block', sm: 'none' }}
                        style={{
                            width: 56,
                            height: 56,
                            padding: 0,
                            background: 'linear-gradient(135deg, var(--mantine-color-blue-6) 0%, var(--mantine-color-blue-8) 100%)',
                            border: 'none',
                            boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
                        }}
                    >
                        <IconPlus size={24} />
                    </Button>
                </Affix>
            )}
        </>
    );
}