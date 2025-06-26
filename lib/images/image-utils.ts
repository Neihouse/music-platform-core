import { TypedClient } from "@/utils/supabase/global.types";
import { createClient as createServerClient } from "@/utils/supabase/server";

/**
 * Get the avatar URL using the stored filename (server-side)
 * @param avatarFilename The filename stored in the entity table
 * @returns The public URL for the avatar image or null if doesn't exist
 */
export async function getAvatarUrlServer(avatarFilename: string): Promise<string | null> {

  try {
    const supabase = await createServerClient();
    
    // Check if the file exists first
    const { data: fileData, error } = await supabase.storage
      .from("avatars")
      .list("", {
        limit: 1,
        search: avatarFilename
      });
    
    if (error || !fileData || fileData.length === 0) {
      return null;
    }
    
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(avatarFilename);
    
    return data.publicUrl;
  } catch {
    return null;
  }
}

/**
 * Get the banner URL using the stored filename (server-side)
 * @param bannerFilename The filename stored in the entity table
 * @returns The public URL for the banner image or null if doesn't exist
 */
export async function getBannerUrlServer(bannerFilename: string): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    
    // Check if the file exists first
    const { data: fileData, error } = await supabase.storage
      .from("images")
      .list("banners", {
        limit: 1,
        search: bannerFilename
      });
    
    if (error || !fileData || fileData.length === 0) {
      return null;
    }
    
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`banners/${bannerFilename}`);
    
    return data.publicUrl;
  } catch {
    return null;
  }
}

/**
 * Get artist avatar and banner URLs from the database (server-side)
 * @param supabase Supabase client
 * @param artistId The artist ID
 * @returns Object with avatar and banner URLs or null if they don't exist
 */
export async function getArtistImagesServer(supabase: TypedClient, artistId: string): Promise<{
  avatarUrl: string | null;
  bannerUrl: string | null;
}> {
  try {
    const { data: artist, error } = await supabase
      .from("artists")
      .select("avatar_img, banner_img")
      .eq("id", artistId)
      .single();

    if (error || !artist) {
      return { avatarUrl: null, bannerUrl: null };
    }

    const avatarUrl = artist.avatar_img 
      ? await getAvatarUrlServer(artist.avatar_img)
      : null;
    
    const bannerUrl = artist.banner_img 
      ? await getBannerUrlServer(artist.banner_img)
      : null;

    return { avatarUrl, bannerUrl };
  } catch {
    return { avatarUrl: null, bannerUrl: null };
  }
}


/**
 * Get promoter avatar and banner URLs from the database (server-side)
 * @param supabase Supabase client
 * @param promoterId The promoter ID
 * @returns Object with avatar and banner URLs or null if they don't exist
 */
export async function getPromoterImagesServer(supabase: TypedClient, promoterId: string): Promise<{
  avatarUrl: string | null;
  bannerUrl: string | null;
}> {
  try {
    const { data: promoter, error } = await supabase
      .from("promoters")
      .select("avatar_img, banner_img")
      .eq("id", promoterId)
      .single();

    if (error || !promoter) {
      return { avatarUrl: null, bannerUrl: null };
    }

    const avatarUrl = promoter.avatar_img 
      ? await getAvatarUrlServer(promoter.avatar_img)
      : null;
    
    const bannerUrl = promoter.banner_img 
      ? await getBannerUrlServer(promoter.banner_img)
      : null;

    return { avatarUrl, bannerUrl };
  } catch {
    return { avatarUrl: null, bannerUrl: null };
  }
}

/**
 * Check if an image exists by attempting to fetch it
 * @param url The URL to check
 * @returns Promise that resolves to true if the image exists, false otherwise
 */
export async function imageExists(url: string): Promise<boolean> {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
}
