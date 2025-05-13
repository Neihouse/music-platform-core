"use server";

import { submitPlace } from "@/components/LocationInput/actions";
import { createPromoter } from "@/db/queries/promoters";
import { TablesInsert } from "@/utils/supabase/database.types";
import { createClient } from "@/utils/supabase/server";

export async function submitPromoter(
  promoter: Omit<TablesInsert<"promoters">, "administrative_area_id" | "locality_id">,
  addressComponents: google.maps.GeocoderAddressComponent[],
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  const { locality, administrativeArea, country } = await submitPlace(
    supabase,
    addressComponents)


  const newPromoter = await createPromoter(
    supabase,
    {
      ...promoter,
      user_id: user.user.id,
      locality_id: locality.id,
      administrative_area_id: administrativeArea.id,
      country_id: country.id,
    })

  return newPromoter;
}
