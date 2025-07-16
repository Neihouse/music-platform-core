"use client";

import { Button, Group, Stack, Text, Title } from "@mantine/core";
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
        <Group justify="space-between" align="start">
            <Stack gap="xs">
                <Title
                    order={1}
                    size="2.5rem"
                    fw={700}
                >
                    Events
                </Title>
                <Text size="lg" c="dimmed">
                    Discover upcoming music events and performances
                </Text>
            </Stack>
            {userType === 'promoter' && (
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
    );
}
