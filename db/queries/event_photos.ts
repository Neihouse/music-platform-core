"use server";

import { TypedClient } from "@/utils/supabase/global.types";

export interface PhotoItem {
    id: string;
    url: string;
    filename: string;
}

/**
 * Fetches all photos for a specific event
 * @param supabase - The Supabase client
 * @param eventId - The ID of the event to fetch photos for
 * @returns Array of PhotoItem objects with public URLs
 */
export async function getPhotosByEvent(supabase: TypedClient, eventId: string): Promise<PhotoItem[]> {
    try {
        // First, get all photo records from the database for this event
        const { data: photos, error } = await supabase
            .from("event_photos")
            .select("id, created_at")
            .eq("event", eventId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching event photos from database:", error);
            throw new Error(`Failed to fetch event photos: ${error.message}`);
        }

        if (!photos || photos.length === 0) {
            return [];
        }

        // Get the actual files from storage and map them to PhotoItem format
        const photoItems: PhotoItem[] = [];

        for (const photo of photos) {
            try {
                // The photo.id should be the filename in storage
                const { data: publicUrlData } = supabase.storage
                    .from("event-photos")
                    .getPublicUrl(photo.id);

                if (publicUrlData.publicUrl) {
                    photoItems.push({
                        id: photo.id,
                        url: publicUrlData.publicUrl,
                        filename: photo.id,
                    });
                }
            } catch (error) {
                console.error("Error getting public URL for photo:", photo.id, error);
                // Continue processing other photos even if one fails
                continue;
            }
        }

        return photoItems;
    } catch (error) {
        console.error("Error in getPhotosByEvent:", error);
        throw error;
    }
}

/**
 * Gets the total count of photos for an event
 * @param supabase - The Supabase client
 * @param eventId - The ID of the event
 * @returns The number of photos for the event
 */
export async function getEventPhotoCount(supabase: TypedClient, eventId: string): Promise<number> {
    try {
        const { count, error } = await supabase
            .from("event_photos")
            .select("id", { count: "exact", head: true })
            .eq("event", eventId);

        if (error) {
            console.error("Error getting event photo count:", error);
            throw new Error(`Failed to get event photo count: ${error.message}`);
        }

        return count || 0;
    } catch (error) {
        console.error("Error in getEventPhotoCount:", error);
        return 0;
    }
}

/**
 * Checks if an event has any photos
 * @param supabase - The Supabase client
 * @param eventId - The ID of the event
 * @returns Boolean indicating if the event has photos
 */
export async function eventHasPhotos(supabase: TypedClient, eventId: string): Promise<boolean> {
    try {
        const { data, error } = await supabase
            .from("event_photos")
            .select("id")
            .eq("event", eventId)
            .limit(1)
            .single();

        if (error && error.code !== "PGRST116") { // PGRST116 is "no rows returned"
            console.error("Error checking if event has photos:", error);
            return false;
        }

        return !!data;
    } catch (error) {
        console.error("Error in eventHasPhotos:", error);
        return false;
    }
}
