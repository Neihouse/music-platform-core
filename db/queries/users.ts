"use server";
import { TypedClient } from "@/utils/supabase/global.types";

export async function getUser(supabase: TypedClient) {
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (!user || user.is_anonymous) {
    return null;
  }

  if (error) {
    throw new Error(`Error fetching user: ${error.message}`);
  }

  return user;
}

export async function signOut(supabase: TypedClient) {
  try {
    await supabase.auth.signOut();
  } catch (error) {
    console.log("Error signing out: ", error);
  }
}
