"use client";

import { Grid, GridCol, Stack } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { ArtistAvatarUpload } from "./ArtistAvatarUpload";
import { ArtistBannerUpload } from "./ArtistBannerUpload";

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
  const isMobile = useMediaQuery('(max-width: 768px)');

  if (isMobile) {
    // Mobile: Stack vertically
    return (
      <Stack gap="xl">
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

  // Desktop: Side by side with better spacing
  return (
    <Grid gutter="xl">
      <GridCol span={12}>
        <ArtistBannerUpload
          artistId={artistId}
          onBannerUploaded={onBannerUploaded}
        />
      </GridCol>
      <GridCol span={12}>
        <ArtistAvatarUpload
          artistId={artistId}
          onAvatarUploaded={onAvatarUploaded}
        />
      </GridCol>
    </Grid>
  );
}
