import { Container } from "@mantine/core";
import { Artist, StoredLocality } from "@/utils/supabase/global.types";
import { ArtistTrackWithPlayCount } from "@/db/queries/tracks";
import { ProfileTab, ProfileEntity } from "./ProfileContent";
import { MusicGrid, EventsList, CollaboratorsGrid } from "./index";

/**
 * Transform artist data for ProfileContent component
 */
export function transformArtistData(
  artist: Artist,
  tracksWithPlayCounts: ArtistTrackWithPlayCount[],
  promoters: Array<{
    id: string;
    name: string;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  }> = [],
  events: Array<{
    id: string;
    name: string;
    date: string | null;
    venues?: {
      id: string;
      name: string;
    } | null;
  }> = []
): {
  entity: ProfileEntity;
  tabs: ProfileTab[];
} {
  const entity: ProfileEntity = {
    id: artist.id,
    name: artist.name,
    bio: artist.bio,
    selectedFont: (artist as any).selectedFont,
    user_id: artist.user_id,
  };

  // Transform data for shared components
  const musicTracks = tracksWithPlayCounts.map(track => ({
    id: track.id,
    title: track.title,
    plays: track.plays
  }));

  const collaborators = promoters.map(promoter => ({
    id: promoter.id,
    name: promoter.name,
    bio: promoter.bio,
    avatarUrl: promoter.avatarUrl,
    bannerUrl: promoter.bannerUrl,
    type: "Promoter"
  }));

  // Define tabs content
  const tabs: ProfileTab[] = [
    {
      key: "music",
      label: "Music",
      content: <MusicGrid tracks={musicTracks} artistName={artist.name} />
    },
    {
      key: "events", 
      label: "Events",
      content: <EventsList events={events} artistName={artist.name} />
    },
    {
      key: "collaborations",
      label: "Collectives", 
      content: <CollaboratorsGrid collaborators={collaborators} />
    }
  ];

  return { entity, tabs };
}

/**
 * Transform promoter data for ProfileContent component
 */
export function transformPromoterData(
  promoter: {
    id: string;
    name: string;
    bio?: string | null;
    selectedFont?: string | null;
    user_id: string;
  },
  upcomingEvents: Array<{
    id: string;
    name: string;
    date: string | null;
    venues?: {
      id: string;
      name: string;
    } | null;
  }> = [],
  pastEvents: Array<{
    id: string;
    name: string;
    date: string | null;
    venues?: {
      id: string;
      name: string;
    } | null;
  }> = [],
  artists: Array<{
    id: string;
    name: string;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  }> = [],
  popularTracks: Array<{
    id: string;
    title: string;
    plays: number;
    artists?: {
      name: string;
    };
  }> = []
): {
  entity: ProfileEntity;
  tabs: ProfileTab[];
} {
  const entity: ProfileEntity = {
    id: promoter.id,
    name: promoter.name,
    bio: promoter.bio,
    selectedFont: promoter.selectedFont,
    user_id: promoter.user_id,
  };

  // Transform data for shared components
  const musicTracks = popularTracks.map(track => ({
    id: track.id,
    title: track.title,
    plays: track.plays || 0
  }));

  const collaborators = artists.map(artist => ({
    id: artist.id,
    name: artist.name,
    bio: artist.bio,
    avatarUrl: artist.avatarUrl,
    bannerUrl: artist.bannerUrl,
    type: "Artist"
  }));

  // All events (upcoming + past)
  const allEvents = [...upcomingEvents, ...pastEvents];

  // Define tabs content
  const tabs: ProfileTab[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <Container size="md">
          <MusicGrid 
            tracks={musicTracks} 
            artistName={promoter.name}
            title="Popular Tracks"
            maxItems={8}
          />
          <div style={{ marginTop: '2rem' }}>
            <EventsList 
              events={upcomingEvents}
              title="Upcoming Events"
              emptyStateMessage="No upcoming events scheduled."
            />
          </div>
        </Container>
      )
    },
    {
      key: "events", 
      label: "Events",
      content: <EventsList events={allEvents} title="All Events" />
    },
    {
      key: "artists",
      label: "Artists", 
      content: (
        <CollaboratorsGrid 
          collaborators={collaborators}
          title="Artists & Performers"
          emptyStateMessage="No artists found yet."
          basePath="/artists"
          cardType="Artist"
        />
      )
    },
    {
      key: "music",
      label: "Music",
      content: (
        <MusicGrid 
          tracks={musicTracks} 
          artistName={promoter.name}
          title="Popular Tracks"
        />
      )
    }
  ];

  return { entity, tabs };
}

/**
 * Transform promoter localities to StoredLocality
 */
export function transformPromoterLocalities(
  promoterLocalities: Array<{
    localities: {
      id: string;
      name: string;
      administrative_areas: {
        id: string;
        name: string;
        countries: {
          id: string;
          name: string;
        };
      };
    };
  }>
): StoredLocality | undefined {
  if (promoterLocalities.length === 0 || !promoterLocalities[0].localities) {
    return undefined;
  }

  const locality = promoterLocalities[0].localities;
  return {
    locality: {
      id: locality.id,
      name: locality.name,
      administrative_area_id: locality.administrative_areas.id,
      country_id: locality.administrative_areas.countries.id,
      created_at: '',
    },
    administrativeArea: {
      id: locality.administrative_areas.id,
      name: locality.administrative_areas.name,
      country_id: locality.administrative_areas.countries.id,
      created_at: '',
    },
    country: {
      id: locality.administrative_areas.countries.id,
      name: locality.administrative_areas.countries.name,
      created_at: '',
    }
  };
}
