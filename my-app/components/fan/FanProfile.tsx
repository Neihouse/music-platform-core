"use client";

import { TrackList } from "@/components/track/TrackList";
import { 
  Title, 
  Text, 
  Stack, 
  Group, 
  Avatar, 
  Paper, 
  Skeleton, 
  Alert,
  Container,
  Badge,
  ThemeIcon,
  rem
} from '@mantine/core';
import { 
  IconAlertCircle,
  IconHeart,
  IconMessageCircle2,
  IconHeadphones
} from '@tabler/icons-react';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface FanProfileProps {
  userId: string;
}

interface FanDetails {
  username: string;
  avatar_url: string | null;
  total_votes: number;
  total_comments: number;
  total_plays: number;
  joined_date: string;
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

interface StatBadgeProps {
  icon: typeof IconHeart;
  value: number;
  label: string;
  color: string;
}

function StatBadge({ icon: Icon, value, label, color }: StatBadgeProps) {
  return (
    <Badge 
      size="lg"
      variant="dot"
      color={color}
      leftSection={
        <ThemeIcon 
          color={color} 
          variant="light" 
          size="sm" 
          radius="xl"
        >
          <Icon style={{ width: rem(12), height: rem(12) }} />
        </ThemeIcon>
      }
    >
      {value.toLocaleString()} {label}
    </Badge>
  );
}

export function FanProfile({ userId }: FanProfileProps) {
  const [fanDetails, setFanDetails] = useState<FanDetails | null>(null);
  const [likedTracks, setLikedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchFanDetails();
    fetchLikedTracks();
  }, [userId]);

  const fetchFanDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, total_votes, total_comments, total_plays, created_at")
        .eq("id", userId)
        .single()

      if (error) throw error

      if (data) {
        setFanDetails({
          username: data.username,
          avatar_url: data.avatar_url,
          total_votes: data.total_votes,
          total_comments: data.total_comments,
          total_plays: data.total_plays,
          joined_date: new Date(data.created_at).toLocaleDateString()
        })
      }
    } catch (err) {
      setError("Failed to fetch fan details")
      console.error("Error fetching fan details:", err)
    }
  }

  const fetchLikedTracks = async () => {
    try {
      const { data, error } = await supabase
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
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10)

      if (error) throw error

      if (data) {
        const tracks = data.map((item) => {
          const track = item.tracks as unknown as DatabaseTrack
          return {
            id: parseInt(track.id),
            title: track.title,
            artist: track.artist[0]?.username || 'Unknown Artist',
            plays: track.plays,
            likes: track.likes,
            genre: track.genre,
            duration: track.duration
          }
        })

        setLikedTracks(tracks)
      }
    } catch (err) {
      setError("Failed to fetch liked tracks")
      console.error("Error fetching liked tracks:", err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLike = (id: number) => {
    console.log('Liked track:', id);
  };

  const handlePlay = (id: number) => {
    console.log('Playing track:', id);
  };

  if (isLoading) {
    return (
      <Container size="lg">
        <Stack gap="lg">
          <Skeleton height={200} radius="md" />
          <Skeleton height={400} radius="md" />
        </Stack>
      </Container>
    );
  }

  if (error) {
    return (
      <Container size="lg">
        <Alert 
          color="red" 
          title="Error" 
          variant="filled"
          icon={<IconAlertCircle size={rem(16)} />}
        >
          {error}
        </Alert>
      </Container>
    );
  }

  if (!fanDetails) {
    return (
      <Container size="lg">
        <Alert 
          color="yellow" 
          title="Not Found" 
          variant="filled"
          icon={<IconAlertCircle size={rem(16)} />}
        >
          Fan not found
        </Alert>
      </Container>
    );
  }

  return (
    <Container size="lg">
      <Stack gap="xl">
        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Group wrap="nowrap" align="flex-start">
              <Avatar
                src={fanDetails.avatar_url}
                alt={fanDetails.username}
                size={120}
                radius="md"
              >
                {fanDetails.username.charAt(0).toUpperCase()}
              </Avatar>
              
              <Stack gap="xs" style={{ flex: 1 }}>
                <Title order={2}>{fanDetails.username}</Title>
                <Text size="sm" c="dimmed">
                  Joined {fanDetails.joined_date}
                </Text>
                <Group gap="md" mt="xs">
                  <StatBadge 
                    icon={IconHeart}
                    value={fanDetails.total_votes}
                    label="likes"
                    color="red"
                  />
                  <StatBadge 
                    icon={IconMessageCircle2}
                    value={fanDetails.total_comments}
                    label="comments"
                    color="blue"
                  />
                  <StatBadge 
                    icon={IconHeadphones}
                    value={fanDetails.total_plays}
                    label="plays"
                    color="green"
                  />
                </Group>
              </Stack>
            </Group>
          </Stack>
        </Paper>

        <Paper shadow="sm" p="xl" radius="md" withBorder>
          <Stack gap="lg">
            <Title order={2}>Recently Liked Tracks</Title>
            {likedTracks.length > 0 ? (
              <TrackList 
                tracks={likedTracks} 
                onPlay={handlePlay}
                onLike={handleLike}
              />
            ) : (
              <Alert 
                color="gray" 
                variant="light"
                title="No tracks found"
              >
                This fan hasn&apos;t liked any tracks yet.
              </Alert>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
