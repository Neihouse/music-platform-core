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
    tag: string,
    entityId: string,
    entityType: "artist" | "track" | "promoter",
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
        throw new Error(error.message);
    }

    return data;
}

export async function removeTagFromEntity(
    supabase: TypedClient,
    tag: string,
    entityId: string,
    entityType: "artist" | "track" | "promoter",
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