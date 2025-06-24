"use client";

import { AvatarUpload, AvatarUploadConfig } from "@/components/Upload/AvatarUpload";
import { createClient } from "@/utils/supabase/client";
import * as React from "react";

export interface IArtistAvatarUploadProps {
  /** The artist ID */
  artistId?: string;
  /** Callback when avatar is uploaded */
  onAvatarUploaded?: (url: string) => void;
}

const artistAvatarConfig: AvatarUploadConfig = {
  storageBucket: "avatars",
  storageFolder: "",
  title: "Profile Picture",
  description: "Upload a profile picture for your artist account",
  avatarSize: 150,
  maxFileSize: 2 * 1024 * 1024, // 2MB
};

async function fetchArtistAvatar(artistId: string): Promise<string | null> {
  const supabase = await createClient();

  const { data: artist, error } = await supabase
    .from("artists")
    .select("avatar_img")
    .eq("id", artistId)
    .single();

  if (error) {
    console.error("Error fetching artist avatar:", error);
    return null;
  }

  return artist?.avatar_img || null;
}

async function updateArtistAvatar(artistId: string, filename: string | null): Promise<void> {
  const supabase = await createClient();

  const { error } = await supabase
    .from("artists")
    .update({ avatar_img: filename })
    .eq("id", artistId);

  if (error) {
    throw new Error(`Failed to update artist avatar: ${error.message}`);
  }
}

export function ArtistAvatarUpload({
  artistId,
  onAvatarUploaded,
}: IArtistAvatarUploadProps) {
  return (
    <AvatarUpload
      entityId={artistId}
      config={artistAvatarConfig}
      fetchExistingAvatar={fetchArtistAvatar}
      updateEntityAvatar={updateArtistAvatar}
      onAvatarUploaded={onAvatarUploaded}
    />
  );
}
