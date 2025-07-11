"use server";

import { getUser } from "@/db/queries/users";
import { nameToUrl } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function updateEventVenue(eventId: string, venueId: string | null) {
  const supabase = await createClient();

  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: event, error } = await supabase
    .from("events")
    .update({ venue: venueId })
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update event venue: ${error.message}`);
  }

  // Revalidate the event page to show updated data
  revalidatePath(`/events/${nameToUrl(event.name)}`);

  return event;
}

export async function getAvailableVenues() {
  const supabase = await createClient();

  const { data: venues, error } = await supabase
    .from("venues")
    .select("id, name, address, capacity")
    .order("name");

  if (error) {
    throw new Error(`Failed to get venues: ${error.message}`);
  }

  return venues || [];
}
