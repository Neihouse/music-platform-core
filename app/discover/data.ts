import { MusicTrack } from '@/components/shared';
import { getTracks } from '@/db/queries/tracks';
import { createClient } from '@/utils/supabase/server';

// Server-side data fetching function for RSC usage
export async function getFeaturedTracks(): Promise<MusicTrack[]> {
  const supabase = await createClient();

  try {
    const tracks = await getTracks(supabase);

    // Transform the tracks to match MusicTrack interface
    const musicTracks: MusicTrack[] = tracks.map(track => ({
      id: track.id,
      title: track.title,
      plays: track.plays,
      artists: track.artists
    }));

    return musicTracks;
  } catch (error) {
    console.error('Error fetching featured tracks:', error);
    return [];
  }
}
