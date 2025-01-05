"use client";

import { TrackCard } from "@/components/track/track-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

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

      setFavoriteTracks(
        data.map((item: any) => ({
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
    // Implement play functionality
    console.log(`Playing track ${trackId}`);
  };

  const handleUpvote = (trackId: string) => {
    // Implement upvote functionality
    console.log(`Upvoting track ${trackId}`);
  };

  if (isLoading) return <div>Loading favorite tracks...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Favorite Tracks</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
        </div>
      </CardContent>
    </Card>
  );
}
