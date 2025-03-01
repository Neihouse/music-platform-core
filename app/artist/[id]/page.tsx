"use client";

import { TrackAnalytics } from "@/components/track/TrackAnalytics";
import { TrackList } from "@/components/track/TrackList";
import { Container } from '@mantine/core'

interface ArtistProfileProps {
  params: {
    id: string;
  };
}

export default function ArtistProfile({ params }: ArtistProfileProps) {
  return (
    <Container size="lg" py="xl">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <h1 className="text-3xl font-bold mb-6">Artist Profile</h1>
          <TrackList
            tracks={[]} // Fetch artist tracks
            onVote={(id) => console.log(`Voted for track ${id}`)}
          />
        </div>
        <div>
          <TrackAnalytics artistId={params.id} />
        </div>
      </div>
    </Container>
  );
}
