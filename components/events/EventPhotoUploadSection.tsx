"use client";

import { EventPhotoPlaceholder } from "./EventPhotoPlaceholder";
import { EventPhotoUploadWithControls } from "./EventPhotoUploadWithControls";

interface EventPhotoUploadSectionProps {
    event: {
        id?: string;
        name: string;
        date?: string | null;
    };
    isEventCreator?: boolean;
    onPhotosConfirmed?: () => void;
}

export function EventPhotoUploadSection({
    event,
    isEventCreator = false,
    onPhotosConfirmed
}: EventPhotoUploadSectionProps) {
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

    // Only show upload interface for event creators when event has started
    if (isEventCreator && event.id) {
        return (
            <EventPhotoUploadWithControls
                eventId={event.id}
                eventName={event.name}
                onConfirm={() => {
                    // Photo upload confirmed
                    onPhotosConfirmed?.();
                }}
                onCancel={() => {
                    // Photo upload cancelled
                }}
            />
        );
    }

    // For non-creators, show placeholder
    return (
        <EventPhotoPlaceholder
            eventName={event.name}
            eventDate={event.date}
        />
    );
}
