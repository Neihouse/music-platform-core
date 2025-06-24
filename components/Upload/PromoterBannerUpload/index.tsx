"use client";

import { createClient } from "@/utils/supabase/client";
import { BannerUpload, BannerUploadConfig } from "../BannerUpload";

export interface IPromoterBannerUploadProps {
  promoterId?: string;
  onBannerUploaded?: (url: string) => void;
}

const promoterBannerConfig: BannerUploadConfig = {
  storageBucket: "images",
  storageFolder: "banners",
  title: "Banner Image",
  description: "Upload a banner image for your promoter profile",
};

async function fetchPromoterBanner(promoterId: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("banner_img")
    .eq("id", promoterId)
    .single();

  if (error) {
    console.error("Error fetching promoter banner:", error);
    return null;
  }

  return promoter?.banner_img || null;
}

async function updatePromoterBanner(promoterId: string, filename: string | null): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("promoters")
    .update({ banner_img: filename })
    .eq("id", promoterId);

  if (error) {
    throw new Error(`Failed to update promoter banner: ${error.message}`);
  }
}

export function PromoterBannerUpload({
  promoterId,
  onBannerUploaded,
}: IPromoterBannerUploadProps) {
  return (
    <BannerUpload
      entityId={promoterId}
      config={promoterBannerConfig}
      fetchExistingBanner={fetchPromoterBanner}
      updateEntityBanner={updatePromoterBanner}
      onBannerUploaded={onBannerUploaded}
    />
  );
}
