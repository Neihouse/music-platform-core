"use server";
import { Database } from "@/utils/supabase/database.types";
import { AdministrativeArea, Artist, Country, Locality, StoredLocality, TypedClient } from "@/utils/supabase/global.types";
import { getUser } from "./users";

export async function createArtist(
  supabase: TypedClient,
  {
    name,
    bio,
    administrative_area_id,
    user_id,
    country_id,
    selectedFont,
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
      selectedFont,
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
  const user = await getUser(supabase);
  if (!user) {
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
    .eq("user_id", user.id)
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
    .ilike("name", `%${artistName}%`)
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
    selectedFont,
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
      selectedFont,
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

export async function getArtistEvents(
  supabase: TypedClient,
  artistId: string
) {
  const { data: events, error } = await supabase
    .from("events_artists")
    .select(`
      events (
        id,
        name,
        start,
        venues (
          id,
          name
        )
      )
    `)
    .eq("artist", artistId)
    .gte("events.start", new Date().toISOString());

  if (error) {
    throw new Error(error.message);
  }

  // Sort the events by date on the client side since ordering by related table columns is complex
  const sortedEvents = events
    ?.map(ea => ea.events)
    .filter(Boolean)
    .sort((a: any, b: any) => new Date(a.start).getTime() - new Date(b.start).getTime()) || [];

  return sortedEvents;
}

export async function getArtistPromoters(
  supabase: TypedClient,
  artistId: string
) {
  const { data: promoters, error } = await supabase
    .from("promoters_artists")
    .select(`
      promoters (
        id,
        name,
        bio,
        avatar_img,
        banner_img,
        promoters_localities (
          localities (
            id,
            name,
            administrative_areas (
              id,
              name,
              countries (
                id,
                name
              )
            )
          )
        )
      )
    `)
    .eq("artist", artistId);

  if (error) {
    throw new Error(error.message);
  }

  return promoters?.map(pa => pa.promoters).filter(Boolean) || [];
}

export async function getArtistTrackCount(
  supabase: TypedClient,
  artistId: string
) {
  const { count: totalTracks, error: totalError } = await supabase
    .from("artists_tracks")
    .select("*", { count: "exact", head: true })
    .eq("artist", artistId);

  if (totalError) {
    throw new Error(`Failed to get total track count: ${totalError.message || 'Unknown error'}`);
  }

  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const { count: recentTracks, error: recentError } = await supabase
    .from("artists_tracks")
    .select("tracks!inner(*)", { count: "exact", head: true })
    .eq("artist", artistId)
    .gte("tracks.created_at", thirtyDaysAgo.toISOString());

  if (recentError) {
    throw new Error(`Failed to get recent track count: ${recentError.message || 'Unknown error'}`);
  }

  return {
    total: totalTracks || 0,
    recent: recentTracks || 0,
  };
}

export async function getArtistShowCount(
  supabase: TypedClient,
  artistId: string
) {
  const { count: totalShows, error: totalError } = await supabase
    .from("events_artists")
    .select("*", { count: "exact", head: true })
    .eq("artist", artistId);

  if (totalError) {
    throw new Error(`Failed to get total show count: ${totalError.message || 'Unknown error'}`);
  }

  const { count: upcomingShows, error: upcomingError } = await supabase
    .from("events_artists")
    .select("events!inner(*)", { count: "exact", head: true })
    .eq("artist", artistId)
    .gte("events.start", new Date().toISOString());

  if (upcomingError) {
    throw new Error(`Failed to get upcoming show count: ${upcomingError.message || 'Unknown error'}`);
  }

  return {
    total: totalShows || 0,
    upcoming: upcomingShows || 0,
  };
}

export async function getPromotersByArtistLocalities(
  supabase: TypedClient,
  artistId: string
) {
  // Get artist's localities first
  const { data: artistLocalities, error: artistError } = await supabase
    .from("artists_localities")
    .select("locality")
    .eq("artist", artistId);

  if (artistError) {
    throw new Error(artistError.message);
  }

  if (!artistLocalities || artistLocalities.length === 0) {
    return [];
  }

  const localityIds = artistLocalities.map(al => al.locality);

  // Get promoters in those localities
  const { data: promoters, error } = await supabase
    .from("promoters_localities")
    .select(`
      promoters (
        id,
        name,
        bio,
        avatar_img,
        user_id,
        promoters_localities (
          localities (
            id,
            name,
            administrative_areas (
              id,
              name,
              countries (
                id,
                name
              )
            )
          )
        )
      ),
      localities (
        id,
        name,
        administrative_areas (
          id,
          name,
          countries (
            id,
            name
          )
        )
      )
    `)
    .in("locality", localityIds);

  if (error) {
    throw new Error(error.message);
  }

  // Map and add stored locality info
  return promoters?.map(pl => ({
    ...pl.promoters,
    storedLocality: {
      locality: pl.localities,
      administrativeArea: pl.localities?.administrative_areas,
      country: pl.localities?.administrative_areas?.countries,
      fullAddress: undefined
    }
  })).filter(Boolean) || [];
}
