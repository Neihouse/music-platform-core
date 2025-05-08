"use server";

import { SupabaseClient } from "@supabase/supabase-js";

export async function createLocality(
  supabase: SupabaseClient,
  locality: {
    name: string;
    administrative_area_id: string;
  }
) {
  // Insert the data into the localities table
  const { data, error } = await supabase
    .from("localities")
    .insert(locality)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create locality: ${error.message}`);
  }

  return data;
}

export async function getLocalityByName(
  supabase: SupabaseClient,
  name: string
) {
  const { data, error } = await supabase
    .from("localities")
    .select()
    .eq("name", name)
    .single();

  if (error) {
    throw new Error(`Failed to fetch locality: ${error.message}`);
  }

  return data;
}
