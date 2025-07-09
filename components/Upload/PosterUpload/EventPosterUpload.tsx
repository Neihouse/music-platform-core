"use client";

import { createClient } from "@/utils/supabase/client";
import { PosterUpload, PosterUploadConfig } from "./index";

export interface IEventPosterUploadProps {
    /** The event ID */
    eventId?: string;
    /** Callback when poster is uploaded */
    onPosterUploaded?: (url: string) => void;
}

const eventPosterConfig: PosterUploadConfig = {
    storageBucket: "posters",
    storageFolder: "", // Use root of posters bucket
    title: "Event Poster",
    description: "Upload a poster image for your event to make it more visually appealing",
    maxFileSize: 10 * 1024 * 1024, // 10MB
};

async function fetchEventPoster(eventId: string): Promise<string | null> {
    const supabase = createClient();

    const { data: event, error } = await supabase
        .from("events")
        .select("poster_img")
        .eq("id", eventId)
        .single();

    if (error) {
        console.error("Error fetching event poster:", error);
        return null;
    }

    return event?.poster_img || null;
}

async function updateEventPoster(eventId: string, filename: string | null): Promise<void> {
    const supabase = createClient();

    const { error } = await supabase
        .from("events")
        .update({ poster_img: filename })
        .eq("id", eventId);

    if (error) {
        throw new Error(`Failed to update event poster: ${error.message}`);
    }
}

export function EventPosterUpload({
    eventId,
    onPosterUploaded,
}: IEventPosterUploadProps) {
    return (
        <PosterUpload
            entityId={eventId}
            config={eventPosterConfig}
            fetchExistingPoster={fetchEventPoster}
            updateEntityPoster={updateEventPoster}
            onPosterUploaded={onPosterUploaded}
        />
    );
}
