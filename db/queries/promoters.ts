"use server";
import { TablesInsert } from "@/utils/supabase/database.types";
import { TypedClient } from "@/utils/supabase/global.types";
import { getUser } from "./users";

export async function getPromoter(supabase: TypedClient) {
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select(`
      *,
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
    `)
    .eq("user_id", user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return promoter;
}

export async function getPromoterById(
  supabase: TypedClient,
  promoterId: string,
) {
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("*")
    .eq("id", promoterId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return promoter;
}

export async function getPromoterByName(
  supabase: TypedClient,
  promoterName: string,
) {
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select(`
      *,
      name,
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
    `)
    .ilike("name", `%${promoterName}%`)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  console.log("Fetched promoter:", promoter);
  return promoter;
}

export async function createPromoter(
  supabase: TypedClient,
  promoterData: TablesInsert<"promoters">
) {
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }



  const { data: promoter, error } = await supabase
    .from("promoters")
    .upsert(promoterData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create promoter: ${error.message}`);
  }

  return promoter;
}

export async function getPromoterEvents(
  supabase: TypedClient,
  promoterId: string
) {
  const { data: eventPromotions, error } = await supabase
    .from("events_promoters")
    .select(`
      events (
        *,
        venues (
          id,
          name,
          address
        )
      )
    `)
    .eq("promoter", promoterId);

  if (error) {
    console.error("Error fetching promoter events:", error);
    return [];
  }

  // Extract events from the junction table results and filter for upcoming events
  const events = eventPromotions
    ?.map((ep: any) => ep.events)
    .filter(Boolean)
    .filter((event: any) => event.date && new Date(event.date) >= new Date())
    .sort((a: any, b: any) => new Date(a.date || 0).getTime() - new Date(b.date || 0).getTime()) || [];

  return events;
}

export async function getPromoterPastEvents(
  supabase: TypedClient,
  promoterId: string
) {
  const { data: eventPromotions, error } = await supabase
    .from("events_promoters")
    .select(`
      events (
        *,
        venues (
          id,
          name,
          address
        )
      )
    `)
    .eq("promoter", promoterId);

  if (error) {
    console.error("Error fetching past events:", error);
    return [];
  }

  // Extract events from the junction table results and filter for past events
  return eventPromotions
    ?.map((ep: any) => ep.events)
    .filter(Boolean)
    .filter((event: any) => event.date && new Date(event.date) < new Date())
    .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 6) || [];

}

export async function getPromoterArtists(
  supabase: TypedClient,
  promoterId: string
) {
  const { data: promoterArtists, error } = await supabase
    .from("promoters_artists")
    .select(`
      *,
      artists (*)
    `)
    .eq("promoter", promoterId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching promoter artists:", error);
    return [];
  }

  return promoterArtists?.map(pa => pa.artists).filter(Boolean) || [];
}

export async function updatePromoter(
  supabase: TypedClient,
  promoterId: string,
  promoterData: Partial<TablesInsert<"promoters">>
) {
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Verify the user owns this promoter
  const { data: existingPromoter } = await supabase
    .from("promoters")
    .select("user_id")
    .eq("id", promoterId)
    .single();

  if (!existingPromoter || existingPromoter.user_id !== user.id) {
    throw new Error("Unauthorized to update this promoter");
  }

  const { data: promoter, error } = await supabase
    .from("promoters")
    .update(promoterData)
    .eq("id", promoterId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update promoter: ${error.message}`);
  }

  return promoter;
}

