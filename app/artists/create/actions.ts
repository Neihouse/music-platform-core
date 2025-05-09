"use server";

import { createClient } from "@/utils/supabase/server";
import { getOrCreateAdministrativeArea } from "@/db/queries/administrative_areas";
import { getOrCreateLocality } from "@/db/queries/localities";

export async function createArtist(
  name: string,
  bio: string,
  administrativeArea: string,
  locality: string
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const administrativeAreaData = await getOrCreateAdministrativeArea(
    supabase,
    administrativeArea
  );

  const localityData = await getOrCreateLocality(
    supabase,
    locality,
    administrativeAreaData.id
  );

  const { data: artist, error } = await supabase
    .from("artists")
    .insert({
      name,
      bio,
      administrative_area: administrativeAreaData.id || null,
      locality: localityData.id || null,
      user_id: user.user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return artist;
}
