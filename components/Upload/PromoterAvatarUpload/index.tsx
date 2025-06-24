"use client";

import { AvatarUpload, AvatarUploadConfig } from "@/components/Upload/AvatarUpload";
import { createClient } from "@/utils/supabase/client";
import * as React from "react";

export interface IPromoterAvatarUploadProps {
  /** The promoter ID */
  promoterId?: string;
  /** Callback when avatar is uploaded */
  onAvatarUploaded?: (url: string) => void;
}

const promoterAvatarConfig: AvatarUploadConfig = {
  storageBucket: "images",
  storageFolder: "avatars",
  title: "Profile Picture",
  description: "Upload a profile picture for your promoter account",
  avatarSize: 150,
  maxFileSize: 2 * 1024 * 1024, // 2MB
};

async function fetchPromoterAvatar(promoterId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("avatar_img")
    .eq("id", promoterId)
    .single();

  if (error) {
    console.error("Error fetching promoter avatar:", error);
    return null;
  }

  return promoter?.avatar_img || null;
}

async function updatePromoterAvatar(promoterId: string, filename: string | null): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("promoters")
    .update({ avatar_img: filename })
    .eq("id", promoterId);

  if (error) {
    throw new Error(`Failed to update promoter avatar: ${error.message}`);
  }
}

export function PromoterAvatarUpload({
  promoterId,
  onAvatarUploaded,
}: IPromoterAvatarUploadProps) {
  return (
    <AvatarUpload
      entityId={promoterId}
      config={promoterAvatarConfig}
      fetchExistingAvatar={fetchPromoterAvatar}
      updateEntityAvatar={updatePromoterAvatar}
      onAvatarUploaded={onAvatarUploaded}
    />
  );
}