export async function getAllPromoters(supabase: TypedClient) {
  const { data: promoters, error } = await supabase
    .from("promoters")
    .select(`
      *,
      promoters_artists (
        artists (
          id,
          name,
          avatar_img
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching promoters:", error);
    return [];
  }

  // Transform the data to include artist count and sample artists
  const transformedPromoters = promoters?.map(promoter => {
    const artistCount = promoter.promoters_artists?.length || 0;
    const sampleArtists = promoter.promoters_artists?.slice(0, 3).map(pa => pa.artists).filter(Boolean) || [];

    return {
      ...promoter,
      artistCount,
      sampleArtists,
    };
  }) || [];

  return transformedPromoters;
}

export async function getPromoterTrackCount(supabase: TypedClient, promoterId: string) {
  const { data, error } = await supabase
    .from("promoters_artists")
    .select(`
      artists (
        artists_tracks (
          tracks (
            id,
            created_at
          )
        )
      )
    `)
    .eq("promoter", promoterId);

  if (error) {
    console.error("Error fetching promoter track count:", error);
    return { total: 0, recent: 0 };
  }

  let totalTracks = 0;
  let recentTracks = 0;
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  data?.forEach(pa => {
    pa.artists?.artists_tracks?.forEach(at => {
      if (at.tracks) {
        totalTracks++;
        const trackDate = new Date(at.tracks.created_at);
        if (trackDate >= thirtyDaysAgo) {
          recentTracks++;
        }
      }
    });
  });

  return { total: totalTracks, recent: recentTracks };
}

export async function getPromoterShowCount(supabase: TypedClient, promoterId: string) {
  const { data, error } = await supabase
    .from("events_promoters")
    .select(`
      events (
        id,
        date,
        created_at
      )
    `)
    .eq("promoter", promoterId);

  if (error) {
    console.error("Error fetching promoter show count:", error);
    return { total: 0, upcoming: 0, past: 0 };
  }

  let totalShows = 0;
  let upcomingShows = 0;
  let pastShows = 0;
  const now = new Date();

  data?.forEach(ep => {
    if (ep.events) {
      totalShows++;
      const eventDate = ep.events.date ? new Date(ep.events.date) : new Date(ep.events.created_at);
      if (eventDate >= now) {
        upcomingShows++;
      } else {
        pastShows++;
      }
    }
  });

  return { total: totalShows, upcoming: upcomingShows, past: pastShows };
}

export async function getAllPromotersWithMetrics(supabase: TypedClient) {
  const { data: promoters, error } = await supabase
    .from("promoters")
    .select(`
      *,
      promoters_artists (
        artists (
          id,
          name,
          avatar_img
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching promoters:", error);
    return [];
  }

  // Get metrics for each promoter
  const promotersWithMetrics = await Promise.all(
    (promoters || []).map(async (promoter) => {
      const [trackMetrics, showMetrics] = await Promise.all([
        getPromoterTrackCount(supabase, promoter.id),
        getPromoterShowCount(supabase, promoter.id),
      ]);

      const artistCount = promoter.promoters_artists?.length || 0;
      const sampleArtists = promoter.promoters_artists?.slice(0, 3).map(pa => pa.artists).filter(Boolean) || [];

      return {
        ...promoter,
        artistCount,
        sampleArtists,
        trackMetrics,
        showMetrics,
      };
    })
  );

  return promotersWithMetrics;
}

export async function updatePromoterAvatar(
  supabase: TypedClient,
  promoterId: string,
  avatarFilename: string | null
) {
  return updatePromoter(supabase, promoterId, { avatar_img: avatarFilename });
}

export async function updatePromoterBanner(
  supabase: TypedClient,
  promoterId: string,
  bannerFilename: string | null
) {
  return updatePromoter(supabase, promoterId, { banner_img: bannerFilename });
}

export async function getPromoterAvatar(
  supabase: TypedClient,
  promoterId: string
): Promise<string | null> {
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("avatar_img")
    .eq("id", promoterId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch promoter avatar: ${error.message}`);
  }

  return promoter?.avatar_img || null;
}

export async function getPromoterBanner(
  supabase: TypedClient,
  promoterId: string
): Promise<string | null> {
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("banner_img")
    .eq("id", promoterId)
    .single();

  if (error) {
    throw new Error(`Failed to fetch promoter banner: ${error.message}`);
  }

  return promoter?.banner_img || null;
}

export async function getPromotersByArtistLocalities(
  supabase: TypedClient,
  artistId: string
) {
  // First get all locality IDs associated with the artist
  const { data: artistLocalities, error: artistError } = await supabase
    .from("artists_localities")
    .select("locality")
    .eq("artist", artistId);

  if (artistError) {
    console.error("Error fetching artist localities:", artistError);
    return [];
  }

  if (!artistLocalities || artistLocalities.length === 0) {
    return [];
  }

  const localityIds = artistLocalities.map(al => al.locality);

  // Then get all promoters that are linked to those same localities
  const { data: promoterLocalities, error: promoterError } = await supabase
    .from("promoters_localities")
    .select(`
      promoter,
      locality,
      promoters (
        *,
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
    .in("locality", localityIds);

  if (promoterError) {
    console.error("Error fetching promoters by artist localities:", promoterError);
    return [];
  }

  // Extract unique promoters from the results
  const uniquePromoters = new Map();
  promoterLocalities?.forEach(pl => {
    if (pl.promoters && !uniquePromoters.has(pl.promoters.id)) {
      uniquePromoters.set(pl.promoters.id, pl.promoters);
    }
  });

  return Array.from(uniquePromoters.values());
}

export async function getArtistsByPromoterLocalities(
  supabase: TypedClient,
  promoterId: string
) {
  // First get all locality IDs associated with the promoter
  const { data: promoterLocalities, error: promoterError } = await supabase
    .from("promoters_localities")
    .select("locality")
    .eq("promoter", promoterId);

  if (promoterError) {
    console.error("Error fetching promoter localities:", promoterError);
    return [];
  }

  if (!promoterLocalities || promoterLocalities.length === 0) {
    return [];
  }

  const localityIds = promoterLocalities.map(pl => pl.locality);

  // Then get all artists that are linked to those same localities
  const { data: artistLocalities, error: artistError } = await supabase
    .from("artists_localities")
    .select(`
      artist,
      locality,
      artists (
        id,
        name,
        bio,
        avatar_img,
        banner_img,
        external_links,
        user_id
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

  if (artistError) {
    console.error("Error fetching artists by promoter localities:", artistError);
    return [];
  }

  // Transform the data to include locality information and remove duplicates
  const uniqueArtists = new Map();

  artistLocalities?.forEach(al => {
    if (al.artists && !uniqueArtists.has(al.artists.id)) {
      let storedLocality = undefined;

      if (al.localities?.administrative_areas?.countries) {
        storedLocality = {
          locality: al.localities,
          administrativeArea: al.localities.administrative_areas,
          country: al.localities.administrative_areas.countries,
          fullAddress: undefined
        };
      }

      uniqueArtists.set(al.artists.id, {
        ...al.artists,
        storedLocality
      });
    }
  });

  return Array.from(uniqueArtists.values());
}

export async function getPromotersByLocality(
  supabase: TypedClient,
  localityId?: string,
  limit?: number,
  offset?: number
) {
  if (!localityId) {
    return [];
  }

  const query = supabase
    .from("promoters_localities")
    .select(`
      promoters (
        id,
        name,
        bio,
        avatar_img,
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
    .eq("locality", localityId);

  if (limit) {
    query.limit(limit);
  }

  if (offset) {
    query.range(offset, offset + (limit || 10) - 1);
  }

  const { data: promoterLocalities, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return promoterLocalities?.map(pl => pl.promoters).filter(Boolean) || [];
}

