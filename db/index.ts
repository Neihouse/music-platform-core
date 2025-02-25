import { createBrowserClient } from "@supabase/ssr";

export function createClient() {
  const SUPABASE_URL = process.env.NEXT;
  return createBrowserClient();
}
