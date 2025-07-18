import { SupabaseClient } from "@supabase/supabase-js";
import { Database } from "./database.types";

export type TypedClient = SupabaseClient<Database>;
type Public = Database["public"]["Tables"];
export type Track = Public["tracks"]["Row"];
export type Artist = Public["artists"]["Row"];
export type ArtistsLocality = Public["artists_localities"]["Row"];
export type Locality = Public["localities"]["Row"];
export type AdministrativeArea = Public["administrative_areas"]["Row"];
export type Country = Public["countries"]["Row"];
export type Promoter = Public["promoters"]["Row"];
export type PromotersLocality = Public["promoters_localities"]["Row"];
export type Event = Public["events"]["Row"];
export type Venue = Public["venues"]["Row"];
export type EventStage = Public["event_stage"]["Row"];
export type EventStageArtist = Public["event_stage_artists"]["Row"];

export type StoredLocality = {
    locality: Locality;
    administrativeArea: AdministrativeArea;
    country: Country;
    fullAddress?: string; // Optional full formatted address
}

// Shared event types following database-first approach
export type EventWithVenue = Pick<Event, 'id' | 'name' | 'start' | 'hash' | 'poster_img'> & {
  venues?: Pick<Venue, 'id' | 'name' | 'address'> | null;
};

export type EventWithDate = Pick<Event, 'id' | 'name' | 'hash' | 'poster_img'> & {
  date: string | null;
  venues?: Pick<Venue, 'id' | 'name' | 'address'> | null;
};

// Shared artist types
export type ArtistWithImages = Pick<Artist, 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

export type PromoterWithImages = Pick<Promoter, 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

// Popular track type
export type PopularTrack = Pick<Track, 'id' | 'title'> & {
  plays: number;
  duration?: number;
  artist?: Pick<Artist, 'id' | 'name' | 'avatar_img'>;
};
