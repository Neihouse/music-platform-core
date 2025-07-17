"use server";
import { TablesInsert, TablesUpdate } from "@/utils/supabase/database.types";
import { TypedClient } from "@/utils/supabase/global.types";

export async function getEventById(supabase: TypedClient, eventId: string) {

  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      venues (
        id,
        name,
        address,
        capacity
      )
    `)
    .eq("id", eventId)
    .single();

  if (error) {
    throw new Error(`Failed to get event: ${error.message}`);
  }

  return event;
}

export async function getEventByName(supabase: TypedClient, eventName: string) {

  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      name,
      venues (
        id,
        name,
        address,
        capacity
      )
    `)
    .ilike("name", `%${eventName}%`)
    .single();

  console.log("event: ", event, "error: ", error);

  if (error) {
    throw new Error(`Failed to get event: ${error.message}`);
  }

  return event;
}

export async function getEventByHash(supabase: TypedClient, eventHash: string) {

  const { data: event, error } = await supabase
    .from("events")
    .select(`
      *,
      venues (
        id,
        name,
        address,
        capacity
      )
    `)
    .eq("hash", eventHash)
    .single();

  if (error) {
    throw new Error(`Failed to get event: ${error.message}`);
  }

  return event;
}

export async function getEvents(supabase: TypedClient) {

  const { data: events, error } = await supabase
    .from("events")
    .select(`
      *,
      venues (
        id,
        name,
        address
      )
    `)
    .order("date", { ascending: true });

  if (error) {
    throw new Error(`Failed to get events: ${error.message}`);
  }

  return events;
}

export async function createEvent(
  supabase: TypedClient,
  eventData: Omit<TablesInsert<"events">, "id" | "created_at">
) {

  const { data: event, error } = await supabase
    .from("events")
    .insert(eventData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create event: ${error.message}`);
  }

  return event;
}

export async function updateEvent(
  supabase: TypedClient,
  eventId: string,
  eventData: TablesUpdate<"events">
) {

  const { data: event, error } = await supabase
    .from("events")
    .update(eventData)
    .eq("id", eventId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to update event: ${error.message}`);
  }

  return event;
}

export async function deleteEvent(supabase: TypedClient, eventId: string) {

  const { error } = await supabase
    .from("events")
    .delete()
    .eq("id", eventId);

  if (error) {
    throw new Error(`Failed to delete event: ${error.message}`);
  }
}

export async function getEventStages(supabase: TypedClient, eventId: string) {

  const { data: stages, error } = await supabase
    .from("event_stage")
    .select(`
      *,
      venues (
        id,
        name,
        capacity
      )
    `)
    .eq("event", eventId);

  if (error) {
    throw new Error(`Failed to get event stages: ${error.message}`);
  }

  return stages;
}

export async function createEventStage(
  supabase: TypedClient,
  stageData: TablesInsert<"event_stage">
) {

  const { data: stage, error } = await supabase
    .from("event_stage")
    .insert(stageData)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create stage: ${error.message}`);
  }

  return stage;
}

export async function getEventStageArtists(supabase: TypedClient, eventId: string, stageId?: string) {

  let query = supabase
    .from("event_stage_artists")
    .select(`
      *,
      artists (
        id,
        name,
        avatar_img
      )
    `)
    .eq("event", eventId);

  if (stageId) {
    query = query.eq("stage", stageId);
  }

  const { data: assignments, error } = await query
    .order("start", { ascending: true });

  if (error) {
    throw new Error(`Failed to get stage artists: ${error.message}`);
  }

  return assignments;
}

export async function assignArtistToStage(
  supabase: TypedClient,
  assignmentData: TablesInsert<"event_stage_artists">
) {

  const { data: assignment, error } = await supabase
    .from("event_stage_artists")
    .insert(assignmentData)
    .select(`
      *,
      artists (
        id,
        name,
        avatar_img
      )
    `)
    .single();

  if (error) {
    throw new Error(`Failed to assign artist to stage: ${error.message}`);
  }

  return assignment;
}

export async function updateArtistStageAssignment(
  supabase: TypedClient,
  assignmentId: string,
  updateData: TablesUpdate<"event_stage_artists">
) {

  const { data: assignment, error } = await supabase
    .from("event_stage_artists")
    .update(updateData)
    .eq("id", assignmentId)
    .select(`
      *,
      artists (
        id,
        name,
        avatar_img
      )
    `)
    .single();

  if (error) {
    throw new Error(`Failed to update artist assignment: ${error.message}`);
  }

  return assignment;
}

export async function removeArtistFromStage(supabase: TypedClient, assignmentId: string) {

  const { error } = await supabase
    .from("event_stage_artists")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    throw new Error(`Failed to remove artist from stage: ${error.message}`);
  }
}
