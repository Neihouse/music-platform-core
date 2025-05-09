"use server";
import { TypedClient } from "@/utils/supabase/global.types";

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
  promoterId: string
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
  promoterName: string
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
