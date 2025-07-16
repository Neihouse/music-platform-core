"use server";

import { TypedClient } from "@/utils/supabase/global.types";

export interface PhotoItem {
    id: string;
    url: string;
    filename: string;
}

/**
 * Fetches all photos for a specific event using the new folder structure
 * @param supabase - The Supabase client
 * @param eventId - The ID of the event to fetch photos for
 * @returns Array of PhotoItem objects with public URLs
 */
export async function getPhotosByEvent(supabase: TypedClient, eventId: string): Promise<PhotoItem[]> {
    try {
        // First, get the event to access its hash
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("hash")
            .eq("id", eventId)
            .single();

        if (eventError || !event?.hash) {
            console.error("Error fetching event hash:", eventError);
            return [];
        }

        // Get all photo records from the database for this event
        const { data: photos, error } = await supabase
            .from("event_photos")
            .select("id, user, created_at")
            .eq("event", eventId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching event photos from database:", error);
            throw new Error(`Failed to fetch event photos: ${error.message}`);
        }

        if (!photos || photos.length === 0) {
            return [];
        }

        // Get the actual files from storage using the new folder structure
        const photoItems: PhotoItem[] = [];

        for (const photo of photos) {
            try {
                // Build the path using the new folder structure: eventHash/userId/filename
                const folderPath = photo.user ? `${event.hash}/${photo.user}/${photo.id}` : photo.id;

                const { data: publicUrlData } = supabase.storage
                    .from("event-photos")
                    .getPublicUrl(folderPath);

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

/**
 * Gets the count of photos uploaded by a specific user for an event
 * @param supabase - The Supabase client
 * @param eventId - The ID of the event
 * @param userId - The ID of the user
 * @returns The number of photos the user has uploaded for the event
 */
export async function getUserEventPhotoCount(supabase: TypedClient, eventId: string, userId: string): Promise<number> {
    try {
        const { count, error } = await supabase
            .from("event_photos")
            .select("id", { count: "exact", head: true })
            .eq("event", eventId)
            .eq("user", userId);

        if (error) {
            console.error("Error getting user event photo count:", error);
            throw new Error(`Failed to get user event photo count: ${error.message}`);
        }

        return count || 0;
    } catch (error) {
        console.error("Error in getUserEventPhotoCount:", error);
        return 0;
    }
}

/**
 * Fetches photos uploaded by a specific user for an event
 * @param supabase - The Supabase client
 * @param eventId - The ID of the event to fetch photos for
 * @param userId - The ID of the user who uploaded the photos
 * @returns Array of PhotoItem objects with public URLs
 */
export async function getUserEventPhotos(supabase: TypedClient, eventId: string, userId: string): Promise<PhotoItem[]> {
    try {
        // First, get the event to access its hash
        const { data: event, error: eventError } = await supabase
            .from("events")
            .select("hash")
            .eq("id", eventId)
            .single();

        if (eventError || !event?.hash) {
            console.error("Error fetching event hash:", eventError);
            return [];
        }

        // Get all photo records from the database for this event and user
        const { data: photos, error } = await supabase
            .from("event_photos")
            .select("id, user, created_at")
            .eq("event", eventId)
            .eq("user", userId)
            .order("created_at", { ascending: true });

        if (error) {
            console.error("Error fetching user event photos from database:", error);
            throw new Error(`Failed to fetch user event photos: ${error.message}`);
        }

        if (!photos || photos.length === 0) {
            return [];
        }

        // Get the actual files from storage using the new folder structure
        const photoItems: PhotoItem[] = [];

        for (const photo of photos) {
            try {
                // Build the path using the new folder structure: eventHash/userId/filename
                const folderPath = `${event.hash}/${userId}/${photo.id}`;

                const { data: publicUrlData } = supabase.storage
                    .from("event-photos")
                    .getPublicUrl(folderPath);

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
        console.error("Error in getUserEventPhotos:", error);
        throw error;
    }
}
