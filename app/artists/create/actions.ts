"use server";

import { createClient } from "@/utils/supabase/server";
import { submitPlace } from "@/components/LocationInput/actions";
import { createArtist } from "@/db/queries/artists";

export async function submitArtist(
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

  const artist = await createArtist(supabase,
    {
      name,
      bio,
      locality_id: locality.id,
      administrative_area_id: administrativeArea.id,
      user_id: user.user.id,
      country_id: country.id,
    },
  )

  return artist;
}
