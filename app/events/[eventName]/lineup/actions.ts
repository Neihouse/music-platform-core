"use server";

import { createClient } from "@/utils/supabase/server";
import { TablesInsert, TablesUpdate } from "@/utils/supabase/database.types";

export async function getEventStagesAction(eventId: string) {
  const supabase = await createClient();

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

  return stages || [];
}

export async function createEventStageAction(
  eventId: string,
  stageName: string,
  venueId?: string | null
) {
  const supabase = await createClient();

  // If no venue is provided, we need to either use the event's venue or create a default
  let stageVenueId = venueId;
  
  if (!stageVenueId) {
    // Get the event's venue
    const { data: event } = await supabase
      .from("events")
      .select("venue")
      .eq("id", eventId)
      .single();
    
    if (event?.venue) {
      stageVenueId = event.venue;
    } else {
      // If still no venue, we need to handle this case
      throw new Error("No venue specified for stage. Please select a venue for the event first.");
    }
  }

  const { data: stage, error } = await supabase
    .from("event_stage")
    .insert({
      event: eventId,
      name: stageName,
      venue: stageVenueId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create stage: ${error.message}`);
  }

  return stage;
}

export async function getEventStageArtistsAction(eventId: string, stageId?: string) {
  const supabase = await createClient();

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
    .order("set_start", { ascending: true });

  if (error) {
    throw new Error(`Failed to get stage artists: ${error.message}`);
  }

  return assignments || [];
}

export async function assignArtistToStageAction(
  assignmentData: TablesInsert<"event_stage_artists">
) {
  const supabase = await createClient();

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

export async function updateArtistStageAssignmentAction(
  assignmentId: string,
  updateData: TablesUpdate<"event_stage_artists">
) {
  const supabase = await createClient();

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

export async function removeArtistFromStageAction(assignmentId: string) {
  const supabase = await createClient();

  const { error } = await supabase
    .from("event_stage_artists")
    .delete()
    .eq("id", assignmentId);

  if (error) {
    throw new Error(`Failed to remove artist from stage: ${error.message}`);
  }
}
