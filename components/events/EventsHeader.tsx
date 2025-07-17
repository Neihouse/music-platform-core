"use client";

import { Affix, Button, Group, Stack, Text, Title } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconPlus } from "@tabler/icons-react";
import Link from "next/link";
import { useEffect, useState } from "react";

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
    const [mounted, setMounted] = useState(false);
    const isMobile = useMediaQuery('(max-width: 768px)');

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <>
            <Group justify="space-between" align="start">
                <Stack gap="xs">
                    <Title
                        order={1}
                        size={mounted && isMobile ? "1.8rem" : "2.5rem"}
                        fw={700}
                    >
                        Events
                    </Title>
                    <Text size={mounted && isMobile ? "md" : "lg"} c="dimmed">
                        Discover upcoming music events and performances
                    </Text>
                </Stack>
                {userType === 'promoter' && (!mounted || !isMobile) && (
                    <Button
                        component={Link}
                        href="/promoter/events/create"
                        leftSection={<IconPlus size={16} />}
                        size="lg"
                        variant="filled"
                    >
                        Create Event
                    </Button>
                )}
            </Group>

            {/* Floating Action Button for Mobile */}
            {userType === 'promoter' && mounted && isMobile && (
                <Affix position={{ bottom: 20, right: 20 }}>
                    <Button
                        component={Link}
                        href="/promoter/events/create"
                        size="lg"
                        radius="xl"
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