"use server";
import { TypedClient } from "@/utils/supabase/global.types";

export async function createEventPromoterRelationship(
    supabase: TypedClient,
    eventId: string,
    promoterId: string
) {
    const { data: relationship, error } = await supabase
        .from("events_promoters")
        .insert({
            event: eventId,
            promoter: promoterId,
        })
        .select()
        .single();

    if (error) {
        throw new Error(`Failed to create event-promoter relationship: ${error.message}`);
    }

    return relationship;
}

export async function removeEventPromoterRelationship(
    supabase: TypedClient,
    eventId: string,
    promoterId: string
) {
    const { error } = await supabase
        .from("events_promoters")
        .delete()
        .eq("event", eventId)
        .eq("promoter", promoterId);

    if (error) {
        throw new Error(`Failed to remove event-promoter relationship: ${error.message}`);
    }

    return { success: true };
}

export async function getEventPromoterRelationship(
    supabase: TypedClient,
    eventId: string,
    promoterId: string
) {
    const { data: relationship, error } = await supabase
        .from("events_promoters")
        .select("*")
        .eq("event", eventId)
        .eq("promoter", promoterId)
        .maybeSingle();

    if (error) {
        throw new Error(`Failed to fetch event-promoter relationship: ${error.message}`);
    }

    return relationship;
}

export async function checkEventPromoterRelationshipExists(
    supabase: TypedClient,
    eventId: string,
    promoterId: string
): Promise<boolean> {
    const relationship = await getEventPromoterRelationship(supabase, eventId, promoterId);
    return relationship !== null;
}
