"use client";

import {
  Card,
  Grid,
  GridCol,
  Group,
  Text,
  Title,
  ThemeIcon,
  Stack,
  SimpleGrid,
} from "@mantine/core";
import {
  IconCalendarEvent,
  IconUsers,
  IconHistory,
  IconTrendingUp,
} from "@tabler/icons-react";

interface VenueStatsSectionProps {
  venueId: string;
  upcomingEventsCount: number;
  pastEventsCount: number;
  promotersCount: number;
}

export function VenueStatsSection({
  venueId,
  upcomingEventsCount,
  pastEventsCount,
  promotersCount,
}: VenueStatsSectionProps) {
  const stats = [
    {
      title: "Upcoming Events",
      value: upcomingEventsCount,
      icon: IconCalendarEvent,
      color: "blue",
    },
    {
      title: "Past Events",
      value: pastEventsCount,
      icon: IconHistory,
      color: "gray",
    },
    {
      title: "Promoters",
      value: promotersCount,
      icon: IconUsers,
      color: "green",
    },
    {
      title: "Total Events",
      value: upcomingEventsCount + pastEventsCount,
      icon: IconTrendingUp,
      color: "purple",
    },
  ];

  return (
    <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="md">
      {stats.map((stat) => (
        <Card key={stat.title} p="md" withBorder>
          <Group justify="space-between">
            <div>
              <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
                {stat.title}
              </Text>
              <Text fw={700} size="xl">
                {stat.value}
              </Text>
            </div>
            <ThemeIcon
              color={stat.color}
              variant="light"
              size={38}
              radius="md"
            >
              <stat.icon size={20} />
            </ThemeIcon>
          </Group>
        </Card>
      ))}
    </SimpleGrid>
  );
}
