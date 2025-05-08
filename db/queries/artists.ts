"use server";
import { Track, TypedClient } from "@/utils/supabase/global.types";

export async function getArtist(supabase: TypedClient) {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  const { data: artist, error } = await supabase
    .from("artists")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return artist;
}

export async function getArtistByName(
  supabase: TypedClient,
  artistName: string
) {
  const { data: artist, error } = await supabase
    .from("artist_with_tracks")
    .select(`*`)
    .ilike("name", artistName)
    .single();

  if (error || !artist) {
    throw new Error(error.message);
  }

  return {
    ...artist,
    tracks:
      (artist?.tracks as Pick<Track, "id" | "title" | "duration">[]) || [],
  };
}
