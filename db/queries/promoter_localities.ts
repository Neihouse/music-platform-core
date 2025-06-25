"use server";

import { TypedClient } from "@/utils/supabase/global.types";

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
    .eq("promoter_id", promoterId);

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
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  // Verify the user owns this promoter
  const { data: existingPromoter } = await supabase
    .from("promoters")
    .select("user_id")
    .eq("id", promoterId)
    .single();

  if (!existingPromoter || existingPromoter.user_id !== user.user.id) {
    throw new Error("Unauthorized to update this promoter");
  }

   // First, remove all existing localities for this promoter
  const { error: deleteError } = await supabase
    .from("promoters_localities")
    .delete()
    .eq("promoter_id", promoterId);

  if (deleteError) {
    console.error("Delete error:", deleteError);
    throw new Error(`Failed to remove existing localities: ${deleteError.message}`);
  }


  // Then, add all new localities
  if (localityIds.length > 0) {
    const inserts = localityIds.map(localityId => ({
      promoter_id: promoterId,
      locality_id: localityId,
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
