"use server";

import { getArtist } from "@/db/queries/artists";
import { acceptRequest, cancelRequest, createRequest, denyRequest, getRequestBetweenUsers } from "@/db/queries/requests";
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

export async function getExistingJoinRequest(promoterId: string, promoterUserId: string) {
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
    // Check for existing request
    const existingRequest = await getRequestBetweenUsers(
      supabase,
      user.id,
      promoterUserId,
      "artist",
      artist.id
    );

    return existingRequest;
  } catch (error) {
    console.error("Error checking for existing request:", error);
    return null;
  }
}

export async function cancelJoinRequest(requestId: string) {
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
    const request = await cancelRequest(supabase, requestId);
    return { success: true, request };
  } catch (error) {
    console.error("Error cancelling join request:", error);
    throw new Error("Failed to cancel request");
  }
}

export async function requestToJoinPromoterCollective(promoterId: string, promoterUserId: string) {
  console.log("requestToJoinPromoter called with:", { promoterId, promoterUserId });

  if (!promoterId || promoterId === "undefined") {
    throw new Error("Invalid promoter ID");
  }
  if (!promoterUserId || promoterUserId === "undefined") {
    throw new Error("Invalid promoter user ID");
  }

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
    // Create the request (artist requesting to join promoter)
    const request = await createRequest(supabase, {
      invited_to_entity: "artist",
      invited_to_entity_id: artist.id,
      invitee_entity: "promoter",
      invitee_entity_id: promoterId,
      invitee_user_id: promoterUserId,
      inviter_user_id: user.id,
      status: "pending",
    });

    return { success: true, request };
  } catch (error) {
    console.error("Error creating join request:", error);
    throw new Error(error instanceof Error ? error.message : "Failed to create join request");
  }
}

export async function getArtistPendingRequests() {
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
    // Get all pending requests sent by this artist to join promoters
    const { data: requests, error } = await supabase
      .from("requests")
      .select("id, invited_to_entity_id, invitee_entity_id, status")
      .eq("inviter_user_id", user.id)
      .eq("invited_to_entity", "artist")
      .eq("invitee_entity", "promoter")
      .eq("status", "pending");

    if (error) {
      throw new Error(error.message);
    }

    return requests || [];
  } catch (error) {
    console.error("Error getting artist pending requests:", error);
    return [];
  }
}

// Alias for backward compatibility
export const requestToJoinPromoter = requestToJoinPromoterCollective;
