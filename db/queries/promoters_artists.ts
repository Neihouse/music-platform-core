"use server";
import { TypedClient } from "@/utils/supabase/global.types";

export async function createPromoterArtistRelationship(
  supabase: TypedClient,
  promoterId: string,
  artistId: string
) {
    // TODO: Database trigger to automatically create this relationship when a request is accepted
  const { data: relationship, error } = await supabase
    .from("promoters_artists")
    .insert({
      promoter: promoterId,
      artist: artistId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create promoter-artist relationship: ${error.message}`);
  }

  return relationship;
}

export async function removePromoterArtistRelationship(
  supabase: TypedClient,
  promoterId: string,
  artistId: string
) {
  const { error } = await supabase
    .from("promoters_artists")
    .delete()
    .eq("promoter", promoterId)
    .eq("artist", artistId);

  if (error) {
    throw new Error(`Failed to remove promoter-artist relationship: ${error.message}`);
  }

  return { success: true };
}

export async function getPromoterArtistRelationship(
  supabase: TypedClient,
  promoterId: string,
  artistId: string
) {
  const { data: relationship, error } = await supabase
    .from("promoters_artists")
    .select("*")
    .eq("promoter", promoterId)
    .eq("artist", artistId)
    .maybeSingle();

  if (error) {
    throw new Error(`Failed to fetch promoter-artist relationship: ${error.message}`);
  }

  return relationship;
}

export async function checkPromoterArtistRelationshipExists(
  supabase: TypedClient,
  promoterId: string,
  artistId: string
): Promise<boolean> {
  const relationship = await getPromoterArtistRelationship(supabase, promoterId, artistId);
  return relationship !== null;
}

export async function removePromoterArtistRelationshipByRequestId(
  supabase: TypedClient,
  requestId: string
) {
  // First get the request details
  const { data: request, error: fetchError } = await supabase
    .from("requests")
    .select("*")
    .eq("id", requestId)
    .single();

  if (fetchError || !request) {
    throw new Error("Request not found");
  }

  // Determine promoter and artist IDs based on the request direction
  let promoterId: string;
  let artistId: string;

  if (request.invited_to_entity === "promoter") {
    // Promoter invited artist
    promoterId = request.invited_to_entity_id;
    artistId = request.invitee_entity_id;
  } else if (request.invited_to_entity === "artist") {
    // Artist requested to join promoter
    promoterId = request.invitee_entity_id;
    artistId = request.invited_to_entity_id;
  } else {
    throw new Error("Invalid request type for promoter-artist relationship");
  }

  return await removePromoterArtistRelationship(supabase, promoterId, artistId);
}
