"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

import { createClient } from "@/utils/supabase/server";

export interface LoginData {
  email: string;
  name: string;
  password: string;
  terms: boolean;
}
export async function login({ email, password }: LoginData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  console.log("LOgging IN");

  const { error, data } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.log("ERROR: ", error);

    redirect("/error");
  }

  console.log("DATA: ", data);

  revalidatePath("/", "layout");
  redirect("/");
}

export async function signup({ email, password, name }: LoginData) {
  const supabase = await createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs

  const { error, data } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
      },
    },
  });

  console.log("data, error: ", data, error);

  if (error) {
    redirect("/error");
  }

  revalidatePath("/", "layout");
  redirect("/");
}
