"use client";

import { EventPhotoGallery } from "@/components/Upload";
import { EventPhotoPlaceholder } from "./EventPhotoPlaceholder";
import { EventPhotoUploadWithControls } from "./EventPhotoUploadWithControls";

interface EventPhotoSectionProps {
    event: {
        id?: string;
        hash?: string | null;
        name: string;
        start?: string | null;
    };
    isEventCreator?: boolean;
}

export function EventPhotoSection({ event, isEventCreator = false }: EventPhotoSectionProps) {
    // Check if the event has started
    const eventHasStarted = event.start ? new Date(event.start) <= new Date() : false;

    // If event hasn't started, show placeholder
    if (!eventHasStarted) {
        return (
            <EventPhotoPlaceholder
                eventName={event.name}
                eventDate={event.start}
            />
        );
    }

    // If event has started and we have an event ID, show the appropriate component
    if (event.id && event.hash) {
        if (isEventCreator) {
            // Event creator can upload photos
            return (
                <EventPhotoUploadWithControls
                    eventId={event.id}
                    eventHash={event.hash}
                    eventName={event.name}
                    onConfirm={() => {
                        // Photo upload confirmed
                    }}
                    onCancel={() => {
                        // Photo upload cancelled
                    }}
                />
            );
        } else {
            // Non-creators see read-only gallery
            return (
                <EventPhotoGallery
                    eventId={event.id}
                    eventName={event.name}
                    embedded={true}
                />
            );
        }
    }

    // Fallback to placeholder if no event ID
    return (
        <EventPhotoPlaceholder
            eventName={event.name}
            eventDate={event.start}
        />
    );
}
