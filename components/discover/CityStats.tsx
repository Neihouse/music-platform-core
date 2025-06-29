'use client';

import { Box, Group, Text, ThemeIcon, Stack, SimpleGrid, useMantineColorScheme } from "@mantine/core";
import { IconUsers, IconBuilding, IconCalendarEvent, IconMicrophone, IconTrendingUp, IconStar } from "@tabler/icons-react";
import { CityData } from "@/app/discover/actions";

interface CityStatsProps {
  cityData: CityData;
  cityName: string;
}

interface StatItemProps {
  icon: React.ReactNode;
  value: number;
  label: string;
  color: string;
  suffix?: string;
}

function StatItem({ icon, value, label, color, suffix = "" }: StatItemProps) {
  return (
    <Box
      p="md"
      style={{
        borderRadius: 'var(--mantine-radius-md)',
        background: 'var(--mantine-color-gray-0)',
        border: '1px solid var(--mantine-color-gray-2)',
        transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      }}
      className="hover:-translate-y-0.5 hover:shadow-md"
    >
      <Group gap="sm">
        <ThemeIcon size="lg" radius="md" variant="light" color={color}>
          {icon}
        </ThemeIcon>
        <Stack gap={2}>
          <Text size="xl" fw={700} c={color}>
            {value.toLocaleString()}{suffix}
          </Text>
          <Text size="sm" c="dimmed">
            {label}
          </Text>
        </Stack>
      </Group>
    </Box>
  );
}

export function CityStats({ cityData, cityName }: CityStatsProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  // Calculate total upcoming events
  const totalUpcomingEvents = cityData.events.length;
  
  // Calculate total venues with events
  const activeVenues = cityData.venues.filter(v => (v.upcomingEvents || 0) > 0).length;
  
  // Calculate total artists
  const totalArtists = cityData.artists.length;
  
  // Calculate active promoters
  const activePromoters = cityData.promoters.length;

  // Calculate total venue capacity
  const totalCapacity = cityData.venues.reduce((sum, venue) => sum + (venue.capacity || 0), 0);

  // Average events per promoter
  const avgEventsPerPromoter = activePromoters > 0 
    ? Math.round(cityData.promoters.reduce((sum, p) => sum + (p.eventsOrganized || 0), 0) / activePromoters)
    : 0;

  const stats = [
    {
      icon: <IconCalendarEvent size={20} />,
      value: totalUpcomingEvents,
      label: "Upcoming Events",
      color: "pink"
    },
    {
      icon: <IconMicrophone size={20} />,
      value: totalArtists,
      label: "Local Artists",
      color: "violet"
    },
    {
      icon: <IconBuilding size={20} />,
      value: activeVenues,
      label: "Active Venues",
      color: "green"
    },
    {
      icon: <IconUsers size={20} />,
      value: activePromoters,
      label: "Promoters & Collectives",
      color: "orange"
    },
    {
      icon: <IconStar size={20} />,
      value: totalCapacity,
      label: "Total Venue Capacity",
      color: "blue"
    },
    {
      icon: <IconTrendingUp size={20} />,
      value: avgEventsPerPromoter,
      label: "Avg Events/Promoter",
      color: "cyan"
    }
  ];

  return (
    <Box
      p="xl"
      mb="xl"
      style={{
        background: isDark
          ? 'var(--mantine-color-dark-6)'
          : 'var(--mantine-color-gray-0)',
        borderRadius: 'var(--mantine-radius-lg)',
        border: isDark 
          ? '1px solid var(--mantine-color-dark-4)'
          : '1px solid var(--mantine-color-gray-2)',
      }}
    >
      <Group justify="center" mb="lg">
        <Text size="lg" fw={600} ta="center">
          📊 {cityName}'s Music Scene at a Glance
        </Text>
      </Group>
      
      <SimpleGrid cols={{ base: 2, sm: 3, lg: 6 }} spacing="md">
        {stats.map((stat, index) => (
          <StatItem
            key={index}
            icon={stat.icon}
            value={stat.value}
            label={stat.label}
            color={stat.color}
          />
        ))}
      </SimpleGrid>
    </Box>
  );
}
