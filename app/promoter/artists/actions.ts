"use server";

import { createClient } from "@/utils/supabase/server";
import { createRequest, getRequestBetweenUsers, cancelRequest } from "@/db/queries/requests";
import { getPromoter } from "@/db/queries/promoters";

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

  if (!artistUserId) {
    throw new Error("Artist user_id is required to send an invite. Please ensure the artist object includes user_id.");
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

export async function cancelInviteAction(requestId: string) {
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
    const request = await cancelRequest(supabase, requestId);
    return { success: true, request };
  } catch (error) {
    console.error("Error cancelling invite request:", error);
    throw new Error("Failed to cancel invite");
  }
}

export async function checkExistingInvite(artistUserId: string) {
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
    const existingRequest = await getRequestBetweenUsers(
      supabase,
      user.id,
      artistUserId,
      "promoter",
      promoter.id
    );
    
    return existingRequest;
  } catch (error) {
    console.error("Error checking existing invite:", error);
    return null;
  }
}
