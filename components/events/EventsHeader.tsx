"use client";

import { Text, Title } from "@mantine/core";

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
}

export default function EventsHeader({ events }: EventsHeaderProps) {
    return (
        <div>
            <Title
                order={1}
                size="2.5rem"
                fw={700}
                mb="xs"
            >
                Events
            </Title>
            <Text size="lg" c="dimmed">
                Discover upcoming music events and performances
            </Text>
        </div>
    );
}
