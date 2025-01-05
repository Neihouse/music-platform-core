"use client";

import { TrackList } from "@/components/track/track-list";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
}

interface Track {
  id: string;
  title: string;
  artist: string;
  votes: number;
}

export function FanProfile({ userId }: FanProfileProps) {
  const [fanDetails, setFanDetails] = useState<FanDetails | null>(null);
  const [upvotedTracks, setUpvotedTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchFanDetails();
    fetchUpvotedTracks();
  }, [userId]);

  const fetchFanDetails = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select("username, avatar_url, total_votes, total_comments")
        .eq("id", userId)
        .single();

      if (error) throw error;

      setFanDetails(data);
    } catch (err) {
      setError("Failed to fetch fan details");
      console.error("Error fetching fan details:", err);
    }
  };

  const fetchUpvotedTracks = async () => {
    try {
      const { data, error } = await supabase
        .from("votes")
        .select("track_id, tracks(id, title, artist:users(username), votes)")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(10);

      if (error) throw error;

      setUpvotedTracks(
        data.map((item: any) => ({
          id: item.tracks.id,
          title: item.tracks.title,
          artist: item.tracks.artist.username,
          votes: item.tracks.votes,
        }))
      );
    } catch (err) {
      setError("Failed to fetch upvoted tracks");
      console.error("Error fetching upvoted tracks:", err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) return <div>Loading fan profile...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!fanDetails) return <div>Fan not found</div>;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Fan Profile</CardTitle>
        </CardHeader>
        <CardContent className="flex items-center space-x-4">
          <Avatar className="h-20 w-20">
            <AvatarImage
              src={fanDetails.avatar_url || undefined}
              alt={fanDetails.username}
            />
            <AvatarFallback>
              {fanDetails.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">{fanDetails.username}</h2>
            <p>Total Votes: {fanDetails.total_votes}</p>
            <p>Total Comments: {fanDetails.total_comments}</p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Recently Upvoted Tracks</CardTitle>
        </CardHeader>
        <CardContent>
          <TrackList tracks={upvotedTracks} onVote={() => {}} />
        </CardContent>
      </Card>
    </div>
  );
}
