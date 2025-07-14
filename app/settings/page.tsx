import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./components/SettingsClient";

export default async function SettingsPage() {
    const supabase = await createClient();
    const user = await getUser(supabase);

    if (!user) {
        redirect("/login");
    }

    return (
        <SettingsClient
            userEmail={user.email || ""}
        />
    );
}
