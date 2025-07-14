"use client";

import { ExternalLinksDisplay } from "@/components/ExternalLinksDisplay";
import StyledTitle from "@/components/StyledTitle";
import { StoredLocality } from "@/utils/supabase/global.types";
import { Avatar, Button, Group, Stack, Text } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconEdit, IconMapPin } from "@tabler/icons-react";
import Link from "next/link";

interface ProfileHeaderProps {
  name: string;
  subtitle?: string;
  bio?: string | null;
  avatarUrl: string | null;
  scrollProgress: number;
  location?: StoredLocality;
  externalLinks?: any[];
  canEdit?: boolean;
  editHref?: string;
  selectedFont?: string | null;
}

const ProfileHeader = ({
  name,
  bio,
  avatarUrl,
  scrollProgress,
  location,
  externalLinks,
  canEdit = false,
  editHref,
  selectedFont
}: ProfileHeaderProps) => {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <Stack align="center" gap="md" style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
      {/* Placeholder for avatar when it becomes fixed */}
      {scrollProgress > 0 && !isMobile && (
        <div style={{ width: '192px', height: '192px' }} />
      )}
      <Avatar
        src={avatarUrl}
        alt={`${name} avatar`}
        size={192}
        style={{
          border: '4px solid var(--mantine-color-dark-9)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          position: scrollProgress > 0 && !isMobile ? 'fixed' : 'static',
          top: scrollProgress > 0 && !isMobile ? `${80 + (1 - scrollProgress) * 200}px` : 'auto',
          left: scrollProgress > 0 && !isMobile ? `${2 + (1 - scrollProgress) * 20}rem` : 'auto',
          zIndex: scrollProgress > 0 && !isMobile ? 101 : 'auto',
          transform: !isMobile ? `scale(${1 - scrollProgress * 0.65})` : 'none',
          transformOrigin: 'top left',
          transition: scrollProgress === 0 ? 'all 0.3s ease-in-out' : 'none',
        }}
      />
      <Stack align="center" gap="xs">
        {/* Placeholder for title when it becomes fixed */}
        {scrollProgress > 0 && !isMobile && (
          <div style={{ height: '3rem', width: '100%' }} />
        )}
        <div style={{
          textAlign: 'center',
          position: scrollProgress > 0 && !isMobile ? 'fixed' : 'static',
          top: scrollProgress > 0 && !isMobile ? `${85 + (1 - scrollProgress) * 200}px` : 'auto',
          left: scrollProgress > 0 && !isMobile ? `${120 + (1 - scrollProgress) * 200}px` : 'auto',
          zIndex: scrollProgress > 0 && !isMobile ? 101 : 'auto',
          transform: !isMobile ? `scale(${1 - scrollProgress * 0.4})` : 'none',
          transformOrigin: 'top left',
          transition: scrollProgress === 0 ? 'all 0.3s ease-in-out' : 'none',
          width: isMobile ? '100%' : 'auto',
          maxWidth: isMobile ? '90vw' : 'none',
          padding: isMobile ? '0 1rem' : '0',
        }}>
          <StyledTitle
            style={{
              color: 'var(--mantine-color-gray-0)',
              fontSize: isMobile ? '1.8rem' : '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              margin: 0,
              whiteSpace: isMobile ? 'normal' : 'nowrap',
              wordWrap: isMobile ? 'break-word' : 'normal',
              overflowWrap: isMobile ? 'break-word' : 'normal',
              hyphens: isMobile ? 'auto' : 'none',
              lineHeight: isMobile ? 1.2 : 1,
            }}
            selectedFont={selectedFont}
          >
            {name}
          </StyledTitle>
        </div>

        {location && (
          <Group gap="xs" align="center">
            <IconMapPin size={18} style={{ color: 'var(--mantine-color-dimmed)', margin: "auto" }} />
            <Text size="sm" c="dimmed">
              {`Based in ${location.locality.name}`}
            </Text>
          </Group>
        )}

        {/* Bio section */}
        {bio && (
          <Text c="dimmed" size="md" style={{ lineHeight: 1.6, textAlign: 'center', maxWidth: '600px' }}>
            {bio}
          </Text>
        )}

        {/* External Links */}
        {externalLinks && externalLinks.length > 0 && (
          <Group justify="center" gap="md">
            <ExternalLinksDisplay links={externalLinks} />
          </Group>
        )}

        {canEdit && editHref && (
          <Group justify="center" mt="md">
            <Button
              component={Link}
              href={editHref}
              leftSection={<IconEdit size={16} />}
              variant="outline"
            >
              Edit Profile
            </Button>
          </Group>
        )}
      </Stack>
    </Stack>
  );
};

export default ProfileHeader;
