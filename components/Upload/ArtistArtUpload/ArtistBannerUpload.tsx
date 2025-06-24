"use client";

import { createClient } from "@/utils/supabase/client";
import { BannerUpload, BannerUploadConfig } from "../BannerUpload";

export interface IArtistBannerUploadProps {
  artistId?: string;
  onBannerUploaded?: (url: string) => void;
}

const artistBannerConfig: BannerUploadConfig = {
  storageBucket: "images",
  storageFolder: "banners",
  title: "Banner Image",
  description: "Upload a banner image for your artist profile",
};

async function fetchArtistBanner(artistId: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data: artist, error } = await supabase
    .from("artists")
    .select("banner_img")
    .eq("id", artistId)
    .single();

  if (error) {
    console.error("Error fetching artist banner:", error);
    return null;
  }

  return artist?.banner_img || null;
}

async function updateArtistBanner(artistId: string, filename: string | null): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("artists")
    .update({ banner_img: filename })
    .eq("id", artistId);

  if (error) {
    throw new Error(`Failed to update artist banner: ${error.message}`);
  }
}

export function ArtistBannerUpload({
  artistId,
  onBannerUploaded,
}: IArtistBannerUploadProps) {
  return (
    <BannerUpload
      entityId={artistId}
      config={artistBannerConfig}
      fetchExistingBanner={fetchArtistBanner}
      updateEntityBanner={updateArtistBanner}
      onBannerUploaded={onBannerUploaded}
    />
  );
}
