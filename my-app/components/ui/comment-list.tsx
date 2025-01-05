"use client";

import { Card, CardContent } from "@/components/ui/card";
import { VoteButton } from "@/components/VoteButton";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

interface Comment {
  id: string;
  user_id: string;
  content: string;
  created_at: string;
  user: {
    username: string;
  };
  votes: number;
}

interface CommentListProps {
  trackId: string;
}

export function CommentList({ trackId }: CommentListProps) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const supabase = createClientComponentClient();

  useEffect(() => {
    fetchComments();
  }, [trackId]);

  const fetchComments = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from("comments")
      .select(
        `
        id,
        user_id,
        content,
        created_at,
        user:users(username),
        votes:comment_votes(count)
      `
      )
      .eq("track_id", trackId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching comments:", error);
    } else {
      setComments(data);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-4">
      {comments.map((comment) => (
        <Card key={comment.id}>
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="font-semibold">{comment.user.username}</p>
                <p className="text-sm text-gray-500">
                  {new Date(comment.created_at).toLocaleString()}
                </p>
                <p className="mt-2">{comment.content}</p>
              </div>
              <VoteButton
                trackId={comment.id}
                initialVotes={comment.votes}
                userHasVoted={false} // This should be determined based on the current user
              />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
