"use client";

import { TrackList } from "@/components/track/track-list";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface FanStats {
  totalVotes: number;
  totalComments: number;
}

interface Track {
  id: string;
  title: string;
  artist: string;
  votes: number;
}

export function FanDashboard() {
  const [stats, setStats] = useState<FanStats | null>(null);
  const [recentlyVoted, setRecentlyVoted] = useState<Track[]>([]);
  const [recommendations, setRecommendations] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    async function fetchFanData() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        // Fetch fan stats
        const { data: statsData, error: statsError } = await supabase
          .from("fan_stats")
          .select("total_votes, total_comments")
          .eq("user_id", user.id)
          .single();

        if (statsError) {
          console.error("Error fetching fan stats:", statsError);
        } else {
          setStats({
            totalVotes: statsData.total_votes,
            totalComments: statsData.total_comments,
          });
        }

        // Fetch recently voted tracks
        const { data: votedData, error: votedError } = await supabase
          .from("votes")
          .select("track_id, tracks(id, title, artist, votes)")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(5);

        if (votedError) {
          console.error("Error fetching voted tracks:", votedError);
        } else {
          setRecentlyVoted(votedData.map((vote: any) => vote.tracks));
        }

        // Fetch recommended tracks (this would typically involve more complex logic)
        const { data: recommendedData, error: recommendedError } =
          await supabase
            .from("tracks")
            .select("id, title, artist, votes")
            .order("votes", { ascending: false })
            .limit(5);

        if (recommendedError) {
          console.error("Error fetching recommended tracks:", recommendedError);
        } else {
          setRecommendations(recommendedData);
        }
      }
      setIsLoading(false);
    }

    fetchFanData();
  }, [supabase]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalVotes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats?.totalComments}</p>
          </CardContent>
        </Card>
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Recently Voted</h2>
        <TrackList tracks={recentlyVoted} onVote={() => {}} />
      </div>
      <div>
        <h2 className="text-2xl font-bold mb-4">Recommended for You</h2>
        <TrackList tracks={recommendations} onVote={() => {}} />
      </div>
    </div>
  );
}
