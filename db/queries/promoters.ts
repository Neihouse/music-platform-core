"use server";
import { TypedClient } from "@/utils/supabase/global.types";
import { TablesInsert } from "@/utils/supabase/database.types";

export async function getPromoter(supabase: TypedClient) {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("*")
    .eq("user_id", user.user.id)
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
    .select("*")
    .ilike("name", promoterName)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return promoter;
}

export async function createPromoter(
  supabase: TypedClient,
  promoterData: TablesInsert<"promoters">
) {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }



  const { data: promoter, error } = await supabase
    .from("promoters")
    .insert(promoterData)
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
  console.log("Fetched events:", events);
  return events;
}

export async function getPromoterArtists(
  supabase: TypedClient,
  promoterId: string
) {
  const { data: promoterArtists, error } = await supabase
    .from("promoters_artists")
    .select(`
      *,
      artists (
        id,
        name,
        bio,
        avatar_img,
        banner_img,
        external_links
      )
    `)
    .eq("promoter_id", promoterId)
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
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  // Verify the user owns this promoter
  const { data: existingPromoter } = await supabase
    .from("promoters")
    .select("user_id")
    .eq("id", promoterId)
    .single();

  if (!existingPromoter || existingPromoter.user_id !== user.user.id) {
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
