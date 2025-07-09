"use server";

import { getUser } from "@/db/queries/users";
import { TablesInsert } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";

export async function createEvent(
  eventData: Omit<TablesInsert<"events">, "id" | "created_at">
) {
  const supabase = await createClient();

  const user = await getUser(supabase);

  if (!user) {
    throw new Error("User not authenticated");
  }

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

export async function addStageToEvent(
  eventId: string,
  stageData: Omit<TablesInsert<"event_stage">, "id" | "created_at">
) {
  const supabase = await createClient();

  const user = await getUser(supabase);

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: stage, error } = await supabase
    .from("event_stage")
    .insert({
      ...stageData,
      event: eventId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add stage to event: ${error.message}`);
  }

  return stage;
}

export async function getEventStages(eventId: string) {
  const supabase = await createClient();

  const { data: stages, error } = await supabase
    .from("event_stage")
    .select("*")
    .eq("event", eventId);

  if (error) {
    throw new Error(`Failed to get event stages: ${error.message}`);
  }

  return stages;
}
