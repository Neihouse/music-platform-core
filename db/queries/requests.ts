"use server";
import { Database } from "@/utils/supabase/database.types";
import { TypedClient } from "@/utils/supabase/global.types";
import { createPromoterArtistRelationship } from "./promoters_artists";

export async function createRequest(
  supabase: TypedClient,
  {
    invited_to_entity,
    invited_to_entity_id,
    invitee_entity,
    invitee_entity_id,
    invitee_user_id,
    inviter_user_id,
    status = "pending",
  }: Database["public"]["Tables"]["requests"]["Insert"]
) {
  const { data: request, error } = await supabase
    .from("requests")
    .upsert({
      invited_to_entity,
      invited_to_entity_id,
      invitee_entity,
      invitee_entity_id,
      invitee_user_id,
      inviter_user_id,
      status,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return request;
}

export async function acceptRequest(
  supabase: TypedClient,
  requestId: string
) {
  // First get the request details
  const { data: request, error: fetchError } = await supabase
    .from("requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError) {
    throw new Error(fetchError.message);
  }

  if (!request) {
    throw new Error("Request not found");
  }

  // Update the request status to accepted
  const { data: updatedRequest, error: updateError } = await supabase
    .from("requests")
    .update({ status: "accepted" })
    .eq("id", requestId)
    .select()
    .single();

  if (updateError) {
    throw new Error(updateError.message);
  }

  // If this is a promoter-artist invitation, create the relationship
  if (
    (request.invited_to_entity === "promoter" && request.invitee_entity === "artist") ||
    (request.invited_to_entity === "artist" && request.invitee_entity === "promoter")
  ) {
    try {
      // Determine promoter and artist IDs based on the request direction
      let promoterId: string;
      let artistId: string;

      if (request.invited_to_entity === "promoter") {
        // Promoter invited artist
        promoterId = request.invited_to_entity_id;
        artistId = request.invitee_entity_id;
      } else {
        // Artist requested to join promoter
        promoterId = request.invitee_entity_id;
        artistId = request.invited_to_entity_id;
      }

      await createPromoterArtistRelationship(supabase, promoterId, artistId);
    } catch (relationshipError) {
      console.error("Failed to create promoter-artist relationship:", relationshipError);
      // Note: We don't throw here to avoid rolling back the request acceptance
      // The relationship creation failure should be handled separately
    }
  }

  return updatedRequest;
}

export async function denyRequest(
  supabase: TypedClient,
  requestId: string
) {
  const { data: request, error } = await supabase
    .from("requests")
    .update({ status: "denied" })
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return request;
}

export async function getSentRequests(
  supabase: TypedClient,
  userId: string
) {
  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .eq("inviter_user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return requests;
}

export async function getReceivedRequests(
  supabase: TypedClient,
  userId: string
) {
  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .eq("invitee_user_id", userId);

  if (error) {
    throw new Error(error.message);
  }

  return requests;
}

export async function getReceivedPromoterInvitations(
  supabase: TypedClient,
  userId: string
) {
  // First get the requests
  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .eq("invitee_user_id", userId)
    .eq("invitee_entity", "artist")
    .eq("invited_to_entity", "promoter")
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }

  if (!requests || requests.length === 0) {
    return [];
  }

  // Then get the promoter details for each request
  const promoterIds = requests.map(req => req.invited_to_entity_id);
  const { data: promoters, error: promotersError } = await supabase
    .from("promoters")
    .select("id, name, bio, avatar_img")
    .in("id", promoterIds);

  if (promotersError) {
    throw new Error(promotersError.message);
  }

  // Combine the data
  return requests.map(request => ({
    ...request,
    promoters: promoters?.find(promoter => promoter.id === request.invited_to_entity_id) || null
  }));

}

export async function getRequestBetweenUsers(
  supabase: TypedClient,
  inviterUserId: string,
  inviteeUserId: string,
  invitedToEntity: string,
  invitedToEntityId: string
) {
  console.log("props:", inviterUserId, inviteeUserId, invitedToEntity, invitedToEntityId);
  const { data: request, error } = await supabase
    .from("requests")
    .select("*")
    .eq("inviter_user_id", inviterUserId)
    .eq("invitee_user_id", inviteeUserId)
    .eq("invited_to_entity", invitedToEntity)
    .eq("invited_to_entity_id", invitedToEntityId)
    .eq("status", "pending")
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return request;
}

export async function getReceivedArtistRequests(
  supabase: TypedClient,
  promoterId: string
) {
  // First get the requests where artists are requesting to join this promoter
  const { data: requests, error } = await supabase
    .from("requests")
    .select("*")
    .eq("invitee_entity_id", promoterId)
    .eq("invitee_entity", "promoter")
    .eq("invited_to_entity", "artist")
    .eq("status", "pending");

  if (error) {
    throw new Error(error.message);
  }

  if (!requests || requests.length === 0) {
    return [];
  }

  // Then get the artist details for each request
  const artistIds = requests.map(req => req.invited_to_entity_id);
  const { data: artists, error: artistsError } = await supabase
    .from("artists")
    .select("id, name, bio, avatar_img")
    .in("id", artistIds);

  if (artistsError) {
    throw new Error(artistsError.message);
  }

  // Combine the data
  return requests.map(request => ({
    ...request,
    artist: artists?.find(artist => artist.id === request.invited_to_entity_id) || null
  }));
}

export async function cancelRequest(
  supabase: TypedClient,
  requestId: string
) {
  const { data: request, error } = await supabase
    .from("requests")
    .update({ status: "cancelled" })
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return request;
}
