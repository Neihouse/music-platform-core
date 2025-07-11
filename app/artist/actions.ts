"use server";

import { getArtist } from "@/db/queries/artists";
import { acceptRequest, denyRequest } from "@/db/queries/requests";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";

export async function acceptPromoterInvitation(requestId: string) {
  const supabase = await createClient();

  // Get current user and verify they are an artist
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }

  const artist = await getArtist(supabase);
  if (!artist) {
    throw new Error("User is not an artist");
  }

  try {
    // Accept the request (this will automatically create the promoter-artist relationship)
    const request = await acceptRequest(supabase, requestId);

    return { success: true, request };
  } catch (error) {
    console.error("Error accepting promoter invitation:", error);
    throw new Error("Failed to accept invitation");
  }
}

export async function declinePromoterInvitation(requestId: string) {
  const supabase = await createClient();

  // Get current user and verify they are an artist
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }

  const artist = await getArtist(supabase);
  if (!artist) {
    throw new Error("User is not an artist");
  }

  try {
    const request = await denyRequest(supabase, requestId);
    return { success: true, request };
  } catch (error) {
    console.error("Error declining promoter invitation:", error);
    throw new Error("Failed to decline invitation");
  }
}
