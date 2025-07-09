"use server";

import { TypedClient } from "@/utils/supabase/global.types";
import { getUser } from "./users";

export async function getPromoterLocalities(
  supabase: TypedClient,
  promoterId: string
) {
  const { data, error } = await supabase
    .from("promoters_localities")
    .select(`
      *,
      localities (
        id,
        name,
        administrative_areas (
          id,
          name,
          countries (
            id,
            name
          )
        )
      )
    `)
    .eq("promoter", promoterId);

  if (error) {
    throw new Error(`Failed to fetch promoter localities: ${error.message}`);
  }

  return data || [];
}

export async function updatePromoterLocalities(
  supabase: TypedClient,
  promoterId: string,
  localityIds: string[]
) {

  // Verify user authentication and promoter ownership
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }

  // Verify the user owns this promoter
  const { data: existingPromoter } = await supabase
    .from("promoters")
    .select("user_id")
    .eq("id", promoterId)
    .single();

  if (!existingPromoter || existingPromoter.user_id !== user.id) {
    throw new Error("Unauthorized to update this promoter");
  }

  // First, remove all existing localities for this promoter
  const { error: deleteError } = await supabase
    .from("promoters_localities")
    .delete()
    .eq("promoter", promoterId);

  if (deleteError) {
    console.error("Delete error:", deleteError);
    throw new Error(`Failed to remove existing localities: ${deleteError.message}`);
  }


  // Then, add all new localities
  if (localityIds.length > 0) {
    const inserts = localityIds.map(localityId => ({
      promoter: promoterId,
      locality: localityId,
    }));

    const { data, error: insertError } = await supabase
      .from("promoters_localities")
      .insert(inserts)
      .select();

    if (insertError) {
      console.error("Insert error:", insertError);
      throw new Error(`Failed to add new localities: ${insertError.message}`);
    }

    return data;
  }

  return [];
}
