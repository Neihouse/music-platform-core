import { createClient } from "@/utils/supabase/client";

export async function getUser() {
  const client = createClient();

  return client.auth.getUser();
}
