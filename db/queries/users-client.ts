"use client";
import { Database } from "@/utils/supabase/database.types";
import { SupabaseClient } from "@supabase/supabase-js";

export async function getUserClient(supabase: SupabaseClient<Database>) {
    const {
        data: { user },
        error,
    } = await supabase.auth.getUser();

    if (!user || user.is_anonymous) {
        return null;
    }

    if (error) {
        throw new Error(`Error fetching user: ${error.message}`);
    }

    return user;
}
