"use client";

import { TrackList } from "@/components/track/TrackList";

export default function DiscoverPage() {
  const tracks = [
    { id: "1", title: "New Release", artist: "Artist Name", votes: 10 },
    { id: "2", title: "Popular Track", artist: "Another Artist", votes: 20 },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Discover New Music</h1>
      <div className="grid grid-cols-1 gap-6">
        <TrackList
          tracks={tracks}
          onVote={(id) => console.log(`Voted for track ${id}`)}
        />
      </div>
    </div>
  );
}
