import { SupabaseClient } from "@supabase/supabase-js";

export async function createAdministrativeArea(
  supabase: SupabaseClient,
  administrativeArea: {
    name: string;
  }
) {
  // Insert the data into the administrative_areas table
  const { data, error } = await supabase
    .from("administrative_areas")
    .insert(administrativeArea)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create administrative area: ${error.message}`);
  }

  return data;
}

export async function getAdministrativeAreaByName(
  supabase: SupabaseClient,
  name: string
) {
  const { data, error } = await supabase
    .from("administrative_areas")
    .select()
    .eq("name", name)
    .single();

  if (error) {
    throw new Error(`Failed to fetch administrative area: ${error.message}`);
  }

  return data;
}
