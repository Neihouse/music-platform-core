"use server";

import { TypedClient } from "@/utils/supabase/global.types";

export async function getOrCreateLocality(
  supabase: TypedClient,
  locality: string,
  administrative_area_id: string
) {
  // Check if the locality already exists
  const existingLocality = await getLocalityByName(supabase, locality);

  if (existingLocality) {
    return existingLocality;
  }

  // If it doesn't exist, create it
  return createLocality(supabase, locality, administrative_area_id);
}

export async function createLocality(
  supabase: TypedClient,
  locality: string,
  administrative_area_id: string
) {
  // Insert the data into the localities table
  const { data, error } = await supabase
    .from("localities")
    .insert({
      name: locality,
      administrative_area_id: administrative_area_id,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create locality: ${error.message}`);
  }

  return data;
}

export async function getLocalityByName(supabase: TypedClient, name: string) {
  const { data, error } = await supabase
    .from("localities")
    .select()
    .eq("name", name)
    .maybeSingle();

  if (!error && !data) {
    return null;
  }

  if (error) {
    throw new Error(`Failed to fetch locality: ${error.message}`);
  }

  return data;
}
