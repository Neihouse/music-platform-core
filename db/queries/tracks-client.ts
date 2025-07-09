import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";
import { getUserClient } from "./users-client";

export async function getTrackPlayURL(supabase: SupabaseClient<Database>, trackId: string) {
    if (!trackId) {
        throw new Error("Track ID is required");
    }

    let user = await getUserClient(supabase);

    // If user is not authenticated, sign them in anonymously
    if (!user) {
        const { data: anonData, error: anonError } = await supabase.auth.signInAnonymously();

        if (anonError) {
            throw new Error("Failed to authenticate anonymously: " + anonError.message);
        }

        if (!anonData.user) {
            throw new Error("Anonymous authentication failed");
        }

        user = anonData.user;
    }

    const {
        data: { publicUrl },
    } = supabase.storage.from("tracks").getPublicUrl(trackId);

    const { data, error } = await supabase.from("track_plays").insert({
        track: trackId,
        user: user.id,
    });

    if (error) {
        throw new Error(error.message);
    }

    return publicUrl;
}
