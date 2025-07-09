"use server";

import { getAvatarUrlServer } from "@/lib/images/image-utils";
import { createClient } from "@/utils/supabase/server";

export interface ArtistSearchResult {
    id: string;
    name: string;
    avatar_img: string | null;
    avatarUrl: string | null;
    bio: string | null;
}

export async function searchArtists(query: string): Promise<ArtistSearchResult[]> {
    const supabase = await createClient();

    if (!query || query.trim().length === 0) {
        return [];
    }

    // Use fuzzy search with ilike for name matching
    const { data: artists, error } = await supabase
        .from("artists")
        .select("id, name, avatar_img, bio")
        .ilike("name", `%${query.trim()}%`)
        .order("name", { ascending: true })
        .limit(10);

    if (error) {
        console.error("Error searching artists:", error);
        return [];
    }

    // Process avatar URLs
    const artistsWithAvatars = await Promise.all(
        (artists || []).map(async (artist) => ({
            ...artist,
            avatarUrl: artist.avatar_img ? await getAvatarUrlServer(artist.avatar_img) : null,
        }))
    );

    return artistsWithAvatars;
}

export async function getAllArtistsAction(): Promise<ArtistSearchResult[]> {
    const supabase = await createClient();

    const { data: artists, error } = await supabase
        .from("artists")
        .select("id, name, avatar_img, bio")
        .order("name", { ascending: true })
        .limit(50); // Limit to avoid overwhelming the UI

    if (error) {
        console.error("Error fetching all artists:", error);
        return [];
    }

    // Process avatar URLs
    const artistsWithAvatars = await Promise.all(
        (artists || []).map(async (artist) => ({
            ...artist,
            avatarUrl: artist.avatar_img ? await getAvatarUrlServer(artist.avatar_img) : null,
        }))
    );

    return artistsWithAvatars;
}
