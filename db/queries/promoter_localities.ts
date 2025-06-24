"use server";

import { TypedClient } from "@/utils/supabase/global.types";

export async function addPromoterLocality(
  supabase: TypedClient,
  promoterId: string,
  localityId: string
) {
  const { data, error } = await supabase
    .from("promoters_localities")
    .insert({
      promoter_id: promoterId,
      locality_id: localityId,
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add promoter locality: ${error.message}`);
  }

  return data;
}

export async function removePromoterLocality(
  supabase: TypedClient,
  promoterId: string,
  localityId: string
) {
  const { error } = await supabase
    .from("promoters_localities")
    .delete()
    .eq("promoter_id", promoterId)
    .eq("locality_id", localityId);

  if (error) {
    throw new Error(`Failed to remove promoter locality: ${error.message}`);
  }
}

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
  // First, remove all existing localities for this promoter
  const { error: deleteError } = await supabase
    .from("promoters_localities")
    .delete()
    .eq("promoter_id", promoterId);

  if (deleteError) {
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
      throw new Error(`Failed to add new localities: ${insertError.message}`);
    }

    return data;
  }

  return [];
}
