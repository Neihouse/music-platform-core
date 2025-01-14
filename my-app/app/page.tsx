"use client";

import { FeaturedTrack } from "@/components/track/FeatureTrack";
import { TrackList } from "@/components/track/TrackList";

export default function Home() {
  const featuredTrack = {
    title: "Summer Breeze",
    artist: "Chill Vibes",
    coverArt: "/placeholder.svg",
    onPlay: () => alert("Playing featured track!"), // Example: Replace with actual functionality
  };

  const tracks = [
    { id: "1", title: "Midnight Dreams", artist: "Luna", votes: 42 },
    { id: "2", title: "Neon Lights", artist: "The Glow", votes: 38 },
    { id: "3", title: "Ocean Waves", artist: "Serene", votes: 35 },
  ];

  return (
    <main className="flex-grow container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Featured Track</h2>
          <FeaturedTrack {...featuredTrack} />
        </div>
        <div>
          <h2 className="text-2xl font-bold mb-4">Top Tracks</h2>
          <TrackList
            tracks={tracks}
            onVote={(id) => alert(`Voted for track ${id}`)} // Example: Replace with actual functionality
          />
        </div>
      </div>
    </main>
  );
}
