"use server";

import { submitPlace } from "@/components/LocationInput/actions";
import { createPromoter } from "@/db/queries/promoters";
import { canCreateProfile } from "@/db/queries/user";
import { TablesInsert } from "@/utils/supabase/database.types";
import { StoredLocality } from "@/utils/supabase/global.types";
import { createClient } from "@/utils/supabase/server";

export async function submitPromoter(
  promoter: Omit<TablesInsert<"promoters">, "administrative_area_id" | "locality_id">,
  storedLocality: StoredLocality
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  // Check if user can create a promoter profile
  const { canCreate, reason } = await canCreateProfile(supabase, 'promoter');
  if (!canCreate) {
    throw new Error(reason || "Cannot create promoter profile");
  }

  const newPromoter = await createPromoter(
    supabase,
    {
      ...promoter,
      user_id: user.user.id,
  
    })

  return newPromoter;
}
