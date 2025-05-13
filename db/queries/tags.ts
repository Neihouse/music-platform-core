import { Tag, TypedClient } from "@/utils/supabase/global.types";

export async function createTag(
    supabase: TypedClient,
    name: string
) {
    const { data, error } = await supabase
        .from("tags")
        .insert({ name })
        .select("*")
        .single();

    if (error) {
        throw new Error(`Error creating tag: ${error.message}`);
    }

    return data;
}

export async function getAllTags(supabase: TypedClient): Promise<Tag[]> {
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .order("name");

    if (error) {
        throw new Error(`Error fetching tags: ${error.message}`);
    }

    return data;
}

export async function searchTags(supabase: TypedClient, query: string): Promise<Tag[]> {
    const { data, error } = await supabase
        .from("tags")
        .select("*")
        .ilike("name", `%${query}%`)
        .order("name")
        .limit(10);

    if (error) {
        throw new Error(`Error searching tags: ${error.message}`);
    }

    return data;
}

export async function addTagToEntity(
    supabase: TypedClient,
    entityType: 'artists' | 'tracks' | 'venues' | 'promoters',
    entityId: string,
    tagId: string
) {
    let data;
    let error;

    switch (entityType) {
        case 'artists':
            ({ data, error } = await supabase
                .from('artists_tags')
                .insert({ artist_id: entityId, tag_id: tagId })
                .select("*")
                .single());
            break;
        case 'tracks':
            ({ data, error } = await supabase
                .from('tracks_tags')
                .insert({ track_id: entityId, tag_id: tagId })
                .select("*")
                .single());
            break;
        case 'venues':
            ({ data, error } = await supabase
                .from('venues_tags')
                .insert({ venue_id: entityId, tag_id: tagId })
                .select("*")
                .single());
            break;
        case 'promoters':
            ({ data, error } = await supabase
                .from('promoters_tags')
                .insert({ promoter_id: entityId, tag_id: tagId })
                .select("*")
                .single());
            break;
    }

    if (error) {
        throw new Error(`Error adding tag to ${entityType}: ${error.message}`);
    }

    return data;
}

export async function removeTagFromEntity(
    supabase: TypedClient,
    entityType: 'artists' | 'tracks' | 'venues' | 'promoters',
    entityId: string,
    tagId: string
) {
    let error;

    switch (entityType) {
        case 'artists':
            ({ error } = await supabase
                .from('artists_tags')
                .delete()
                .match({ artist_id: entityId, tag_id: tagId }));
            break;
        case 'tracks':
            ({ error } = await supabase
                .from('tracks_tags')
                .delete()
                .match({ track_id: entityId, tag_id: tagId }));
            break;
        case 'venues':
            ({ error } = await supabase
                .from('venues_tags')
                .delete()
                .match({ venue_id: entityId, tag_id: tagId }));
            break;
        case 'promoters':
            ({ error } = await supabase
                .from('promoters_tags')
                .delete()
                .match({ promoter_id: entityId, tag_id: tagId }));
            break;
    }

    if (error) {
        throw new Error(`Error removing tag from ${entityType}: ${error.message}`);
    }

    return true;
}

export async function getTagsForEntity(
    supabase: TypedClient,
    entityType: 'artists' | 'tracks' | 'venues' | 'promoters',
    entityId: string
): Promise<Tag[]> {
    let data, error;

    switch (entityType) {
        case 'artists':
            ({ data, error } = await supabase
                .from('artists_tags')
                .select('tag_id, tags(*)')
                .eq('artist_id', entityId));
            break;
        case 'tracks':
            ({ data, error } = await supabase
                .from('tracks_tags')
                .select('tag_id, tags(*)')
                .eq('track_id', entityId));
            break;
        case 'venues':
            ({ data, error } = await supabase
                .from('venues_tags')
                .select('tag_id, tags(*)')
                .eq('venue_id', entityId));
            break;
        case 'promoters':
            ({ data, error } = await supabase
                .from('promoters_tags')
                .select('tag_id, tags(*)')
                .eq('promoter_id', entityId));
            break;
    }

    if (error) {
        throw new Error(`Error getting tags for ${entityType}: ${error.message}`);
    }

    // Extract the actual tag objects from the join data
    return data?.map(item => item.tags) || [];
}