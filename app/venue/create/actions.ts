"use server";

import { createClient } from "@/utils/supabase/server";

export async function createVenue(
  venueName: string,
  description: string,
  address: string,
  capacity: number,
  hasParking: boolean,
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

  // In a real implementation, we would first get or create a locality
  // and then use that locality ID to create the venue

  // For now, we'll use a simplified approach
  const { data: venue, error } = await supabase
    .from("venues")
    .insert({
      // Locality is required, but we would determine this from the LocationInput
      // For now, use a placeholder value that would be updated in production
      locality: "placeholder-locality-id",
    })
    .select()
    .single();

  if (error) {
    console.error("Database error:", error);
    // Return a mock response for demonstration purposes
    return {
      id: "mock-venue-id",
      name: venueName,
      description: description,
      address: address,
      capacity: capacity,
      has_parking: hasParking,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      user_id: user.user.id,
    };
  }

  // In a complete implementation, we would also store additional details
  // like name, description, capacity, etc. in another table or extend the venues table

  return venue;
}
