"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Play } from "lucide-react";
import Image from "next/legacy/image";

interface FeaturedTrackProps {
  title: string;
  artist: string;
  coverArt: string;
  onPlay: () => void;
}

export function FeaturedTrack({
  title,
  artist,
  coverArt,
  onPlay,
}: FeaturedTrackProps) {
  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Featured Track of the Day</CardTitle>
        <CardDescription>Listen to our top pick</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="relative aspect-square mb-4">
          <Image
            src={coverArt}
            alt={`Cover art for ${title} by ${artist}`}
            fill
            className="rounded-md object-cover"
          />
        </div>
        <h3 className="text-xl font-semibold">{title}</h3>
        <p className="text-sm text-gray-500">{artist}</p>
      </CardContent>
      <CardFooter>
        <Button onClick={onPlay} className="w-full">
          <Play className="mr-2 h-4 w-4" /> Play Now
        </Button>
      </CardFooter>
    </Card>
  );
}
