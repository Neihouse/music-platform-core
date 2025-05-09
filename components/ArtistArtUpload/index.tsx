"use client";

import { ArtistBannerUpload } from "./ArtistBannerUpload";

export interface IArtistArtUploadProps {
  artistId?: string;
  onBannerUploaded?: (url: string) => void;
}

export function ArtistArtUpload({
  artistId,
  onBannerUploaded,
}: IArtistArtUploadProps) {
  return (
    <div>
      <ArtistBannerUpload
        artistId={artistId}
        onBannerUploaded={onBannerUploaded}
      />
    </div>
  );
}
