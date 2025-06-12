"use server";

import { createClient } from "@/utils/supabase/server";
import { createArtist, deleteArtistLocation, getArtist, updateArtist, updateArtistExternalLinks } from "@/db/queries/artists";
import { StoredLocality } from "@/utils/supabase/global.types";

export async function submitArtist(
  name: string,
  bio: string,
  { locality, country, administrativeArea }: StoredLocality,
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!name) {
    throw new Error("Name is required");
  }



  const existingArtist = await getArtist(supabase);

  if (existingArtist) {
    const updatedArtist = await updateArtist(supabase,
      {
        name,
        bio,
        locality_id: locality.id,
        administrative_area_id: administrativeArea.id,
        user_id: user.user.id,
        country_id: country.id,
      },
      existingArtist.id,
    );

    return updatedArtist;
  }

  return await createArtist(supabase,
    {
      name,
      bio,
      locality_id: locality.id,
      administrative_area_id: administrativeArea.id,
      user_id: user.user.id,
      country_id: country.id,
    },
  )

}


export async function onDeleteArtistLocation(artistId: string) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!artistId) {
    throw new Error("Artist ID is required");
  }

  return await deleteArtistLocation(supabase, artistId);

}

export async function updateExternalLinks(externalLinks: string[]) {
  const supabase = await createClient();
  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  const artist = await getArtist(supabase);
  if (!artist) {
    throw new Error("Artist not found");
  }

  await updateArtistExternalLinks(supabase, artist.id, externalLinks);
}