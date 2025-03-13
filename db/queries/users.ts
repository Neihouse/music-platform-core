"use server";
import { createClient } from "@/utils/supabase/server";

export async function getAuthUser() {
  const client = await createClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) throw error;

  return user;
}

export async function getUser() {
  const authUser = await getAuthUser();

  if (!authUser) throw new Error("User not logged in");
  const client = await createClient();
  const { data, error } = await client
    .from("users")
    .select()
    .limit(1)
    .eq("id", authUser.id)
    .single();

  return data;
}
