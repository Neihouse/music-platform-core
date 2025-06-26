import { createClient } from "@/utils/supabase/client";

/**
 * Get the avatar URL using the stored filename (client-side)
 * @param avatarFilename The filename stored in the entity table
 * @returns The public URL for the avatar image
 */
export function getAvatarUrl(avatarFilename: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("avatars")
    .getPublicUrl(avatarFilename);
  
  return data.publicUrl;
}

/**
 * Get the banner URL using the stored filename (client-side)
 * @param bannerFilename The filename stored in the entity table
 * @returns The public URL for the banner image
 */
export function getBannerUrl(bannerFilename: string): string {
  const supabase = createClient();
  const { data } = supabase.storage
    .from("images")
    .getPublicUrl(`banners/${bannerFilename}`);
  
  return data.publicUrl;
}

/**
 * Get the banner URL for an artist using the stored filename (client-side)
 * @param bannerFilename The filename stored in the artist table
 * @returns The public URL for the artist's banner image
 * @deprecated Use getBannerUrl instead
 */
export function getArtistBannerUrl(bannerFilename: string): string {
  return getBannerUrl(bannerFilename);
}

/**
 * Get the banner URL for a promoter using the stored filename (client-side)
 * @param bannerFilename The filename stored in the promoter table
 * @returns The public URL for the promoter's banner image
 * @deprecated Use getBannerUrl instead
 */
export function getPromoterBannerUrl(bannerFilename: string): string {
  return getBannerUrl(bannerFilename);
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
