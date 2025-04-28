"use server";
import { createClient } from "@/utils/supabase/server";

export async function getArtist() {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  const { data: artist, error } = await supabase
    .from("artists")
    .select("*")
    .eq("user_id", user.user.id)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return artist;
}
