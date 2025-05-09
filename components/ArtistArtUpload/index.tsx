"use client";

import { ArtistBannerUpload } from "./ArtistBannerUpload";
import { ArtistAvatarUpload } from "./ArtistAvatarUpload";
import { Stack, Group } from "@mantine/core";

export interface IArtistArtUploadProps {
  artistId?: string;
  onBannerUploaded?: (url: string) => void;
  onAvatarUploaded?: (url: string) => void;
}

export function ArtistArtUpload({
  artistId,
  onBannerUploaded,
  onAvatarUploaded,
}: IArtistArtUploadProps) {
  return (
    <Stack gap="lg">
      <ArtistBannerUpload
        artistId={artistId}
        onBannerUploaded={onBannerUploaded}
      />
      <ArtistAvatarUpload
        artistId={artistId}
        onAvatarUploaded={onAvatarUploaded}
      />
    </Stack>
  );
}
