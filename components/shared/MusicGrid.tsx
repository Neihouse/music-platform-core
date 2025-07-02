"use client";

import { Container, Title, Text, Grid, GridCol } from "@mantine/core";
import { Track, Artist } from "@/utils/supabase/global.types";
import { MusicCard } from "./MusicCard";

export interface MusicTrack {
  id: string;
  title: string;
  plays: number;
  artists: Pick<Artist, 'id' | 'name'>[];
}

export interface MusicGridProps {
  tracks: MusicTrack[];
  title?: string;
  maxItems?: number;
  storageBasePath?: string;
  fallbackImageUrl?: string;
}

const MusicGrid = ({ 
  tracks, 
  title = "Featured Music",
  maxItems = 8,
  storageBasePath = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/tracks/`,
  fallbackImageUrl = "https://lh3.googleusercontent.com/aida-public/AB6AXuBBoDbgVIb0dASOoNd5TjwPTv6yAwUxedBG8JryBF7kdaDp5r_dVgtgHcqS1nzKqUiN5R7HywNojZt_hkqrGdsv7GyAAMRelXiH7hto2423z2fblbw_RethajEcDN2D_YDp9MyDJJ6rlC7JdRb4AjJuIwVyrA7Gij4FVUCd_dLVmojz0f1sl6r0yKoQv-8Q_EqP1oBk7ICCm2AZxbWRGhlQGWhDNbeGhpD9_Rm9rkgI3N4yAaoXibCZnT5uvz6MSflk9bTYAEuiiTE"
}: MusicGridProps) => {
  return (
    <Container size="md">
      <Title order={2} mb="md" c="gray.0">{title}</Title>
      {tracks.length > 0 ? (
        <Grid gutter="lg">
          {tracks.slice(0, maxItems).map((track) => (
            <GridCol key={track.id} span={{ base: 6, sm: 4, md: 3 }}>
              <MusicCard
                id={track.id}
                title={track.title}
                artist={track.artists.map(artist => artist.name).join(', ') || 'Unknown Artist'}
                coverUrl={`${storageBasePath}${track.id}`} // Full track image URL
                plays={track.plays}
                size="grid"
                onClick={() => console.log('Track clicked:', track.title)}
                onPlay={() => console.log('Track played:', track.title)}
              />
            </GridCol>
          ))}
        </Grid>
      ) : (
        <Text c="dimmed" ta="center" py="xl">
          No tracks available yet.
        </Text>
      )}
    </Container>
  );
};

export default MusicGrid;
