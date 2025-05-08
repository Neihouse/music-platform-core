"use server";

import { Track } from "@/utils/supabase/global.types";

import { createClient } from "@/utils/supabase/server";

export async function handleCreateTracks(tracks: Track[]) {
  const supabase = await createClient();

  for await (const track of tracks) {
    const { data, error } = await supabase
      .from("tracks")
      .insert(track)
      .select()
      .single();

    if (error) {
      throw new Error(`Failed to create track: ${error.message}`);
    }
    return data;
  }
}
