"use server";

import { createArtist, deleteArtistLocation, getArtist, updateArtist, updateArtistExternalLinks, updateArtistLocalities } from "@/db/queries/artists";
import { canCreateProfile } from "@/db/queries/user";
import { getUser } from "@/db/queries/users";
import { StoredLocality } from "@/utils/supabase/global.types";
import { createClient } from "@/utils/supabase/server";

export async function submitArtist(
  name: string,
  bio: string,
  { locality, country, administrativeArea }: StoredLocality,
  selectedFont?: string | null,
) {
  const supabase = await createClient();

  const user = await getUser(supabase);

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const existingArtist = await getArtist(supabase);

  // If artist exists, this is an update operation
  if (existingArtist) {
    const updatedArtist = await updateArtist(supabase,
      {
        name,
        bio,
        administrative_area_id: administrativeArea.id,
        user_id: user.id,
        country_id: country.id,
        selectedFont,
      },
      existingArtist.id,
      [locality.id] // Pass locality as an array
    );

    return updatedArtist;
  }

  // For new artist creation, check if user can create a profile
  const { canCreate, reason } = await canCreateProfile(supabase);
  if (!canCreate) {
    throw new Error(reason || "Cannot create artist profile");
  }

  return await createArtist(supabase,
    {
      name,
      bio,
      administrative_area_id: administrativeArea.id,
      user_id: user.id,
      country_id: country.id,
      selectedFont,
    },
    [locality.id] // Pass locality as an array
  );
}


export async function onDeleteArtistLocation(artistId: string) {
  const supabase = await createClient();

  const user = await getUser(supabase);

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!artistId) {
    throw new Error("Artist ID is required");
  }

  return await deleteArtistLocation(supabase, artistId);

}

export async function updateExternalLinks(externalLinks: string[]) {
  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    throw new Error("User not authenticated");
  }

  const artist = await getArtist(supabase);
  if (!artist) {
    throw new Error("Artist not found");
  }

  await updateArtistExternalLinks(supabase, artist.id, externalLinks);
}

export async function updateArtistLocalitiesAction(localityIds: string[]) {
  const supabase = await createClient();
  const user = await getUser(supabase);

  if (!user) {
    throw new Error("User not authenticated");
  }

  const artist = await getArtist(supabase);
  if (!artist) {
    throw new Error("Artist not found");
  }

  return await updateArtistLocalities(supabase, artist.id, localityIds);
}