"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUser() {
  const client = await createClient();

  return client.auth.getUser();
}

export async function signOut() {
  const client = await createClient();

  try {
    await client.auth.signOut();
  } catch (error) {
    console.log("Error signing out: ", error);
  }
}
