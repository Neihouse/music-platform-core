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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface FanStats {
  totalVotes: number;
  totalComments: number;
  totalPlays: number;
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

interface DatabaseTrack {
  id: string;
  title: string;
  artist: { username: string }[];
  plays: number;
  likes: number;
  genre: string;
  duration: string;
}

interface LikedTrackData {
  track_id: string;
  tracks: DatabaseTrack;
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
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchFanData();
  }, []);

  const fetchFanData = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      // Fetch fan stats
      const { data: statsData, error: statsError } = await supabase
        .from("fan_stats")
        .select("total_votes, total_comments, total_plays")
        .eq("user_id", user.id)
        .single();

      if (statsError) throw statsError;

      setStats({
        totalVotes: statsData.total_votes,
        totalComments: statsData.total_comments,
        totalPlays: statsData.total_plays
      });

      // Fetch recently liked tracks
      const { data: likedData, error: likedError } = await supabase
        .from("likes")
        .select(`
          track_id,
          tracks (
            id,
            title,
            artist:users(username),
            plays,
            likes,
            genre,
            duration
          )
        `)
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(5);

      if (likedError) throw likedError;

      const transformedLikedTracks = (likedData as LikedTrackData[]).map(item => ({
        id: parseInt(item.tracks.id),
        title: item.tracks.title,
        artist: item.tracks.artist[0]?.username || 'Unknown Artist',
        plays: item.tracks.plays,
        likes: item.tracks.likes,
        genre: item.tracks.genre,
        duration: item.tracks.duration
      }));

      setRecentlyLiked(transformedLikedTracks);

      // Fetch recommended tracks
      const { data: recommendedData, error: recommendedError } = await supabase
        .from("tracks")
        .select(`
          id,
          title,
          artist:users(username),
          plays,
          likes,
          genre,
          duration
        `)
        .order("plays", { ascending: false })
        .limit(5);

      if (recommendedError) throw recommendedError;

      const transformedRecommendations = (recommendedData as DatabaseTrack[]).map(track => ({
        id: parseInt(track.id),
        title: track.title,
        artist: track.artist[0]?.username || 'Unknown Artist',
        plays: track.plays,
        likes: track.likes,
        genre: track.genre,
        duration: track.duration
      }));

      setRecommendations(transformedRecommendations);
    } catch (err) {
      console.error('Error fetching fan data:', err);
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
    console.log('Liked track:', id);
  };

  const handlePlay = (id: number) => {
    console.log('Playing track:', id);
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
