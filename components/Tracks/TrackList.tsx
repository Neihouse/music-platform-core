"use client";

import { Track } from "@/components/Tracks/Track";
import { Artist, Track as TrackType } from "@/utils/supabase/global.types";
import { Stack, Center, Text } from "@mantine/core";
import { useState } from "react";

interface TrackListProps {
  tracks: (TrackType & { plays: number })[];
  artist: Artist;
  canDelete: boolean;
}

export function TrackList({ tracks: initialTracks, artist, canDelete }: TrackListProps) {
  const [tracks, setTracks] = useState(initialTracks);

  const handleTrackDeleted = (deletedTrackId: string) => {
    setTracks(tracks.filter(track => track.id !== deletedTrackId));
  };

  if (!tracks.length) {
    return (
      <Center mt={50}>
        <Text c="dimmed" size="sm">
          <em>No tracks yet</em>
        </Text>
      </Center>
    );
  }

  return (
    <Stack gap="md">
      {tracks.map((trackData) => (
        <Track
          key={trackData.id}
          track={{
            id: trackData.id,
            title: trackData.title,
            duration: trackData.duration,
            album_id: trackData.album_id,
            bitrate: trackData.bitrate,
            channels: trackData.channels,
            codec: trackData.codec,
            container: trackData.container,
            created_at: trackData.created_at,
            featured: trackData.featured,
            sample_rate: trackData.sample_rate,
            size: trackData.size,
          }}
          variant="list"
          artists={[artist]}
          showPlayCount={true}
          playCount={trackData.plays}
          canDelete={canDelete}
          onDelete={() => handleTrackDeleted(trackData.id)}
        />
      ))}
    </Stack>
  );
}
