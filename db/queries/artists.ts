"use server";
import { Artist, StoredLocality, Track, TypedClient } from "@/utils/supabase/global.types";
import { Database } from "@/utils/supabase/database.types";
import { getTagsForEntity } from "./tags";

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
  storedLocality?: StoredLocality;
};

export async function getArtist(supabase: TypedClient): Promise<ArtistWithLocation | null> {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  const { data: artist, error } = await supabase
    .from("artists")
    .select("*, localities (*), administrative_areas(*), countries(*)")
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (!artist && !error) {
    return null;
  }

  if (error) {
    throw new Error(error?.message || "Artist not found");
  }

  let storedLocality: StoredLocality | undefined = undefined;

  if (artist?.administrative_areas && artist?.localities && artist?.countries) {
    storedLocality = {
      locality: artist?.localities!,
      administrativeArea: artist?.administrative_areas!,
      country: artist?.countries!,
    }
  }

  return {
    ...artist,
    storedLocality,
  } as ArtistWithLocation;
}

export async function getArtistByName(
  supabase: TypedClient,
  artistName: string,
) {
  // First, get the artist's basic info
  const { data: artist, error } = await supabase
    .from("artist_view")
    .select(`*`)
    .ilike("name", artistName)
    .maybeSingle();


  if (error) {
    throw new Error(error.message);
  }

  if (!artist?.id) {
    return null;
  }


  const tags = await getTagsForEntity(
    supabase,
    "artist",
    artist.id,
  );

  return {
    ...artist,
    tracks:
      (artist?.tracks as Pick<Track, "id" | "title" | "duration">[]) || [],
    tags: tags || [],
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
  const { data, error } = await supabase
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


  if (error) {
    throw new Error(error.message);
  }



  return await getArtist(supabase);
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


