"use client";

import { Container, Title, Text, Grid, GridCol, Card, Box, Image, ActionIcon, Stack } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import { Track, Artist } from "@/utils/supabase/global.types";

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
              <Card 
                padding="0" 
                style={{ 
                  backgroundColor: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'transform 0.3s ease',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)';
                }}
              >
                <Box style={{ position: 'relative' }}>
                  <Image
                    src={`${storageBasePath}${track.id}`}
                    alt={track.title}
                    style={{ aspectRatio: '1', borderRadius: '8px' }}
                    fallbackSrc={fallbackImageUrl}
                  />
                  <Box
                    style={{
                      position: 'absolute',
                      inset: 0,
                      background: 'rgba(0, 0, 0, 0.3)',
                      backdropFilter: 'blur(2px)',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                    }}
                    className="play-overlay"
                  >
                    <ActionIcon
                      size="xl"
                      color="white"
                      variant="filled"
                      style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
                    >
                      <IconPlayerPlay size={24} style={{ color: 'black' }} />
                    </ActionIcon>
                  </Box>
                </Box>
                <Stack gap="xs" mt="sm">
                  <Text size="sm" fw={500} c="gray.0" style={{ textAlign: 'center' }}>
                    {track.title}
                  </Text>
                  <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
                    {track.artists.map(artist => artist.name).join(', ') || 'Unknown Artist'} • {track.plays} plays
                  </Text>
                </Stack>
              </Card>
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
