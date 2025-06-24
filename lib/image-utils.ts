import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";

/**
 * Get the avatar URL for an artist using the stored filename (client-side)
 * @param avatarFilename The filename stored in the artist table
 * @returns The public URL for the artist's avatar image
 */
export function getArtistAvatarUrl(avatarFilename: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(avatarFilename);
  
  return data.publicUrl;
}

/**
 * Get the banner URL for an artist using the stored filename (client-side)
 * @param bannerFilename The filename stored in the artist table
 * @returns The public URL for the artist's banner image
 */
export function getArtistBannerUrl(bannerFilename: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(`banners/${bannerFilename}`);
  
  return data.publicUrl;
}

/**
 * Get the avatar URL for an artist using the stored filename (server-side)
 * @param avatarFilename The filename stored in the artist table
 * @returns The public URL for the artist's avatar image or null if doesn't exist
 */
export async function getArtistAvatarUrlServer(avatarFilename: string): Promise<string | null> {
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
 * Get the banner URL for an artist using the stored filename (server-side)
 * @param bannerFilename The filename stored in the artist table
 * @returns The public URL for the artist's banner image or null if doesn't exist
 */
export async function getArtistBannerUrlServer(bannerFilename: string): Promise<string | null> {
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
export async function getArtistImagesServer(supabase: any, artistId: string): Promise<{
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
      ? await getArtistAvatarUrlServer(artist.avatar_img)
      : null;
    
    const bannerUrl = artist.banner_img 
      ? await getArtistBannerUrlServer(artist.banner_img)
      : null;

    return { avatarUrl, bannerUrl };
  } catch {
    return { avatarUrl: null, bannerUrl: null };
  }
}

/**
 * Get the avatar URL for a promoter using the stored filename (client-side)
 * @param avatarFilename The filename stored in the promoter table
 * @returns The public URL for the promoter's avatar image
 */
export function getPromoterAvatarUrl(avatarFilename: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(`avatars/${avatarFilename}`);
  
  return data.publicUrl;
}

/**
 * Get the banner URL for a promoter using the stored filename (client-side)
 * @param bannerFilename The filename stored in the promoter table
 * @returns The public URL for the promoter's banner image
 */
export function getPromoterBannerUrl(bannerFilename: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(`banners/${bannerFilename}`);
  
  return data.publicUrl;
}

/**
 * Get the avatar URL for a promoter using the stored filename (server-side)
 * @param avatarFilename The filename stored in the promoter table
 * @returns The public URL for the promoter's avatar image or null if doesn't exist
 */
export async function getPromoterAvatarUrlServer(avatarFilename: string): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    
    // Check if the file exists first
    const { data: fileData, error } = await supabase.storage
      .from("images")
      .list("avatars", {
        limit: 1,
        search: avatarFilename
      });
    
    if (error || !fileData || fileData.length === 0) {
      return null;
    }
    
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`avatars/${avatarFilename}`);
    
    return data.publicUrl;
  } catch {
    return null;
  }
}

/**
 * Get the banner URL for a promoter using the stored filename (server-side)
 * @param bannerFilename The filename stored in the promoter table
 * @returns The public URL for the promoter's banner image or null if doesn't exist
 */
export async function getPromoterBannerUrlServer(bannerFilename: string): Promise<string | null> {
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
 * Get promoter avatar and banner URLs from the database (server-side)
 * @param supabase Supabase client
 * @param promoterId The promoter ID
 * @returns Object with avatar and banner URLs or null if they don't exist
 */
export async function getPromoterImagesServer(supabase: any, promoterId: string): Promise<{
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
      ? await getPromoterAvatarUrlServer(promoter.avatar_img)
      : null;
    
    const bannerUrl = promoter.banner_img 
      ? await getPromoterBannerUrlServer(promoter.banner_img)
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
