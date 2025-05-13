"use server";
import { Artist, Track, TypedClient } from "@/utils/supabase/global.types";
import { Database } from "@/utils/supabase/database.types";

export async function createArtist(
  supabase: TypedClient,
  {
    name,
    bio,
    locality_id,
    administrative_area_id,
    user_id,
    country_id,
  }: Database["public"]["Tables"]["artists"]["Insert"],
) {
  const { data: artist, error } = await supabase
    .from("artists")
    .insert({
      name,
      bio,
      administrative_area_id,
      locality_id,
      country_id,
      user_id,
    })
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }

  return artist;
}

export type ArtistWithLocation = Artist & {
  locality?: string;
  administrative_area?: string | null;
  country?: string | null;
  formattedAddress?: string;
};

export async function getArtist(supabase: TypedClient) {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  const { data: artist, error } = await supabase
    .from("artists")
    .select("*, localities (name), administrative_areas(name), countries(name)")
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (!artist && !error) {
    return null;
  }

  if (error) {
    throw new Error(error?.message || "Artist not found");
  }

  const formattedAddress = !!artist?.localities?.name ? `${artist?.localities?.name}, ${artist?.administrative_areas?.name}, ${artist?.countries?.name}` : undefined
  return {
    ...artist,
    locality: artist?.localities?.name,
    administrative_area: artist?.administrative_areas?.name,
    country: artist?.countries?.name,
    formattedAddress: formattedAddress,
  } as ArtistWithLocation;
}

export async function getArtistByName(
  supabase: TypedClient,
  artistName: string,
) {
  const { data: artist, error } = await supabase
    .from("artist_view")
    .select(`*`)
    .ilike("name", artistName)
    .maybeSingle();

  if (!artist && !error) {
    return null;
  }

  if (error) {
    throw new Error(error.message);
  }

  return {
    ...artist,
    tracks:
      (artist?.tracks as Pick<Track, "id" | "title" | "duration">[]) || [],
  };
}

export async function updateArtist(
  supabase: TypedClient,
  {
    name,
    bio,
    locality_id,
    administrative_area_id,
    user_id,
    country_id,
  }: Database["public"]["Tables"]["artists"]["Update"],
  artistId: string
) {
  console.log("updating artist", artistId);
  const { data: artist, error } = await supabase
    .from("artists")
    .update({
      name,
      bio,
      administrative_area_id,
      locality_id,
      country_id,
      user_id,
    })
    .eq("id", artistId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return artist;
}

export async function deleteArtistLocation(
  supabase: TypedClient,
  artistId: string
) {
  const { data: artist, error } = await supabase
    .from("artists")
    .update({
      locality_id: null,
      administrative_area_id: null,
      country_id: null,
    })
    .eq("id", artistId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return artist;
}


