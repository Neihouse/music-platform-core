"use client";

import { createClient } from "@/utils/supabase/client";
import { PhotoItem, PhotoUpload, PhotoUploadConfig } from "./index";

export interface IEventPhotoUploadProps {
    /** The event ID */
    eventId?: string;
    /** Callback when photos are uploaded */
    onPhotosUploaded?: (photos: PhotoItem[]) => void;
}

const eventPhotoConfig: PhotoUploadConfig = {
    storageBucket: "event-photos",
    storageFolder: "", // Use root of event-photos bucket
    title: "Event Photos",
    description: "Upload photos from your event to showcase the experience",
    maxFileSize: 10 * 1024 * 1024, // 10MB
    multiple: true,
    maxPhotos: 20,
};

async function fetchEventPhotos(eventId: string): Promise<PhotoItem[]> {
    const supabase = createClient();

    const { data: photos, error } = await supabase
        .from("event_photos")
        .select("id")
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
        }
    }

    return photoItems;
}

async function addEventPhoto(eventId: string, filename: string): Promise<string> {
    const supabase = createClient();

    const { data: photo, error } = await supabase
        .from("event_photos")
        .insert({
            event: eventId,
            id: filename  // Use filename as ID to match storage
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

    const { error } = await supabase
        .from("event_photos")
        .delete()
        .eq("id", photoId);

    if (error) {
        throw new Error(`Failed to delete event photo record: ${error.message}`);
    }
}

export function EventPhotoUpload({
    eventId,
    onPhotosUploaded,
}: IEventPhotoUploadProps) {
    return (
        <PhotoUpload
            entityId={eventId}
            config={eventPhotoConfig}
            fetchExistingPhotos={fetchEventPhotos}
            addPhoto={addEventPhoto}
            deletePhoto={deleteEventPhoto}
            onPhotosUpdated={onPhotosUploaded}
        />
    );
}
