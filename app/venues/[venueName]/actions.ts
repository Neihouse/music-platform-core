"use server";

import { createClient } from "@/utils/supabase/server";
import { StoredLocality } from "@/utils/supabase/global.types";

export async function getVenueEvents(venueId: string, type: "upcoming" | "past") {
  const supabase = await createClient();
  const now = new Date().toISOString();

  const query = supabase
    .from("events")
    .select("*")
    .eq("venue", venueId);

  if (type === "upcoming") {
    query.gte("date", now);
    query.order("date", { ascending: true });
  } else {
    query.lt("date", now);
    query.order("date", { ascending: false });
  }

  const { data: events, error } = await query;

  if (error) {
    console.error("Error fetching venue events:", error);
    return [];
  }

  return events || [];
}

export async function getVenuePromoters(venueId: string) {
  const supabase = await createClient();

  const { data: promoters, error } = await supabase
    .from("promoters_venues")
    .select(`
      promoter_id,
      created_at,
      promoters (*)
    `)
    .eq("venue_id", venueId);

  if (error) {
    console.error("Error fetching venue promoters:", error);
    return [];
  }

  return promoters?.map(pv => pv.promoters).filter(Boolean) || [];
}

export async function getVenueGallery(venueId: string) {
  // For now, return empty array since we don't have venue images table
  // This can be implemented when venue image storage is added
  return [];
}

// Additional helper function to get venue statistics
export async function getVenueStats(venueId: string) {
  const supabase = await createClient();

  const [eventsResult, promotersResult] = await Promise.all([
    supabase
      .from("events")
      .select("id")
      .eq("venue", venueId),
    supabase
      .from("promoters_venues")
      .select("id")
      .eq("venue_id", venueId),
  ]);

  return {
    totalEvents: eventsResult.data?.length || 0,
    totalPromoters: promotersResult.data?.length || 0,
  };
}

export async function updateVenue(
  venueId: string,
  updates: {
    name: string;
    description: string;
    capacity: number;
    contact_email: string;
    contact_phone: string;
    location?: StoredLocality;
  }
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  // Prepare the update data
  const updateData: any = {
    name: updates.name,
    description: updates.description,
    capacity: updates.capacity,
    contact_email: updates.contact_email,
    contact_phone: updates.contact_phone,
  };

  // If location is provided, update address and location references
  if (updates.location) {
    updateData.address = updates.location.fullAddress || 
      `${updates.location.locality.name}, ${updates.location.administrativeArea.name}, ${updates.location.country.name}`;
    updateData.administrative_area = updates.location.administrativeArea.id;
    updateData.locality = updates.location.locality.id;
  }

  const { data: venue, error } = await supabase
    .from("venues")
    .update(updateData)
    .eq("id", venueId)
    .eq("user_id", user.user.id) // Ensure only the owner can update
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return venue;
}
