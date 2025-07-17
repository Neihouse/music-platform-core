import { getArtist, ArtistWithLocation } from "@/db/queries/artists";
import { getPromoter } from "@/db/queries/promoters";
import { getUser } from "@/db/queries/users";
import { getArtistImagesServer, getPromoterImagesServer } from "@/lib/images/image-utils";
import { Promoter } from "@/utils/supabase/global.types";
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
    let artist: (ArtistWithLocation & { avatarUrl?: string | null }) | null = null;
    let promoter: (Promoter & { avatarUrl?: string | null }) | null = null;

    try {
        const artistData = await getArtist(supabase);
        if (artistData) {
            const { avatarUrl } = await getArtistImagesServer(supabase, artistData.id);
            artist = { ...artistData, avatarUrl };
        }
    } catch (error) {
        // User is not an artist, continue
    }

    try {
        const promoterData = await getPromoter(supabase);
        if (promoterData) {
            const { avatarUrl } = await getPromoterImagesServer(supabase, promoterData.id);
            promoter = { ...promoterData, avatarUrl };
        }
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
