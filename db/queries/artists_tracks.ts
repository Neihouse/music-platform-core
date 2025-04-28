"use server";

import { createClient } from "@/utils/supabase/server";

export async function createArtistTrack(artistId: string, trackId: string) {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("artists_tracks")
    .insert({
      artist_id: artistId,
      track_id: trackId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
