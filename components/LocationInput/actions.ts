"use server";

import { getOrCreateAdministrativeArea } from "@/db/queries/administrative_areas";
import { getOrCreateCountry } from "@/db/queries/countries";
import { getOrCreateLocality } from "@/db/queries/localities";
import { createClient } from "@/utils/supabase/server";
import { StoredLocality } from "@/utils/supabase/global.types";

export async function submitPlace(
  addressComponents: google.maps.GeocoderAddressComponent[],
  fullAddress?: string,
): Promise<StoredLocality> {
  if (!addressComponents) {
    throw new Error("No address components found");
  }

  // Extract location information
  const administrativeArea = addressComponents?.find((component) =>
    component.types.includes("administrative_area_level_1"),
  )?.long_name;

  const locality = addressComponents?.find((component) =>
    component.types.includes("locality"),
  )?.long_name;

  const country = addressComponents?.find((component) =>
    component.types.includes("country"),
  )?.long_name;

  // For full addresses, we might also want to extract street information
  const streetNumber = addressComponents?.find((component) =>
    component.types.includes("street_number"),
  )?.long_name;

  const route = addressComponents?.find((component) =>
    component.types.includes("route"),
  )?.long_name;

  if (!administrativeArea || !locality || !country) {
    throw new Error(
      "Administrative area, locality, and country are required for location.",
    );
  }

  const supabase = await createClient();

  const countryData = await getOrCreateCountry(supabase, country);

  const administrativeAreaData = await getOrCreateAdministrativeArea(
    supabase,
    administrativeArea,
    countryData.id,
  );

  const localityData = await getOrCreateLocality(
    supabase,
    locality,
    administrativeAreaData.id,
    countryData.id,
  );

  return {
    country: countryData,
    administrativeArea: administrativeAreaData,
    locality: localityData,
    fullAddress: fullAddress, // Include the full formatted address if provided
  };
}
