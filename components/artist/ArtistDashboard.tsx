"use client";

import { TrackList } from "@/components/track/TrackList";
import { 
  Card, 
  Button, 
  Group, 
  Text, 
  Stack, 
  SimpleGrid, 
  Title, 
  Skeleton,
  ThemeIcon,
  Paper,
  Container,
  rem
} from '@mantine/core';
import { 
  IconUpload,
  IconChartBar,
  IconHeart,
  IconUsers
} from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { notifications } from '@mantine/notifications';
import Link from 'next/link';

// Mock data for development
const MOCK_DATA = {
  stats: {
    totalPlays: 12567,
    totalUpvotes: 843,
    followers: 256
  },
  tracks: [
    {
      id: 1,
      title: "Summer Beats",
      artist: "You",
      plays: 5234,
      likes: 423,
      genre: "Electronic",
      duration: "3:45"
    },
    {
      id: 2,
      title: "Midnight Groove",
      artist: "You",
      plays: 3456,
      likes: 234,
      genre: "House",
      duration: "4:12"
    },
    {
      id: 3,
      title: "Urban Flow",
      artist: "You",
      plays: 2789,
      likes: 186,
      genre: "Hip Hop",
      duration: "3:58"
    }
  ]
};

interface ArtistStats {
  totalPlays: number;
  totalUpvotes: number;
  followers: number;
}

interface Track {
  id: number;
  title: string;
  artist: string;
  plays?: number;
  likes?: number;
  genre?: string;
  duration?: string;
}

interface StatCardProps {
  title: string;
  value: number;
  icon: typeof IconChartBar;
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

export function ArtistDashboard() {
  const [stats, setStats] = useState<ArtistStats | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchArtistData();
  }, []);

  const fetchArtistData = async () => {
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
      setTracks(MOCK_DATA.tracks);
    } catch (err) {
      console.error('Error fetching artist data:', err);
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
      <Container size="lg">
        <Stack gap="lg">
          <SimpleGrid cols={{ base: 1, sm: 3 }}>
            <Skeleton height={90} radius="md" />
            <Skeleton height={90} radius="md" />
            <Skeleton height={90} radius="md" />
          </SimpleGrid>
          <Skeleton height={50} radius="md" />
          <Skeleton height={400} radius="md" />
        </Stack>
      </Container>
    );
  }

  const handlePlay = (id: number) => {
    notifications.show({
      title: 'Playing',
      message: 'Track started playing',
      color: 'blue'
    });
  };

  const handleLike = (id: number) => {
    notifications.show({
      title: 'Success',
      message: 'Track like status updated',
      color: 'green'
    });
  };

  return (
    <Container size="lg">
      <Stack gap="xl">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <StatCard 
            title="Total Plays" 
            value={stats?.totalPlays || 0}
            icon={IconChartBar}
            color="blue"
          />
          <StatCard 
            title="Total Likes" 
            value={stats?.totalUpvotes || 0}
            icon={IconHeart}
            color="red"
          />
          <StatCard 
            title="Followers" 
            value={stats?.followers || 0}
            icon={IconUsers}
            color="green"
          />
        </SimpleGrid>

        <Paper shadow="sm" p="lg" radius="md" withBorder>
          <Stack gap="lg">
            <Group justify="space-between" align="center">
              <Title order={2}>Your Tracks</Title>
              <Button
                component={Link}
                href="/upload"
                leftSection={<IconUpload size={16} />}
                variant="light"
              >
                Upload New Track
              </Button>
            </Group>

            {tracks.length > 0 ? (
              <TrackList 
                tracks={tracks} 
                onPlay={handlePlay}
                onLike={handleLike}
              />
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                You haven&apos;t uploaded any tracks yet
              </Text>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
