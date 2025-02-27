"use client";

import { TrackList } from "@/components/track/TrackList";
import { 
  Title, 
  Text, 
  Stack, 
  SimpleGrid, 
  Group,
  Skeleton,
  Center,
  Container,
  Paper,
  ThemeIcon,
  rem
} from '@mantine/core';
import { 
  IconHeart, 
  IconMessageCircle2,
  IconChartBar
} from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { notifications } from '@mantine/notifications';

// Mock data for development
const MOCK_DATA = {
  stats: {
    totalVotes: 127,
    totalComments: 45,
    totalPlays: 892
  },
  likedTracks: [
    {
      id: 1,
      title: "Summer Vibes",
      artist: "DJ Cool",
      plays: 1234,
      likes: 89,
      genre: "Electronic",
      duration: "3:45"
    },
    {
      id: 2,
      title: "Night Drive",
      artist: "The Cruisers",
      plays: 856,
      likes: 67,
      genre: "Rock",
      duration: "4:20"
    },
    {
      id: 3,
      title: "Mountain High",
      artist: "Nature Sounds",
      plays: 2341,
      likes: 156,
      genre: "Ambient",
      duration: "5:10"
    }
  ],
  recommendedTracks: [
    {
      id: 4,
      title: "Urban Dreams",
      artist: "City Beats",
      plays: 3456,
      likes: 234,
      genre: "Hip Hop",
      duration: "3:55"
    },
    {
      id: 5,
      title: "Ocean Waves",
      artist: "Chill Masters",
      plays: 2789,
      likes: 189,
      genre: "Lo-fi",
      duration: "4:15"
    },
    {
      id: 6,
      title: "Desert Wind",
      artist: "World Sounds",
      plays: 1567,
      likes: 98,
      genre: "World",
      duration: "6:30"
    }
  ]
};

interface Track {
  id: number;
  title: string;
  artist: string;
  plays?: number;
  likes?: number;
  genre?: string;
  duration?: string;
}

interface FanStats {
  totalVotes: number;
  totalComments: number;
  totalPlays: number;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: typeof IconHeart;
  color: string;
}

function StatCard({ title, value, icon: Icon, color }: StatCardProps) {
  return (
    <Paper shadow="sm" p="md" radius="md" withBorder>
      <Group>
        <ThemeIcon 
          size="lg" 
          radius="md" 
          variant="light" 
          color={color}
        >
          <Icon style={{ width: rem(18), height: rem(18) }} />
        </ThemeIcon>
        <div>
          <Text size="xs" c="dimmed" tt="uppercase" fw={700}>
            {title}
          </Text>
          <Text fw={700} size="xl">
            {value.toLocaleString()}
          </Text>
        </div>
      </Group>
    </Paper>
  );
}

export function FanDashboard() {
  const [stats, setStats] = useState<FanStats | null>(null);
  const [recentlyLiked, setRecentlyLiked] = useState<Track[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchFanData();
  }, []);

  const fetchFanData = async () => {
    try {
      const user = getUser();
      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to view your dashboard',
          color: 'red'
        });
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setStats(MOCK_DATA.stats);
      setRecentlyLiked(MOCK_DATA.likedTracks);
      setRecommendations(MOCK_DATA.recommendedTracks);
    } catch (err) {
      console.error('Error fetching fan data:', err);
      notifications.show({
        title: 'Error',
        message: 'Failed to load dashboard data',
        color: 'red'
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <Stack gap="lg">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Skeleton height={90} radius="md" />
          <Skeleton height={90} radius="md" />
          <Skeleton height={90} radius="md" />
        </SimpleGrid>
        <Skeleton height={400} radius="md" />
        <Skeleton height={400} radius="md" />
      </Stack>
    );
  }

  const handleLike = (id: number) => {
    notifications.show({
      title: 'Success',
      message: 'Track like status updated',
      color: 'green'
    });
  };

  const handlePlay = (id: number) => {
    notifications.show({
      title: 'Playing',
      message: 'Track started playing',
      color: 'blue'
    });
  };

  return (
    <Container size="lg">
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <StatCard 
            title="Total Likes" 
            value={stats?.totalVotes || 0}
            icon={IconHeart}
            color="red"
          />
          <StatCard 
            title="Total Comments" 
            value={stats?.totalComments || 0}
            icon={IconMessageCircle2}
            color="blue"
          />
          <StatCard 
            title="Total Plays" 
            value={stats?.totalPlays || 0}
            icon={IconChartBar}
            color="green"
          />
        </SimpleGrid>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>Recently Liked</Title>
            {recentlyLiked.length > 0 ? (
              <TrackList 
                tracks={recentlyLiked} 
                onPlay={handlePlay}
                onLike={handleLike}
              />
            ) : (
              <Center p="xl">
                <Text c="dimmed">No liked tracks yet</Text>
              </Center>
            )}
          </Stack>
        </Paper>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>Recommended for You</Title>
            {recommendations.length > 0 ? (
              <TrackList 
                tracks={recommendations} 
                onPlay={handlePlay}
                onLike={handleLike}
              />
            ) : (
              <Center p="xl">
                <Text c="dimmed">No recommendations available</Text>
              </Center>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
