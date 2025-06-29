"use server";
import { TypedClient } from "@/utils/supabase/global.types";
import { Database } from "@/utils/supabase/database.types";

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
  const { data: request, error } = await supabase
    .from("requests")
    .update({ status: "accepted" })
    .eq("id", requestId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return request;
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

export async function getRequestBetweenUsers(
  supabase: TypedClient,
  inviterUserId: string,
  inviteeUserId: string,
  invitedToEntity: string,
  invitedToEntityId: string
) {
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
