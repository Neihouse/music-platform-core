"use client";

import { EventPhotoGallery } from "@/components/Upload";
import { EventPhotoPlaceholder } from "./EventPhotoPlaceholder";
import { EventPhotoUploadWithControls } from "./EventPhotoUploadWithControls";

interface EventPhotoSectionProps {
    event: {
        id?: string;
        name: string;
        date?: string | null;
    };
    isEventCreator?: boolean;
}

export function EventPhotoSection({ event, isEventCreator = false }: EventPhotoSectionProps) {
    // Check if the event has started
    const eventHasStarted = event.date ? new Date(event.date) <= new Date() : false;

    // If event hasn't started, show placeholder
    if (!eventHasStarted) {
        return (
            <EventPhotoPlaceholder
                eventName={event.name}
                eventDate={event.date}
            />
        );
    }

    // If event has started and we have an event ID, show the appropriate component
    if (event.id) {
        if (isEventCreator) {
            // Event creator can upload photos
            return (
                <EventPhotoUploadWithControls
                    eventId={event.id}
                    eventName={event.name}
                    onConfirm={() => {
                        console.log(`Photo upload confirmed for event ${event.name}`);
                    }}
                    onCancel={() => {
                        console.log(`Photo upload cancelled for event ${event.name}`);
                    }}
                />
            );
        } else {
            // Non-creators see read-only gallery
            return (
                <EventPhotoGallery
                    eventId={event.id}
                    eventName={event.name}
                    isEventOwner={false}
                    embedded={true}
                />
            );
        }
    }

    // Fallback to placeholder if no event ID
    return (
        <EventPhotoPlaceholder
            eventName={event.name}
            eventDate={event.date}
        />
    );
}
