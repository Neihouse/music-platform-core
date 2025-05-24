"use server";
import { TypedClient } from "@/utils/supabase/global.types";
import { Database } from "@/utils/supabase/database.types";
import { getArtist } from "./artists";

export async function createAlbum(
  supabase: TypedClient,
  albumData: Database["public"]["Tables"]["albums"]["Insert"]
) {
  const artist = await getArtist(supabase);

  if (!artist) {
    throw new Error("Artist not found");
  }

  const { data: album, error } = await supabase
    .from("albums")
    .insert(albumData)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return album;
}

export async function getAlbum(supabase: TypedClient, albumId: string) {
  const { data: album, error } = await supabase
    .from("albums")
    .select(`
      *,
      tracks (
        id,
        title,
        duration,
        codec,
        size
      )
    `)
    .eq("id", albumId)
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return album;
}

export async function getAlbumsByArtist(supabase: TypedClient) {
  const artist = await getArtist(supabase);

  if (!artist) {
    throw new Error("Artist not found");
  }

  const { data: albums, error } = await supabase
    .from("albums")
    .select(`
      *,
      tracks (
        id,
        title,
        duration
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return albums || [];
}

export async function updateAlbum(
  supabase: TypedClient,
  albumId: string,
  albumData: Database["public"]["Tables"]["albums"]["Update"]
) {
  const { data: album, error } = await supabase
    .from("albums")
    .update(albumData)
    .eq("id", albumId)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return album;
}

export async function deleteAlbum(supabase: TypedClient, albumId: string) {
  const { data, error } = await supabase
    .from("albums")
    .delete()
    .eq("id", albumId);

  if (error) {
    throw new Error(error.message);
  }

  return data;
}
