"use client";

import { TrackList } from "@/components/track/track-list";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { Upload } from "lucide-react";
import { useEffect, useState } from "react";

interface ArtistStats {
  totalPlays: number;
  totalUpvotes: number;
  followers: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  votes: number;
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
          .select("id, title, artist, votes")
          .eq("artist_id", user.id);

        if (tracksError) {
          console.error("Error fetching tracks:", tracksError);
        } else {
          setTracks(tracksData);
        }
      }
      setIsLoading(false);
    }

    fetchArtistData();
  }, [supabase]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Plays</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalPlays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Upvotes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalUpvotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Followers</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.followers}</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Your Tracks</h2>
          <Button>
            <Upload className="mr-2 h-4 w-4" /> Upload New Track
          </Button>
        </div>
        <TrackList tracks={tracks} onVote={() => {}} />
      </div>
    </div>
  );
}
