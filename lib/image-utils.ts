import { createClient } from "@/utils/supabase/client";
import { createClient as createServerClient } from "@/utils/supabase/server";

// Default fallback images
export const DEFAULT_AVATAR_URL = "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop&crop=face";
export const DEFAULT_BANNER_URL = "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?w=1200&h=400&fit=crop";

/**
 * Get the avatar URL for an artist (client-side)
 * @param artistId The ID of the artist
 * @returns The public URL for the artist's avatar image
 */
export function getArtistAvatarUrl(artistId: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(artistId);
  
  return data.publicUrl;
}

/**
 * Get the banner URL for an artist (client-side)
 * @param artistId The ID of the artist
 * @returns The public URL for the artist's banner image
 */
export function getArtistBannerUrl(artistId: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(`banners/${artistId}`);
  
  return data.publicUrl;
}

/**
 * Get the avatar URL for an artist (server-side)
 * @param artistId The ID of the artist
 * @returns The public URL for the artist's avatar image or null if doesn't exist
 */
export async function getArtistAvatarUrlServer(artistId: string): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    
    // Check if the file exists first
    const { data: fileData, error } = await supabase.storage
      .from("avatars")
      .list("", {
        limit: 1,
        search: artistId
      });
    
    if (error || !fileData || fileData.length === 0) {
      return null;
    }
    
    const { data } = supabase.storage
      .from("avatars")
      .getPublicUrl(artistId);
    
    return data.publicUrl;
  } catch {
    return null;
  }
}

/**
 * Get the banner URL for an artist (server-side)
 * @param artistId The ID of the artist
 * @returns The public URL for the artist's banner image or null if doesn't exist
 */
export async function getArtistBannerUrlServer(artistId: string): Promise<string | null> {
  try {
    const supabase = await createServerClient();
    
    // Check if the file exists first
    const { data: fileData, error } = await supabase.storage
      .from("images")
      .list("banners", {
        limit: 1,
        search: artistId
      });
    
    if (error || !fileData || fileData.length === 0) {
      return null;
    }
    
    const { data } = supabase.storage
      .from("images")
      .getPublicUrl(`banners/${artistId}`);
    
    return data.publicUrl;
  } catch {
    return null;
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
