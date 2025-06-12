"use server";

import { deleteTrack } from "@/db/queries/tracks";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function deleteTrackAction(trackId: string) {
  const supabase = await createClient();
  
  try {
    await deleteTrack(supabase, trackId);
    
    // Revalidate relevant pages
    revalidatePath("/artists/[artistName]", "page");
    revalidatePath("/", "layout");
    
    return { success: true };
  } catch (error: any) {
    return { 
      success: false, 
      error: error.message || "Failed to delete track" 
    };
  }
}
