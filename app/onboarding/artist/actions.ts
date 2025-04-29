"use server";

import { createClient } from "@/utils/supabase/server";

export async function createArtist(name: string, bio: string) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!name) {
    throw new Error("Name is required");
  }

  const { data: artist, error } = await supabase
    .from("artists")
    .insert({
      name,
      bio,
      user_id: user.user.id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return artist;
}
