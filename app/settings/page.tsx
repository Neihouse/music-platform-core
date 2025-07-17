import { getUser } from "@/db/queries/users";
import { getArtist } from "@/db/queries/artists";
import { getPromoter } from "@/db/queries/promoters";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { SettingsClient } from "./components/SettingsClient";

export default async function SettingsPage() {
    const supabase = await createClient();
    const user = await getUser(supabase);

    if (!user) {
        redirect("/login");
    }

    // Check if user is already an artist or promoter
    let artist = null;
    let promoter = null;
    
    try {
        artist = await getArtist(supabase);
    } catch (error) {
        // User is not an artist, continue
    }
    
    try {
        promoter = await getPromoter(supabase);
    } catch (error) {
        // User is not a promoter, continue
    }

    const showOnboarding = !artist && !promoter;

    return (
        <SettingsClient
            userEmail={user.email || ""}
            showOnboarding={showOnboarding}
            artist={artist}
            promoter={promoter}
        />
    );
}
