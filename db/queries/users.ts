"use server";
import { TypedClient } from "@/utils/supabase/global.types";

export async function getUser(supabase: TypedClient) {
  return supabase.auth.getUser();
}

export async function signOut(supabase: TypedClient) {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.log("Error signing out: ", error);
  }
}
