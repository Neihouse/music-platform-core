"use client";

import { Card, Title, Stack, SimpleGrid, Skeleton, Alert } from '@mantine/core';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";
import { TrackCard } from "@/components/track/TrackCard";

interface FavoriteTracksProps {
  userId: string;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  upvotes: number;
}

interface DatabaseTrack {
  id: string;
  title: string;
  artist: {
    username: string;
  };
  cover_art_url: string;
  votes: number;
}

export function FavoriteTracks({ userId }: FavoriteTracksProps) {
  const [favoriteTracks, setFavoriteTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchFavoriteTracks();
  }, [userId]);

  const fetchFavoriteTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("favorites")
        .select(
          "track_id, tracks(id, title, artist:users(username), cover_art_url, votes)"
        )
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) throw error;

      const tracks = data as unknown as { tracks: DatabaseTrack }[];
      setFavoriteTracks(
        tracks.map(item => ({
          id: item.tracks.id,
          title: item.tracks.title,
          artist: item.tracks.artist.username,
          coverArt: item.tracks.cover_art_url,
          upvotes: item.tracks.votes,
        }))
      );
    } catch (err) {
      setError("Failed to fetch favorite tracks");
      console.error("Error fetching favorite tracks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handlePlay = (trackId: string) => {
    console.log(`Playing track ${trackId}`);
  };

  const handleUpvote = (trackId: string) => {
    console.log(`Upvoting track ${trackId}`);
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
        <SimpleGrid cols={{ base: 1, md: 2, lg: 3 }} spacing="lg">
          {favoriteTracks.map((track) => (
            <TrackCard
              key={track.id}
              id={track.id}
              title={track.title}
              artist={track.artist}
              coverArt={track.coverArt}
              upvotes={track.upvotes}
              onPlay={() => handlePlay(track.id)}
              onUpvote={() => handleUpvote(track.id)}
            />
          ))}
        </SimpleGrid>
      </Stack>
    </Card>
  );
}
