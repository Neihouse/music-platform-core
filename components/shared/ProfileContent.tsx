"use client";

import { Box, Container } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { useEffect, useState, ReactNode } from "react";
import { nameToUrl } from "@/lib/utils";
import { StoredLocality } from "@/utils/supabase/global.types";
import { 
  HeroSection, 
  ProfileHeader, 
  ContentTabs 
} from "@/components/shared";

export interface ProfileTab {
  key: string;
  label: string;
  content: ReactNode;
}

export interface ProfileEntity {
  id: string;
  name: string;
  bio?: string | null;
  selectedFont?: string | null;
}

export interface ProfileContentProps {
  /** The main entity (artist, promoter, etc.) */
  entity: ProfileEntity;
  /** The profile type for context */
  profileType: "artist" | "promoter" | "venue" | "fan";
  /** Optional subtitle for the profile */
  subtitle?: string;
  /** Avatar image URL */
  avatarUrl: string | null;
  /** Banner image URL */
  bannerUrl: string | null;
  /** Location information */
  location?: StoredLocality;
  /** External links (for artists) */
  externalLinks?: any;
  /** Whether the current user can edit this profile */
  canEdit: boolean;
  /** The edit URL path */
  editPath?: string;
  /** Array of tabs to display */
  tabs: ProfileTab[];
  /** Default active tab key */
  defaultActiveTab?: string;
  /** Current user for permission checks */
  currentUser?: { id: string } | null;
}

const ProfileContent = ({
  entity,
  profileType,
  subtitle,
  avatarUrl,
  bannerUrl,
  location,
  externalLinks,
  canEdit,
  editPath,
  tabs,
  defaultActiveTab,
}: ProfileContentProps) => {
  const { name, bio, selectedFont } = entity;
  const [activeTab, setActiveTab] = useState<string | null>(
    defaultActiveTab || (tabs.length > 0 ? tabs[0].key : null)
  );
  const [scrollProgress, setScrollProgress] = useState(0);
  const isMobile = useMediaQuery('(max-width: 768px)');

  // Load the entity's selected font
  useEffect(() => {
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
  }, [selectedFont]);

  // Handle scroll for smooth transitions
  useEffect(() => {
    // Don't add scroll listener on mobile devices
    if (isMobile) {
      return;
    }

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
  }, [isMobile]);

  // Generate edit href based on profile type and entity name
  const generateEditHref = () => {
    if (editPath) return editPath;
    
    const baseUrl = `/${profileType}s/${nameToUrl(name)}`;
    return `${baseUrl}/edit`;
  };

  return (
    <Box 
      style={{
        background: 'var(--mantine-color-dark-9)',
        minHeight: '100vh',
        color: 'var(--mantine-color-gray-0)',
        margin: 0, // Remove negative margins that cause overflow
        width: '100%',
        maxWidth: '100vw',
        position: 'relative',
        overflowX: 'hidden'
      }}
    >
      {/* Hero Section */}
      <HeroSection bannerUrl={bannerUrl} title={name} />

      {/* Profile Section */}
      <Container size="lg" style={{ position: 'relative', zIndex: 10 }}>
        <ProfileHeader
          name={name}
          subtitle={subtitle}
          bio={bio}
          avatarUrl={avatarUrl}
          scrollProgress={scrollProgress}
          location={location}
          externalLinks={externalLinks}
          canEdit={canEdit}
          editHref={generateEditHref()}
          selectedFont={selectedFont}
        />

        {/* Content Tabs */}
        {tabs.length > 0 && (
          <ContentTabs 
            tabs={tabs}
            activeTab={activeTab}
            onTabChange={setActiveTab}
          />
        )}
      </Container>

      {/* Add bottom spacing */}
      <div style={{ height: '4rem' }} />
    </Box>
  );
};

export default ProfileContent;
