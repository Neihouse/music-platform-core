"use server";

import { acceptRequest, denyRequest } from "@/db/queries/requests";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";

export async function acceptArtistRequest(requestId: string) {
    try {
        const supabase = await createClient();
        await acceptRequest(supabase, requestId);
        revalidatePath("/promoter");
        return { success: true };
    } catch (error) {
        console.error("Failed to accept artist request:", error);
        return { success: false, error: "Failed to accept request" };
    }
}

export async function declineArtistRequest(requestId: string) {
    try {
        const supabase = await createClient();
        await denyRequest(supabase, requestId);
        revalidatePath("/promoter");
        return { success: true };
    } catch (error) {
        console.error("Failed to decline artist request:", error);
        return { success: false, error: "Failed to decline request" };
    }
}
