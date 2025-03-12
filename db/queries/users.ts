"use server";
import { createClient } from "@/utils/supabase/server";

export async function getAuthUser() {
  const client = await createClient();

  const {
    data: { user },
    error,
  } = await client.auth.getUser();

  if (error) throw error;
  if (!user) throw new Error("No auth user found");

  return user;
}

export async function getUser() {
  const authUser = await getAuthUser();

  const client = await createClient();
  const { data, error } = await client
    .from("users")
    .select()
    .limit(1)
    .eq("id", authUser.id);

  if (!data?.length) throw new Error("User profile not found");

  return data[0];
}
