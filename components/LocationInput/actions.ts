"use server";
import {
  createAdministrativeArea,
  getAdministrativeAreaByName,
} from "@/db/queries/administrative_areas";
import { createLocality, getLocalityByName } from "@/db/queries/localities";
import { createClient } from "@/utils/supabase/server";

export async function submitLocation(
  administrative_area_level_1: string,
  locality: string
) {
  const supabase = await createClient();

  if (!locality) {
    throw new Error("Locality name required");
  }

  if (!administrative_area_level_1) {
    throw new Error("Administrative area level 1 required.");
  }

  const existingAdministrative_area = await getAdministrativeAreaByName(
    supabase,
    administrative_area_level_1
  );

  if (!existingAdministrative_area) {
    await createAdministrativeArea(supabase, {
      name: administrative_area_level_1,
    });
  }

  // Check if the locality already exists
  const existingLocality = await getLocalityByName(supabase, locality);

  if (!existingLocality) {
    await createLocality(supabase, {
      name: locality,
      administrative_area_id: administrative_area.id,
    });
  }
}
