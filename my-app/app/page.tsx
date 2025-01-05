// app/page.tsx
"use client";

import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { FeaturedTrack } from "@/components/track/FeatureTrack";
import { TrackList } from "@/components/track/TrackList";

export default function Home() {
  const featuredTrack = {
    title: "Summer Breeze",
    artist: "Chill Vibes",
    coverArt: "/placeholder.svg?height=400&width=400",
    onPlay: () => console.log("Playing featured track"),
  };

  const tracks = [
    { id: "1", title: "Midnight Dreams", artist: "Luna", votes: 42 },
    { id: "2", title: "Neon Lights", artist: "The Glow", votes: 38 },
    { id: "3", title: "Ocean Waves", artist: "Serene", votes: 35 },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
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
              onVote={(id) => console.log(`Voted for track ${id}`)}
            />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
