"use server";
import { TypedClient } from "@/utils/supabase/global.types";

export async function createTag(
    supabase: TypedClient,
    tag: string
) {

    const { data, error } = await supabase
        .from("tags")
        .insert({
            name: tag,
        })
        .select()
        .single();

    if (error) {
        throw new Error(error.message);
    }

    return data;
}


export async function addTagToEntity(
    supabase: TypedClient,
    entityType: "artist" | "track" | "promoter",
    tag: string,
    entityId: string,
) {

    try {
        await createTag(supabase, tag);
    } catch (error) {
        console.log("Error creating tag", error);
    }

    const { data, error } = await supabase
        .from(`${entityType}s_tags`)
        .insert({
            tag: tag,
            [`${entityType}_id`]: entityId,
        })
        .select()
        .single();

    if (error) {
        console.log("Error adding tag to entity", error);
        throw new Error(error.message);
    }

    return data;
}

export async function removeTagFromEntity(
    supabase: TypedClient,
    entityType: "artist" | "track" | "promoter",
    tag: string,
    entityId: string,
) {
    const { error } = await supabase
        .from(`${entityType}s_tags`)
        .delete()
        .eq("tag", tag)
        .eq(`${entityType}_id`, entityId);

    if (error) {
        throw new Error(error.message);
    }

    return true;
}

export async function getTagsForEntity(
    supabase: TypedClient,
    entityType: "artist" | "track" | "promoter",
    entityId: string,
): Promise<string[]> {
    const { data, error } = await supabase
        .from(`${entityType}s_tags`)
        .select('*')
        .eq(`${entityType}_id`, entityId);

    if (error) {
        throw new Error(error.message);
    }

    return data.map(item => item.tag);
}


export async function searchTags(
    supabase: TypedClient,
    query: string
) {
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .ilike("name", `%${query}%`);

    if (error) {
        throw new Error(error.message);
    }

    return data;
}