"use server";

import { createClient } from "@/utils/supabase/server";
import { submitPlace } from "@/components/LocationInput/actions";

export async function createArtist(
  name: string,
  bio: string,
  place: google.maps.places.PlaceResult,
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const { locality, administrativeArea, country } = await submitPlace(
    supabase,
    place,
  );

  const { data: artist, error } = await supabase
    .from("artists")
    .insert({
      name,
      bio,
      administrative_area: administrativeArea.id,
      locality: locality.id,
      country: country.id,
      user_id: user.user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return artist;
}
