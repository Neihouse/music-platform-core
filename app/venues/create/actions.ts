"use server";

import { createClient } from "@/utils/supabase/server";
import { StoredLocality } from "@/utils/supabase/global.types";

export async function createVenue(
  venueName: string,
  description: string,
  location: StoredLocality,
  capacity: number,
  contactEmail: string,
  contactPhone: string,
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!venueName) {
    throw new Error("Venue name is required");
  }

  if (!location) {
    throw new Error("Location is required");
  }

  // Create venue with proper location data
  const { data: venue, error } = await supabase
    .from("venues")
    .insert({
      name: venueName,
      description: description,
      address: location.fullAddress || `${location.locality.name}, ${location.administrativeArea.name}, ${location.country.name}`,
      capacity: capacity,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      administrative_area: location.administrativeArea.id,
      locality: location.locality.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return venue;
}
