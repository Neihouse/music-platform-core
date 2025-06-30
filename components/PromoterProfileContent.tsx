"use client";

import { Box, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { nameToUrl } from "@/lib/utils";
import { StoredLocality } from "@/utils/supabase/global.types";
import { 
  HeroSection, 
  ProfileHeader, 
  ContentTabs, 
  MusicGrid, 
  EventsList, 
  CollaboratorsGrid 
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
    artists?: {
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
  const { name, bio } = promoter;
  const [activeTab, setActiveTab] = useState<string | null>("overview");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load the promoter's selected font - simplified approach
  useEffect(() => {
    const selectedFont = promoter.selectedFont;
    if (selectedFont) {
      const fontName = selectedFont.replace(/ /g, '+');
      
      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href*="${fontName}"]`);
      if (!existingLink) {
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
    }
  }, [promoter]);

  // Handle scroll for smooth transitions
  useEffect(() => {
    const handleScroll = () => {
      const scrollStart = 200; // When to start the transition
      const scrollEnd = 400; // When to complete the transition
      const scrollY = window.scrollY;
      
      // Calculate progress from 0 to 1
      const progress = Math.min(Math.max((scrollY - scrollStart) / (scrollEnd - scrollStart), 0), 1);
      setScrollProgress(progress);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

  // Create StoredLocality from the first locality (if available)
  const storedLocality: StoredLocality | undefined = promoterLocalities.length > 0 && promoterLocalities[0].localities ? {
    locality: {
      id: promoterLocalities[0].localities.id,
      name: promoterLocalities[0].localities.name,
      administrative_area_id: promoterLocalities[0].localities.administrative_areas.id,
      country_id: promoterLocalities[0].localities.administrative_areas.countries.id,
      created_at: '',
    },
    administrativeArea: {
      id: promoterLocalities[0].localities.administrative_areas.id,
      name: promoterLocalities[0].localities.administrative_areas.name,
      country_id: promoterLocalities[0].localities.administrative_areas.countries.id,
      created_at: '',
    },
    country: {
      id: promoterLocalities[0].localities.administrative_areas.countries.id,
      name: promoterLocalities[0].localities.administrative_areas.countries.name,
      created_at: '',
    }
  } : undefined;

  // Check if the current user can edit this promoter profile
  const canEdit = currentUser?.id === promoter.user_id;

  // Define tabs content
  const tabs = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <Container size="md">
          <MusicGrid 
            tracks={musicTracks} 
            artistName={name}
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
          artistName={name}
          title="Popular Tracks"
        />
      )
    }
  ];

  return (
    <Box 
      style={{
        background: 'var(--mantine-color-dark-9)',
        minHeight: '100vh',
        color: 'var(--mantine-color-gray-0)',
        margin: '-1.5rem -1rem', // Remove container padding
        width: 'calc(100% + 2rem)', // Compensate for removed margins
        position: 'relative',
      }}
    >
      {/* Hero Section */}
      <HeroSection bannerUrl={bannerUrl} title={name} />

      {/* Promoter Profile Section */}
      <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
        <ProfileHeader
          name={name}
          subtitle="Promoter & Collective"
          bio={bio}
          avatarUrl={avatarUrl}
          scrollProgress={scrollProgress}
          location={storedLocality}
          canEdit={canEdit}
          editHref={`/promoters/${nameToUrl(name)}/edit`}
          selectedFont={promoter.selectedFont}
        />

        {/* Content Tabs */}
        <ContentTabs 
          tabs={tabs}
          activeTab={activeTab}
          onTabChange={setActiveTab}
        />
      </Container>

      {/* Add bottom spacing */}
      <div style={{ height: '4rem' }} />
    </Box>
  );
};

export default PromoterProfileContent;
