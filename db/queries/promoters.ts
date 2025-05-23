"use server";
import { TypedClient } from "@/utils/supabase/global.types";
import { TablesInsert } from "@/utils/supabase/database.types";

export async function getPromoter(supabase: TypedClient) {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("*")
    .eq("user_id", user.user.id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return promoter;
}

export async function getPromoterById(
  supabase: TypedClient,
  promoterId: string,
) {
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("*")
    .eq("id", promoterId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return promoter;
}

export async function getPromoterByName(
  supabase: TypedClient,
  promoterName: string,
) {
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("*")
    .ilike("title", promoterName)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return promoter;
}

export async function createPromoter(
  supabase: TypedClient,
  promoterData: TablesInsert<"promoters">
) {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  // Ensure user_id is set to the current authenticated user
  const promoterWithUserId = {
    ...promoterData,
    user_id: user.user.id,
  };

  const { data: promoter, error } = await supabase
    .from("promoters")
    .insert(promoterWithUserId)
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to create promoter: ${error.message}`);
  }

  return promoter;
}
