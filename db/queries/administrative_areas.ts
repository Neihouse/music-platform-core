import { AdministrativeArea, TypedClient } from "@/utils/supabase/global.types";

export async function getOrCreateAdministrativeArea(
  supabase: TypedClient,
  administrativeArea: string,
  countryId: string
): Promise<AdministrativeArea> {
  const existingAdministrativeArea = await getAdministrativeAreaByName(
    supabase,
    administrativeArea
  );

  if (existingAdministrativeArea) {
    return existingAdministrativeArea;
  }

  // If it doesn't exist, create it
  return createAdministrativeArea(supabase, administrativeArea);
}

export async function createAdministrativeArea(
  supabase: TypedClient,
  administrativeArea: string,
  countryId: string
): Promise<AdministrativeArea> {
  // Insert the data into the administrative_areas table
  const { data, error } = await supabase
    .from("administrative_areas")
    .insert({
      name: administrativeArea,
      country_id: countryId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create administrative area: ${error.message}`);
  }

  return data;
}

export async function getAdministrativeAreaByName(
  supabase: TypedClient,
  name: string
): Promise<AdministrativeArea | null> {
  const { data, error } = await supabase
    .from("administrative_areas")
    .select()
    .eq("name", name)
    .maybeSingle();

  if (!error && !data) {
    return null;
  }

  if (error) {
    throw new Error(`Failed to fetch administrative area: ${error.message}`);
  }

  return data;
}
