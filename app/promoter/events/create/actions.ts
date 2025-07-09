"use server";

import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

interface CreateEventData {
    name: string;
    locality: string;
    address: string;
    posterFile?: File | null;
}

export async function createEventAction(eventData: CreateEventData) {
    const supabase = await createClient();

    try {
        // Get current user
        const { data: { user }, error: userError } = await supabase.auth.getUser();
        if (userError || !user) {
            throw new Error("Authentication required");
        }

        let posterUrl: string | null = null;

        // Upload poster if provided
        if (eventData.posterFile) {
            const fileExt = eventData.posterFile.name.split('.').pop();
            const fileName = `${user.id}-${Date.now()}.${fileExt}`;

            const { data: uploadData, error: uploadError } = await supabase.storage
                .from('event-posters')
                .upload(fileName, eventData.posterFile);

            if (uploadError) {
                console.error('Poster upload error:', uploadError);
                // Continue without poster rather than failing
            } else {
                const { data: { publicUrl } } = supabase.storage
                    .from('event-posters')
                    .getPublicUrl(fileName);
                posterUrl = publicUrl;
            }
        }

        // Create the event
        const { data: event, error: eventError } = await supabase
            .from('events')
            .insert({
                name: eventData.name,
                address: eventData.address,
                locality: eventData.locality,
                poster_img: posterUrl,
                user_id: user.id
            })
            .select()
            .single();

        if (eventError) {
            throw new Error(`Failed to create event: ${eventError.message}`);
        }

        // Revalidate and redirect
        revalidatePath('/promoter/events');
        redirect(`/promoter/events/${event.id}`);

    } catch (error: any) {
        console.error('Create event error:', error);
        throw new Error(error.message || 'Failed to create event');
    }
}
