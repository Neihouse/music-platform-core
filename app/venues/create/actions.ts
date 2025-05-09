"use server";

import { createClient } from "@/utils/supabase/server";

export async function createVenue(
  venueName: string,
  description: string,
  address: string,
  capacity: number,
  contactEmail: string,
  contactPhone: string
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!venueName) {
    throw new Error("Venue name is required");
  }

  // For now, we'll use a simplified approach
  const { data: venue, error } = await supabase
    .from("venues")
    .insert({
      name: venueName,
      description: description,
      address: address,
      capacity: capacity,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      administrative_area: "",
      locality: "",
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  // In a complete implementation, we would also store additional details
  // like name, description, capacity, etc. in another table or extend the venues table

  return venue;
}
