"use client";

import {
  ProfileContent,
  transformPromoterData,
  transformPromoterLocalities
} from "@/components/shared";
import { Database } from "@/utils/supabase/database.types";
import { AdministrativeArea, Artist, Country, Event, Locality, Promoter, Venue } from "@/utils/supabase/global.types";

// Use database-first types as per TYPE_USAGE_GUIDE.md
type EventWithDate = Pick<Event, 'id' | 'name'> & {
  date: string | null;
  venues?: Pick<Venue, 'id' | 'name'> | null;
};

type ArtistWithImages = Pick<Artist, 'id' | 'name' | 'bio'> & {
  avatarUrl?: string | null;
  bannerUrl?: string | null;
};

type PopularTrack = Pick<Database['public']['Tables']['tracks']['Row'], 'id' | 'title'> & {
  plays: number;
  artist?: Pick<Artist, 'id' | 'name'>;
};

// Use database-first types for locality relationships as per TYPE_USAGE_GUIDE.md
type PromoterLocalityWithRelations = {
  localities: Pick<Locality, 'id' | 'name'> & {
    administrative_areas: Pick<AdministrativeArea, 'id' | 'name'> & {
      countries: Pick<Country, 'id' | 'name'>;
    };
  };
};

type CurrentUser = {
  id: string;
} | null;

interface PromoterProfileContentProps {
  promoter: Pick<Promoter, 'id' | 'name' | 'bio' | 'selectedFont' | 'user_id'> & {
    email?: string | null;
    phone?: string | null;
    promoters_localities?: PromoterLocalityWithRelations[];
  };
  upcomingEvents?: EventWithDate[];
  pastEvents?: EventWithDate[];
  artists?: ArtistWithImages[];
  popularTracks?: PopularTrack[];
  currentUser?: CurrentUser;
  promoterLocalities?: PromoterLocalityWithRelations[];
  avatarUrl: string | null;
  bannerUrl: string | null;
}

const PromoterProfileContent = ({
  promoter,
  upcomingEvents = [],
  pastEvents = [],
  artists = [],
  popularTracks = [],
  currentUser,
  promoterLocalities = [],
  avatarUrl,
  bannerUrl,
}: PromoterProfileContentProps) => {
  // Transform data using helper functions
  const { entity, tabs } = transformPromoterData(
    promoter,
    upcomingEvents,
    pastEvents,
    artists,
    popularTracks
  );

  const storedLocality = transformPromoterLocalities(promoterLocalities);

  // Check if the current user can edit this promoter profile
  const canEdit = currentUser?.id === promoter.user_id;

  return (
    <ProfileContent
      entity={entity}
      profileType="promoter"
      subtitle="Promoter & Collective"
      avatarUrl={avatarUrl}
      bannerUrl={bannerUrl}
      location={storedLocality}
      canEdit={canEdit}
      tabs={tabs}
      defaultActiveTab="overview"
      currentUser={currentUser}
    />
  );
};

export default PromoterProfileContent;
