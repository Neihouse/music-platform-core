"use server";
import { TypedClient } from "@/utils/supabase/global.types";

export async function getVenue(supabase: TypedClient) {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  const { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return venue;
}

export async function getVenueById(supabase: TypedClient, venueId: string) {
  const { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .eq("id", venueId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return venue;
}

export async function getVenueByName(supabase: TypedClient, venueName: string) {
  
  // First try exact match
  let { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .eq("name", venueName)
    .maybeSingle();

  if (error) {
    console.error("Error in exact match query:", error);
  }

  // If no exact match, try case-insensitive match
  if (!venue && !error) {
    console.log("No exact match found, trying case-insensitive search");
    const result = await supabase
      .from("venues")
      .select("*")
      .ilike("name", venueName)
      .maybeSingle();
    
    venue = result.data;
    error = result.error;
  }

  // If still no match, try fuzzy search with wildcards
  if (!venue && !error) {
    console.log("No case-insensitive match found, trying fuzzy search");
    const result = await supabase
      .from("venues")
      .select("*")
      .ilike("name", `%${venueName}%`)
      .maybeSingle();
    
    venue = result.data;
    error = result.error;
  }

  if (error) {
    console.error("Final error in venue lookup:", error);
    throw new Error(error.message);
  }

  console.log("Found venue:", venue ? venue.name : "null");
  return venue;
}

export async function getAllVenues(supabase: TypedClient) {
  const { data: venues, error } = await supabase
    .from("venues")
    .select("id, name, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching all venues:", error);
    return [];
  }

  return venues || [];
}
