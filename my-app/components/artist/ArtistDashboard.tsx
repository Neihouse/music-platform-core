"use client";

import { TrackList } from "@/components/track/TrackList";
import { Card, Button, Group, Text, Stack, SimpleGrid, Title, Skeleton } from '@mantine/core';
import { IconUpload } from '@tabler/icons-react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

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
}

function StatCard({ title, value }: StatCardProps) {
  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="xs">
        <Text size="lg" fw={500} c="dimmed">
          {title}
        </Text>
        <Text size="xl" fw={700}>
          {value.toLocaleString()}
        </Text>
      </Stack>
    </Card>
  );
}

export function ArtistDashboard() {
  const [stats, setStats] = useState<ArtistStats | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchArtistData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Fetch artist stats
        const { data: statsData, error: statsError } = await supabase
          .from("artist_stats")
          .select("total_plays, total_upvotes, followers")
          .eq("user_id", user.id)
          .single();

        if (statsError) {
          console.error("Error fetching artist stats:", statsError);
        } else {
          setStats({
            totalPlays: statsData.total_plays,
            totalUpvotes: statsData.total_upvotes,
            followers: statsData.followers,
          });
        }

        // Fetch artist tracks
        const { data: tracksData, error: tracksError } = await supabase
          .from("tracks")
          .select("id, title, artist, plays, likes")
          .eq("artist_id", user.id);

        if (tracksError) {
          console.error("Error fetching tracks:", tracksError);
        } else {
          setTracks(tracksData.map(track => ({
            ...track,
            id: parseInt(track.id)
          })));
        }
      }
      setIsLoading(false);
    }

    fetchArtistData();
  }, [supabase]);

  if (isLoading) {
    return (
      <Stack gap="lg">
        <SimpleGrid cols={{ base: 1, sm: 3 }}>
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
          <Skeleton height={120} radius="md" />
        </SimpleGrid>
        <Skeleton height={50} radius="md" />
        <Skeleton height={200} radius="md" />
      </Stack>
    );
  }

  const handlePlay = (id: number) => {
    console.log('Playing track:', id);
  };

  const handleLike = (id: number) => {
    console.log('Liked track:', id);
  };

  return (
    <Stack gap="xl">
      <SimpleGrid cols={{ base: 1, sm: 3 }}>
        <StatCard title="Total Plays" value={stats?.totalPlays || 0} />
        <StatCard title="Total Upvotes" value={stats?.totalUpvotes || 0} />
        <StatCard title="Followers" value={stats?.followers || 0} />
      </SimpleGrid>

      <Stack gap="md">
        <Group justify="space-between" align="center">
          <Title order={2}>Your Tracks</Title>
          <Button 
            leftSection={<IconUpload size={16} />}
            variant="light"
          >
            Upload New Track
          </Button>
        </Group>
        <TrackList 
          tracks={tracks} 
          onPlay={handlePlay}
          onLike={handleLike}
        />
      </Stack>
    </Stack>
  );
}
