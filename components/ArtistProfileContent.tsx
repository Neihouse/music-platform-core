"use client";

import {
  ProfileContent,
  transformArtistData
} from "@/components/shared";
import { ArtistTrackWithPlayCount } from "@/db/queries/tracks";
import { 
  Artist, 
  Event, 
  StoredLocality, 
  Venue,
  EventWithDate,
  PromoterWithImages
} from "@/utils/supabase/global.types";

interface ArtistProfileContentProps {
  artist: Artist;
  storedLocality?: StoredLocality;
  canEdit: boolean;
  tracksWithPlayCounts: ArtistTrackWithPlayCount[];
  avatarUrl: string | null;
  bannerUrl: string | null;
  promoters?: PromoterWithImages[];
  events?: EventWithDate[];
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
  // Map events from EventWithDate to EventWithVenue format
  const eventsWithVenue = events.map(event => ({
    id: event.id,
    name: event.name,
    start: event.date, // Map date to start
    hash: event.hash,
    poster_img: event.poster_img,
    venues: event.venues
  }));

  // Transform data using the helper function
  const { entity, tabs } = transformArtistData(
    artist,
    tracksWithPlayCounts,
    promoters,
    eventsWithVenue
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
