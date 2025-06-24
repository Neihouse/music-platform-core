"use server";
import { TypedClient } from "@/utils/supabase/global.types";

export type UserProfile = {
  type: 'artist' | 'promoter' | null;
  avatar_img: string | null;
  name: string | null;
  id: string | null;
};

export async function getUserProfile(supabase: TypedClient): Promise<UserProfile> {
  try {
    const { data: user } = await supabase.auth.getUser();
    if (!user || !user.user) {
      return {
        type: null,
        avatar_img: null,
        name: null,
        id: null,
      };
    }

    // Check if user is an artist
    const { data: artist, error: artistError } = await supabase
      .from("artists")
      .select("id, name, avatar_img")
      .eq("user_id", user.user.id)
      .maybeSingle();

    if (!artistError && artist) {
      return {
        type: 'artist',
        avatar_img: artist.avatar_img,
        name: artist.name,
        id: artist.id,
      };
    }

    // Check if user is a promoter
    const { data: promoter, error: promoterError } = await supabase
      .from("promoters")
      .select("id, name, avatar_img")
      .eq("user_id", user.user.id)
      .maybeSingle();

    if (!promoterError && promoter) {
      return {
        type: 'promoter',
        avatar_img: promoter.avatar_img,
        name: promoter.name,
        id: promoter.id,
      };
    }

    // User exists but has no profile yet
    return {
      type: null,
      avatar_img: null,
      name: null,
      id: null,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      type: null,
      avatar_img: null,
      name: null,
      id: null,
    };
  }
}
