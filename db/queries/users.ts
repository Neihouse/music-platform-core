"use server";
import { createClient } from "@/utils/supabase/server";

export async function getUser() {
  const client = await createClient();

  return client.auth.getUser();
}
