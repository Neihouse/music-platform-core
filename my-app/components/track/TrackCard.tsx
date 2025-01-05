import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Play, ThumbsUp } from "lucide-react";
import Image from "next/image";

interface TrackCardProps {
  id: string;
  title: string;
  artist: string;
  coverArt: string;
  upvotes: number;
  onPlay: () => void;
  onUpvote: () => void;
}

export function TrackCard({
  id,
  title,
  artist,
  coverArt,
  upvotes,
  onPlay,
  onUpvote,
}: TrackCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardContent className="p-4">
        <div className="relative aspect-square mb-4">
          <Image
            src={coverArt}
            alt={`Cover art for ${title}`}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <h3 className="text-lg font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{artist}</p>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" size="sm" onClick={onPlay}>
          <Play className="h-4 w-4 mr-2" />
          Play
        </Button>
        <Button variant="ghost" size="sm" onClick={onUpvote}>
          <ThumbsUp className="h-4 w-4 mr-2" />
          {upvotes}
        </Button>
      </CardFooter>
    </Card>
  );
}
