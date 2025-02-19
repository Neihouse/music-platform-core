"use client";

import { Card, Title, Stack, SimpleGrid, Skeleton, Alert } from '@mantine/core';
import { useEffect, useState } from "react";
import { TrackCard } from "@/components/track/TrackCard";
import { notifications } from '@mantine/notifications';
import { getUser } from '@/utils/auth';

// Mock data for development
const MOCK_FAVORITE_TRACKS = [
  {
    title: "Summer Vibes",
    artist: "DJ Cool",
    coverArt: "https://picsum.photos/300/300?random=1",
    likes: 156,
    isLiked: true
  },
  {
    title: "Night Drive",
    artist: "The Cruisers",
    coverArt: "https://picsum.photos/300/300?random=2",
    likes: 89,
    isLiked: true
  },
  {
    title: "Mountain High",
    artist: "Nature Sounds",
    coverArt: "https://picsum.photos/300/300?random=3",
    likes: 234,
    isLiked: true
  },
  {
    title: "Urban Dreams",
    artist: "City Beats",
    coverArt: "https://picsum.photos/300/300?random=4",
    likes: 178,
    isLiked: true
  }
];

interface FavoriteTracksProps {
  userId: string;
}

interface Track {
  title: string;
  artist: string;
  coverArt: string;
  likes: number;
  isLiked: boolean;
}

export function FavoriteTracks({ userId }: FavoriteTracksProps) {
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchFavoriteTracks();
  }, [userId]);

  const fetchFavoriteTracks = async () => {
    try {
      const user = getUser();
      if (!user) {
        setError("Please log in to view your favorite tracks");
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      setFavoriteTracks(MOCK_FAVORITE_TRACKS);
    } catch (err) {
      setError("Failed to fetch favorite tracks");
      console.error("Error fetching favorite tracks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (track: Track) => {
    notifications.show({
      title: 'Playing',
      message: `Now playing ${track.title}`,
      color: 'blue'
    });
  };

  const handleLike = (track: Track) => {
    const updatedTracks = favoriteTracks.map(t => {
      if (t.title === track.title) {
        return { ...t, isLiked: !t.isLiked, likes: t.isLiked ? t.likes - 1 : t.likes + 1 };
      }
      return t;
    });
    setFavoriteTracks(updatedTracks);
    
    notifications.show({
      title: 'Success',
      message: track.isLiked ? 'Track removed from favorites' : 'Track added to favorites',
      color: 'green'
    });
  };

  if (isLoading) {
    return (
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="lg">
          <Skeleton height={30} width={200} radius="md" />
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            <Skeleton height={200} radius="md" />
            <Skeleton height={200} radius="md" />
            <Skeleton height={200} radius="md" />
          </SimpleGrid>
        </Stack>
      </Card>
    );
  }

  if (error) {
    return (
      <Alert color="red" title="Error" variant="filled">
        {error}
      </Alert>
    );
  }

  return (
    <Card shadow="sm" padding="lg" radius="md" withBorder>
      <Stack gap="lg">
        <Title order={2}>Favorite Tracks</Title>
        {favoriteTracks.length > 0 ? (
          <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
            {favoriteTracks.map((track) => (
              <TrackCard
                key={track.title}
                {...track}
                onPlay={() => handlePlay(track)}
                onLike={() => handleLike(track)}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Alert color="gray" variant="light">
            No favorite tracks yet
          </Alert>
        )}
      </Stack>
    </Card>
  );
}
