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
import { useEffect, useState } from "react";
import { getUser } from "@/utils/auth";
import { notifications } from '@mantine/notifications';

// Mock data for development
const MOCK_DATA = {
  fanDetails: {
    username: "MusicLover123",
    avatar_url: "https://picsum.photos/200/200?random=1",
    total_votes: 342,
    total_comments: 156,
    total_plays: 2789,
    joined_date: "Jan 15, 2024"
  },
  likedTracks: [
    {
      id: 1,
      title: "Summer Vibes",
      artist: "DJ Cool",
      plays: 5234,
      likes: 423,
      genre: "Electronic",
      duration: "3:45"
    },
    {
      id: 2,
      title: "Night Drive",
      artist: "The Cruisers",
      plays: 3456,
      likes: 234,
      genre: "Rock",
      duration: "4:12"
    },
    {
      id: 3,
      title: "Mountain High",
      artist: "Nature Sounds",
      plays: 2789,
      likes: 186,
      genre: "Ambient",
      duration: "5:10"
    }
  ]
};

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

  useEffect(() => {
    fetchFanData();
  }, [userId]);

  const fetchFanData = async () => {
    try {
      const user = getUser();
      if (!user) {
        setError("Please log in to view fan profiles");
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFanDetails(MOCK_DATA.fanDetails);
      setLikedTracks(MOCK_DATA.likedTracks);
    } catch (err) {
      setError("Failed to fetch fan data");
      console.error("Error fetching fan data:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLike = (id: number) => {
    const updatedTracks = likedTracks.map(track => {
      if (track.id === id) {
        return {
          ...track,
          likes: (track.likes || 0) + 1
        };
      }
      return track;
    });
    setLikedTracks(updatedTracks);
    
    notifications.show({
      title: 'Success',
      message: 'Track liked successfully',
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
            <Title order={3}>Recently Liked Tracks</Title>
            {likedTracks.length > 0 ? (
              <TrackList 
                tracks={likedTracks}
                onPlay={handlePlay}
                onLike={handleLike}
              />
            ) : (
              <Text c="dimmed" ta="center" py="xl">
                No liked tracks yet
              </Text>
            )}
          </Stack>
        </Paper>
      </Stack>
    </Container>
  );
}
