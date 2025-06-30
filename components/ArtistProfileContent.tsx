"use client";

import { Box, Container } from "@mantine/core";
import { useEffect, useState } from "react";
import { nameToUrl } from "@/lib/utils";
import { Artist, StoredLocality } from "@/utils/supabase/global.types";
import { ArtistTrackWithPlayCount } from "@/db/queries/tracks";
import { 
  HeroSection, 
  ProfileHeader, 
  ContentTabs, 
  MusicGrid, 
  EventsList, 
  CollaboratorsGrid 
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
  const { name, bio, external_links } = artist;
  const [activeTab, setActiveTab] = useState<string | null>("music");
  const [scrollProgress, setScrollProgress] = useState(0);

  // Load the artist's selected font - simplified approach
  useEffect(() => {
    const selectedFont = (artist as any).selectedFont;
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
  }, [artist]);

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
  const tabs = [
    {
      key: "music",
      label: "Music",
      content: <MusicGrid tracks={musicTracks} artistName={name} />
    },
    {
      key: "events", 
      label: "Events",
      content: <EventsList events={events} artistName={name} />
    },
    {
      key: "collaborations",
      label: "Collectives", 
      content: <CollaboratorsGrid collaborators={collaborators} />
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

      {/* Artist Profile Section */}
      <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
        <ProfileHeader
          name={name}
          bio={bio}
          avatarUrl={avatarUrl}
          scrollProgress={scrollProgress}
          location={storedLocality}
          externalLinks={external_links || undefined}
          canEdit={canEdit}
          editHref={`/artists/${nameToUrl(name)}/edit`}
          selectedFont={artist.selectedFont}
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

export default ArtistProfileContent;
