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
  const { data: venue, error } = await supabase
    .from("venues")
    .select("*")
    .ilike("name", venueName)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return venue;
}
