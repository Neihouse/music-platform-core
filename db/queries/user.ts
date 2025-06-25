"use server";
import { TypedClient } from "@/utils/supabase/global.types";
import { getArtistAvatarUrlServer, getPromoterAvatarUrlServer } from "@/lib/image-utils";

export type UserProfile = {
  type: 'artist' | 'promoter' | null;
  avatar_img: string | null;
  avatarUrl: string | null;
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
        avatarUrl: null,
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
      const avatarUrl = artist.avatar_img 
        ? await getArtistAvatarUrlServer(artist.avatar_img)
        : null;
      
      return {
        type: 'artist',
        avatar_img: artist.avatar_img,
        avatarUrl,
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
      const avatarUrl = promoter.avatar_img 
        ? await getPromoterAvatarUrlServer(promoter.avatar_img)
        : null;
      
      return {
        type: 'promoter',
        avatar_img: promoter.avatar_img,
        avatarUrl,
        name: promoter.name,
        id: promoter.id,
      };
    }

    // User exists but has no profile yet
    return {
      type: null,
      avatar_img: null,
      avatarUrl: null,
      name: null,
      id: null,
    };
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return {
      type: null,
      avatar_img: null,
      avatarUrl: null,
      name: null,
      id: null,
    };
  }
}

export async function userHasProfile(supabase: TypedClient): Promise<boolean> {
  const profile = await getUserProfile(supabase);
  return profile.type !== null;
}

export async function canCreateProfile(supabase: TypedClient): Promise<{ canCreate: boolean; reason?: string }> {
  const { data: user } = await supabase.auth.getUser();
  if (!user || !user.user) {
    return { canCreate: false, reason: "User not authenticated" };
  }

  const existingProfile = await getUserProfile(supabase);
  
  if (existingProfile.type !== null) {
    return { 
      canCreate: false, 
      reason: `User already has a ${existingProfile.type} profile. Each user can only have one profile type.` 
    };
  }

  return { canCreate: true };
}
