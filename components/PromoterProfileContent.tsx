"use client";

import { StoredLocality } from "@/utils/supabase/global.types";
import { 
  ProfileContent,
  transformPromoterData,
  transformPromoterLocalities
} from "@/components/shared";

interface PromoterProfileContentProps {
  promoter: {
    id: string;
    name: string;
    bio?: string | null;
    email?: string | null;
    phone?: string | null;
    selectedFont?: string | null;
    user_id: string;
    promoters_localities?: Array<{
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
    }>;
  };
  upcomingEvents?: Array<{
    id: string;
    name: string;
    date: string | null;
    venues?: {
      id: string;
      name: string;
    } | null;
  }>;
  pastEvents?: Array<{
    id: string;
    name: string;
    date: string | null;
    venues?: {
      id: string;
      name: string;
    } | null;
  }>;
  artists?: Array<{
    id: string;
    name: string;
    bio?: string | null;
    avatarUrl?: string | null;
    bannerUrl?: string | null;
  }>;
  popularTracks?: Array<{
    id: string;
    title: string;
    plays: number;
    artist?: {
      id: string;
      name: string;
    };
  }>;
  currentUser?: { id: string } | null;
  promoterLocalities?: Array<{
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
  }>;
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
