"use server";

import { createClient } from "@/utils/supabase/server";
import { createRequest } from "@/db/queries/requests";
import { getPromoter } from "@/db/queries/promoters";
import { redirect } from "next/navigation";

export async function inviteArtistAction(artistId: string, artistUserId: string) {
  const supabase = await createClient();
  
  // Get current user and verify they are a promoter
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    throw new Error("User not authenticated");
  }

  const promoter = await getPromoter(supabase);
  if (!promoter) {
    throw new Error("User is not a promoter");
  }

  try {
    // Create the request
    const request = await createRequest(supabase, {
      invited_to_entity: "promoter",
      invited_to_entity_id: promoter.id,
      invitee_entity: "artist",
      invitee_entity_id: artistId,
      invitee_user_id: artistUserId,
      inviter_user_id: user.id,
      status: "pending",
    });

    return { success: true, request };
  } catch (error) {
    console.error("Error creating invite request:", error);
    throw new Error("Failed to send invite");
  }
}
