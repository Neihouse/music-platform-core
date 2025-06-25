"use server";
import { Artist, StoredLocality, Track, TypedClient, Locality, AdministrativeArea, Country } from "@/utils/supabase/global.types";
import { Database } from "@/utils/supabase/database.types";

export async function createArtist(
  supabase: TypedClient,
  {
    name,
    bio,
    administrative_area_id,
    user_id,
    country_id,
  }: Database["public"]["Tables"]["artists"]["Insert"],
  localityIds?: string[]
) {
  const { data: artist, error } = await supabase
    .from("artists")
    .insert({
      name,
      bio,
      administrative_area_id,
      country_id,
      user_id,
    })
    .select()
    .single();
  if (error) {
    throw new Error(error.message);
  }

  // If locality IDs are provided, create the relationships
  if (localityIds && localityIds.length > 0) {
    const artistLocalityInserts = localityIds.map(localityId => ({
      artist: artist.id,
      locality: localityId,
    }));

    const { error: localityError } = await supabase
      .from("artists_localities")
      .insert(artistLocalityInserts);

    if (localityError) {
      // If locality insert fails, we might want to clean up the artist
      // For now, we'll just log the error but return the artist
      console.error("Error inserting artist localities:", localityError);
    }
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
    .select(`
      *,
      artists_localities (
        locality,
        localities (
          id,
          name,
          administrative_area_id,
          country_id,
          created_at,
          administrative_areas (
            id,
            name,
            country_id,
            created_at,
            countries (
              id,
              name,
              created_at
            )
          )
        )
      ),
      administrative_areas(*),
      countries(*)
    `)
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (!artist && !error) {
    return null;
  }

  if (error) {
    throw new Error(error?.message || "Artist not found");
  }

  // Build stored locality from the first locality relationship (if any)
  let storedLocality: StoredLocality | undefined = undefined;
  
  if (artist?.artists_localities && artist.artists_localities.length > 0) {
    const firstLocality = artist.artists_localities[0];
    if (firstLocality.localities?.administrative_areas?.countries) {
      storedLocality = {
        locality: firstLocality.localities as Locality,
        administrativeArea: firstLocality.localities.administrative_areas as AdministrativeArea,
        country: firstLocality.localities.administrative_areas.countries as Country,
      };
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
  const { data: artist, error } = await supabase
    .from("artists")
    .select(`
      *,
      artists_localities (
        locality,
        localities (
          id,
          name,
          administrative_area_id,
          country_id,
          created_at,
          administrative_areas (
            id,
            name,
            country_id,
            created_at,
            countries (
              id,
              name,
              created_at
            )
          )
        )
      ),
      administrative_areas (
        id,
        name,
        country_id,
        created_at,
        countries (
          id,
          name,
          created_at
        )
      ),
      countries (
        id,
        name,
        created_at
      )
    `)
    .ilike("name", artistName)
    .maybeSingle();

  if (!artist && !error) {
    return null;
  }
  if (error) {
    throw new Error(error.message);
  }

  // Build stored locality from the first locality relationship (if any)
  let storedLocality: StoredLocality | undefined = undefined;
  
  if (artist?.artists_localities && artist.artists_localities.length > 0) {
    const firstLocality = artist.artists_localities[0];
    if (firstLocality.localities?.administrative_areas?.countries) {
      storedLocality = {
        locality: firstLocality.localities as Locality,
        administrativeArea: firstLocality.localities.administrative_areas as AdministrativeArea,
        country: firstLocality.localities.administrative_areas.countries as Country,
      };
    }
  }

  return {
    ...artist,
    storedLocality,
  } as ArtistWithLocation;
}

export async function updateArtist(
  supabase: TypedClient,
  {
    name,
    bio,
    administrative_area_id,
    user_id,
    country_id,
  }: Database["public"]["Tables"]["artists"]["Update"],
  artistId: string,
  localityIds?: string[]
) {
  const { data, error } = await supabase
    .from("artists")
    .update({
      name,
      bio,
      administrative_area_id,
      country_id,
      user_id,
    })
    .eq("id", artistId);

  if (error) {
    throw new Error(error.message);
  }

  // Update localities if provided
  if (localityIds !== undefined) {
    // First, delete existing locality relationships
    await supabase
      .from("artists_localities")
      .delete()
      .eq("artist", artistId);

    // Then, insert new locality relationships
    if (localityIds.length > 0) {
      const artistLocalityInserts = localityIds.map(localityId => ({
        artist: artistId,
        locality: localityId,
      }));

      const { error: localityError } = await supabase
        .from("artists_localities")
        .insert(artistLocalityInserts);

      if (localityError) {
        console.error("Error updating artist localities:", localityError);
      }
    }
  }

  return await getArtist(supabase);
}

export async function deleteArtistLocation(
  supabase: TypedClient,
  artistId: string
) {
  // Delete all locality relationships for the artist
  const { error: localityError } = await supabase
    .from("artists_localities")
    .delete()
    .eq("artist", artistId);

  if (localityError) {
    throw new Error(localityError.message);
  }

  // Update the artist to remove administrative area and country
  const { data: artist, error } = await supabase
    .from("artists")
    .update({
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

export async function updateArtistExternalLinks(
  supabase: TypedClient,
  artistId: string,
  externalLinks: string[]
): Promise<void> {
  
  const { error } = await supabase
    .from("artists")
    .update({ external_links: externalLinks })
    .eq("id", artistId);

  if (error) {
    throw new Error(`Failed to update external links: ${error.message}`);
  }
}

export async function getArtistExternalLinks(
  supabase: TypedClient,
  artistId: string
): Promise<string[]> {
  const { data: artist, error } = await supabase
    .from("artists")
    .select("external_links")
    .eq("id", artistId)
    .single();

  if (error) {
    throw new Error(`Failed to get external links: ${error.message}`);
  }

  return artist?.external_links || [];
}

export async function getArtistsByLocality(
  supabase: TypedClient,
  localityId?: string,
  administrativeAreaId?: string,
  countryId?: string
) {
  if (localityId) {
    // Query through the junction table for locality-based search
    const { data: artistLocalities, error } = await supabase
      .from("artists_localities")
      .select(`
        artist,
        locality,
        artists (
          *,
          administrative_areas (
            id,
            name
          ),
          countries (
            id,
            name
          )
        ),
        localities (
          id,
          name
        )
      `)
      .eq("locality", localityId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching artists by locality:", error);
      return [];
    }

    // Transform the data to match the expected format
    return artistLocalities?.map(al => ({
      ...al.artists,
      localities: al.localities,
    })).filter(Boolean) || [];
  }

  // For administrative area or country filtering, query artists directly
  let query = supabase
    .from("artists")
    .select(`
      *,
      artists_localities (
        locality,
        localities (
          id,
          name
        )
      ),
      administrative_areas (
        id,
        name
      ),
      countries (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  // Filter by administrative area
  if (administrativeAreaId) {
    query = query.eq("administrative_area_id", administrativeAreaId);
  }
  
  // Filter by country
  else if (countryId) {
    query = query.eq("country_id", countryId);
  }

  const { data: artists, error } = await query;

  if (error) {
    console.error("Error fetching artists:", error);
    return [];
  }

  return artists || [];
}

export async function getAllArtists(supabase: TypedClient) {
  const { data: artists, error } = await supabase
    .from("artists")
    .select(`
      *,
      artists_localities (
        locality,
        localities (
          id,
          name
        )
      ),
      administrative_areas (
        id,
        name
      ),
      countries (
        id,
        name
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all artists:", error);
    return [];
  }

  return artists || [];
}

export async function addArtistLocality(
  supabase: TypedClient,
  artistId: string,
  localityId: string
) {
  const { data, error } = await supabase
    .from("artists_localities")
    .insert({
      artist: artistId,
      locality: localityId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function removeArtistLocality(
  supabase: TypedClient,
  artistId: string,
  localityId: string
) {
  const { error } = await supabase
    .from("artists_localities")
    .delete()
    .eq("artist", artistId)
    .eq("locality", localityId);

  if (error) {
    throw new Error(error.message);
  }
}

export async function getArtistLocalities(
  supabase: TypedClient,
  artistId: string
) {
  const { data: artistLocalities, error } = await supabase
    .from("artists_localities")
    .select(`
      *,
      localities (
        id,
        name,
        administrative_area_id,
        country_id,
        created_at,
        administrative_areas (
          id,
          name,
          country_id,
          created_at,
          countries (
            id,
            name,
            created_at
          )
        )
      )
    `)
    .eq("artist", artistId);

  if (error) {
    throw new Error(error.message);
  }

  return artistLocalities || [];
}

export async function updateArtistLocalities(
  supabase: TypedClient,
  artistId: string,
  localityIds: string[]
) {
  // First, delete existing locality relationships
  await supabase
    .from("artists_localities")
    .delete()
    .eq("artist", artistId);

  // Then, insert new locality relationships
  if (localityIds.length > 0) {
    const artistLocalityInserts = localityIds.map(localityId => ({
      artist: artistId,
      locality: localityId,
    }));

    const { error } = await supabase
      .from("artists_localities")
      .insert(artistLocalityInserts);

    if (error) {
      throw new Error(error.message);
    }
  }

  return await getArtist(supabase);
}


