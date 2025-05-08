"use server";
import {
  createAdministrativeArea,
  getAdministrativeAreaByName,
} from "@/db/queries/administrative_areas";
import { createLocality, getLocalityByName } from "@/db/queries/localities";
import { createClient } from "@/utils/supabase/server";

export async function submitUserLocation(
  location: google.maps.places.PlaceResult
) {
  const supabase = await createClient();

  const localityName = location.address_components?.find((component) =>
    component.types.includes("locality")
  )?.long_name;

  if (!localityName) {
    throw new Error("Locality name not found in address components");
  }

  const administrative_area_level_1 = location.address_components?.find(
    (component) => component.types.includes("administrative_area_level_1")
  )?.long_name;

  if (!administrative_area_level_1) {
    throw new Error(
      "Administrative area level 1 name not found in address components"
    );
  }

  const administrative_area = await getAdministrativeAreaByName(
    supabase,
    administrative_area_level_1
  );

  if (!administrative_area) {
    await createAdministrativeArea(supabase, {
      name: administrative_area_level_1,
    });
  }

  // Check if the locality already exists
  const locality = await getLocalityByName(supabase, localityName);

  if (!locality) {
    await createLocality(supabase, {
      name: localityName,
      administrative_area_id: administrative_area.id,
    });
  }
}
