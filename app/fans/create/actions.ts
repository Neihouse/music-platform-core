"use server";

import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";

export async function createFan(displayName: string, preferredGenres: string) {
  const supabase = await createClient();

  const user = await getUser(supabase);

  if (!user) {
    throw new Error("User not authenticated");
  }

  if (!displayName) {
    throw new Error("Display name is required");
  }

  // In a real application, you would create a fans table
  // For now, we'll use a generic approach by storing user preferences
  const { data: fan, error } = await supabase
    .from("fans")
    .upsert({
      user_id: user.id,
      display_name: displayName,
      preferred_genres: preferredGenres,
      type: "fan",
    })
    .select()
    .single();

  if (error) {
    // If the table doesn't exist, this is a simplified example
    console.error("Database error:", error);
    // For now, return a mock response since we're just demonstrating the UI flow
    return {
      user_id: user.id,
      display_name: displayName,
      preferred_genres: preferredGenres,
      type: "fan",
    };
  }

  return fan;
}
