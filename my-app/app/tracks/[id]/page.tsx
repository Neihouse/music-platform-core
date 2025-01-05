"use client";

import { TrackCard } from "@/components/track/TrackCard";
import { CommentInput } from "@/components/ui/comment-input";
import { CommentList } from "@/components/ui/comment-list";
import { VoteButton } from "@/components/VoteButton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface TrackDetailProps {
  params: {
    id: string;
  };
}

export default function TrackDetail({ params }: TrackDetailProps) {
  const [track, setTrack] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchTrackDetails();
  }, [params.id]);

  const fetchTrackDetails = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("tracks")
      .select(
        `
        *,
        artist:users(username),
        votes:track_votes(count)
      `
      )
      .eq("id", params.id)
      .single();

    if (error) {
      console.error("Error fetching track details:", error);
    } else {
      setTrack(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading track details...</div>;
  }

  if (!track) {
    return <div>Track not found</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <TrackCard
        id={track.id}
        title={track.title}
        artist={track.artist.username}
        coverArt={track.cover_art_url || "/placeholder.svg"}
        upvotes={track.votes}
        onPlay={() => {
          /* Implement play functionality */
        }}
        onUpvote={() => {
          /* Use VoteButton instead */
        }}
      />
      <div className="mt-4">
        <VoteButton
          trackId={track.id}
          initialVotes={track.votes}
          userHasVoted={false} // This should be determined based on the current user
        />
      </div>
      <div className="mt-8">
        <h2 className="text-2xl font-bold mb-4">Comments</h2>
        <CommentInput trackId={track.id} onCommentAdded={fetchTrackDetails} />
        <div className="mt-4">
          <CommentList trackId={track.id} />
        </div>
      </div>
    </div>
  );
}
