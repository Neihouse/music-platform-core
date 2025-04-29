import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export interface ILogoutPageProps {}

export default async function LogoutPage(props: ILogoutPageProps) {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
