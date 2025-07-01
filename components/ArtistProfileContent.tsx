"use client";

import { Artist, StoredLocality } from "@/utils/supabase/global.types";
import { ArtistTrackWithPlayCount } from "@/db/queries/tracks";
import { 
  ProfileContent,
  transformArtistData
} from "@/components/shared";

interface ArtistProfileContentProps {
  artist: Artist;
  storedLocality?: StoredLocality;
  canEdit: boolean;
  tracksWithPlayCounts: ArtistTrackWithPlayCount[];
  avatarUrl: string | null;
  bannerUrl: string | null;
  promoters?: Array<{
    id: string;
    name: string;
    bio?: string | null;
    avatar_img?: string | null;
    banner_img?: string | null;
    selectedFont?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  }>;
  events?: Array<{
    id: string;
    name: string;
    date: string | null;
    venues?: {
      id: string;
      name: string;
    } | null;
  }>;
}

const ArtistProfileContent = ({
  artist,
  storedLocality,
  canEdit,
  tracksWithPlayCounts,
  avatarUrl,
  bannerUrl,
  promoters = [],
  events = [],
}: ArtistProfileContentProps) => {
  // Transform data using the helper function
  const { entity, tabs } = transformArtistData(
    artist,
    tracksWithPlayCounts,
    promoters,
    events
  );

  return (
    <ProfileContent
      entity={entity}
      profileType="artist"
      avatarUrl={avatarUrl}
      bannerUrl={bannerUrl}
      location={storedLocality}
      externalLinks={artist.external_links || undefined}
      canEdit={canEdit}
      tabs={tabs}
      defaultActiveTab="music"
    />
  );
};

export default ArtistProfileContent;
