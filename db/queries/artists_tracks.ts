"use server";

import { TypedClient } from "@/utils/supabase/global.types";

export async function createArtistTrack(
  supabase: TypedClient,
  artistId: string,
  trackId: string,
) {
  const { data, error } = await supabase
    .from("artists_tracks")
    .insert({
      artist: artistId,
      track: trackId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
