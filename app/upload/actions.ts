import { createTrack } from "@/db/queries/tracks";
import { createClient } from "@/utils/supabase/server";
import { IAudioMetadata } from "music-metadata";

export async function handleInsertTrack(
  metadata: IAudioMetadata,
  size: number
) {
  const supabase = await createClient();

  return await createTrack(supabase, metadata, size);
}
