import { ArtistTrackWithPlayCount } from "@/db/queries/tracks";
import { Database } from "@/utils/supabase/database.types";
import { Artist, Event, StoredLocality, Venue } from "@/utils/supabase/global.types";
import { Container } from "@mantine/core";
import EventsGrid from "../events/EventsGrid";
import { ProfileEntity, ProfileTab } from "./ProfileContent";
import { CollaboratorsGrid, MusicGrid } from "./index";

// Define types using database types and utility types following TYPE_USAGE guide
type EventWithVenue = Pick<Event, 'id' | 'name' | 'start' | 'hash' | 'poster_img'> & {
  venues?: Pick<Venue, 'id' | 'name' | 'address'> | null;
};

// For events that use 'date' instead of 'start' (legacy interface compatibility)  
type EventWithDate = Pick<Event, 'id' | 'name' | 'hash' | 'poster_img'> & {
  date: string | null;
  venues?: Pick<Venue, 'id' | 'name' | 'address'> | null;
};

type PromoterWithImages = Pick<Database['public']['Tables']['promoters']['Row'], 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

type ArtistWithImages = Pick<Artist, 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

type PopularTrack = {
  id: string;
  title: string;
  plays: number;
  artist?: Pick<Artist, 'id' | 'name'>;
};

/**
 * Transform artist data for ProfileContent component
 */
export function transformArtistData(
  artist: Artist,
  tracksWithPlayCounts: ArtistTrackWithPlayCount[],
  promoters: PromoterWithImages[] = [],
  events: EventWithVenue[] = [],
): {
  entity: ProfileEntity;
  tabs: ProfileTab[];
} {
  const entity: ProfileEntity = {
    id: artist.id,
    name: artist.name,
    bio: artist.bio,
    selectedFont: (artist as any).selectedFont,
  };

  // Transform data for shared components - preserve full track structure
  const musicTracks = tracksWithPlayCounts.map(track => ({
    id: track.id,
    title: track.title,
    plays: track.plays,
    artists: [{ id: artist.id, name: artist.name }] // Artist's own tracks
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
      content: <MusicGrid tracks={musicTracks} />
    },
    {
      key: "events",
      label: "Events",
      content: <EventsGrid events={events} />
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
  promoter: Pick<Database['public']['Tables']['promoters']['Row'], 'id' | 'name' | 'bio' | 'selectedFont' | 'user_id'>,
  upcomingEvents: EventWithDate[] = [],
  pastEvents: EventWithDate[] = [],
  artists: ArtistWithImages[] = [],
  popularTracks: PopularTrack[] = []
): {
  entity: ProfileEntity;
  tabs: ProfileTab[];
} {
  const entity: ProfileEntity = {
    id: promoter.id,
    name: promoter.name,
    bio: promoter.bio,
    selectedFont: promoter.selectedFont,
  };

  // Transform data for shared components
  const musicTracks = popularTracks.map(track => ({
    id: track.id,
    title: track.title,
    plays: track.plays || 0,
    artists: track.artist ? [{ id: track.artist.id, name: track.artist.name }] : []
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

  // Map events to EventWithVenue format (date -> start)
  const mapToEventWithVenue = (events: EventWithDate[]): EventWithVenue[] =>
    events.map(event => ({
      id: event.id,
      name: event.name,
      start: event.date,
      hash: event.hash,
      poster_img: event.poster_img,
      venues: event.venues ? {
        id: event.venues.id,
        name: event.venues.name,
        address: event.venues.address || null
      } : null
    }));

  const upcomingEventsForGrid = mapToEventWithVenue(upcomingEvents);
  const allEventsForGrid = mapToEventWithVenue(allEvents);

  // Define tabs content
  const tabs: ProfileTab[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <Container size="md">
          <MusicGrid
            tracks={musicTracks}
            title="Popular Tracks"
            maxItems={8}
          />
          <div style={{ marginTop: '2rem' }}>
            <EventsGrid events={upcomingEventsForGrid} />
          </div>
        </Container>
      )
    },
    {
      key: "events",
      label: "Events",
      content: <EventsGrid events={allEventsForGrid} />
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
