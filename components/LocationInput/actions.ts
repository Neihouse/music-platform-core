"use server";

import { getOrCreateAdministrativeArea } from "@/db/queries/administrative_areas";
import { getOrCreateCountry } from "@/db/queries/countries";
import { getOrCreateLocality } from "@/db/queries/localities";
import { createClient } from "@/utils/supabase/server";

export async function submitPlace(
    { address_components }: google.maps.places.PlaceResult,
) {
    if (!address_components) {
        throw new Error("No address components found");
    }
    const supabase = await createClient();

    // Extract location information
    const administrativeArea = address_components?.find(
        (component) => component.types.includes("administrative_area_level_1")
    )?.long_name;

    const locality = address_components?.find((component) =>
        component.types.includes("locality")
    )?.long_name;

    const country = address_components?.find((component) =>
        component.types.includes("country")
    )?.long_name;

    if (!administrativeArea || !locality || !country) {
        throw new Error(
            "Administrative area, locality, and country are required for location."
        );
    }
    const countryData = await getOrCreateCountry(
        supabase,
        country
    );

    const administrativeAreaData = await getOrCreateAdministrativeArea(
        supabase,
        administrativeArea,
        countryData.id
    );

    const localityData = await getOrCreateLocality(
        supabase,
        locality,
        administrativeAreaData.id,
        countryData.id
    );
}