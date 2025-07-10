"use client";

import { createClient } from "@/utils/supabase/client";
import React from "react";
import { PhotoItem, PhotoUpload, PhotoUploadConfig } from "./index";

export interface IEventPhotoUploadProps {
    /** The event ID */
    eventId?: string;
    /** Callback when photos are uploaded */
    onPhotosUploaded?: (photos: PhotoItem[]) => void;
}

// Function to create config for approved photos (direct upload to final location)
const getEventPhotoConfig = (eventHash: string, userId: string): PhotoUploadConfig => ({
    storageBucket: "event-photos",
    storageFolder: `${eventHash}/${userId}`, // Event-specific folder per user
    title: "Event Photos",
    description: "Upload photos from your event to showcase the experience",
    maxFileSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    maxPhotos: 20,
});

async function fetchEventPhotos(eventId: string): Promise<PhotoItem[]> {
    const supabase = createClient();

    // Get the event hash first
    const { data: event, error: eventError } = await supabase
        .from("events")
        .select("hash")
        .eq("id", eventId)
        .single();

    if (eventError || !event?.hash) {
        console.error("Error fetching event hash:", eventError);
        return [];
    }

    const { data: photos, error } = await supabase
        .from("event_photos")
        .select("id, user")
        .eq("event", eventId);

    if (error) {
        console.error("Error fetching event photos:", error);
        return [];
    }

    if (!photos || photos.length === 0) {
        return [];
    }

    // Get the actual files from storage and map them to PhotoItem format
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
        }
    }

    return photoItems;
}

async function addEventPhoto(eventId: string, filename: string): Promise<string> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.is_anonymous) {
        throw new Error("User must be authenticated to add photos");
    }

    const { data: photo, error } = await supabase
        .from("event_photos")
        .insert({
            event: eventId,
            id: filename,  // Use filename as ID to match storage
            user: user.id  // Store the user who uploaded the photo
        })
        .select("id")
        .single();

    if (error) {
        throw new Error(`Failed to add event photo record: ${error.message}`);
    }

    return photo.id;
}

async function deleteEventPhoto(photoId: string, filename: string): Promise<void> {
    const supabase = createClient();

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user || user.is_anonymous) {
        throw new Error("User must be authenticated to delete photos");
    }

    // Delete the database record (this will be used to determine folder structure)
    const { error: dbError } = await supabase
        .from("event_photos")
        .delete()
        .eq("id", photoId)
        .eq("user", user.id); // Only allow users to delete their own photos

    if (dbError) {
        throw new Error(`Failed to delete event photo record: ${dbError.message}`);
    }
}

export function EventPhotoUpload({
    eventId,
    onPhotosUploaded,
}: IEventPhotoUploadProps) {
    const [photoConfig, setPhotoConfig] = React.useState<PhotoUploadConfig | null>(null);

    // Get current user and event hash to build the config
    React.useEffect(() => {
        const setupConfig = async () => {
            if (!eventId) return;

            const supabase = createClient();

            // Get current user
            const { data: { user } } = await supabase.auth.getUser();
            if (!user || user.is_anonymous) {
                console.error("User must be authenticated to upload photos");
                return;
            }

            // Get event hash
            const { data: event, error } = await supabase
                .from("events")
                .select("hash")
                .eq("id", eventId)
                .single();

            if (error || !event?.hash) {
                console.error("Error fetching event hash:", error);
                return;
            }

            // Create config with dynamic folder path
            setPhotoConfig(getEventPhotoConfig(event.hash, user.id));
        };

        setupConfig();
    }, [eventId]);

    if (!photoConfig) {
        return <div>Loading...</div>;
    }

    return (
        <PhotoUpload
            entityId={eventId}
            config={photoConfig}
            fetchExistingPhotos={fetchEventPhotos}
            addPhoto={addEventPhoto}
            deletePhoto={deleteEventPhoto}
            onPhotosUpdated={onPhotosUploaded}
        />
    );
}
