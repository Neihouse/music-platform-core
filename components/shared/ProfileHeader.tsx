"use client";

import { Stack, Group, Text, Button, Avatar } from "@mantine/core";
import { IconEdit, IconMapPin } from "@tabler/icons-react";
import Link from "next/link";
import { ExternalLinksDisplay } from "@/components/ExternalLinksDisplay";
import { StoredLocality } from "@/utils/supabase/global.types";
import StyledTitle from "@/components/StyledTitle";

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
  subtitle = "Singer-songwriter | Indie Pop",
  bio,
  avatarUrl,
  scrollProgress,
  location,
  externalLinks,
  canEdit = false,
  editHref,
  selectedFont
}: ProfileHeaderProps) => {
  return (
    <Stack align="center" gap="md" style={{ textAlign: 'center', paddingTop: '0.5rem' }}>
      {/* Placeholder for avatar when it becomes fixed */}
      {scrollProgress > 0 && (
        <div style={{ width: '192px', height: '192px' }} />
      )}
      <Avatar
        src={avatarUrl}
        alt={`${name} avatar`}
        size={192}
        style={{
          border: '4px solid var(--mantine-color-dark-9)',
          boxShadow: '0 8px 32px rgba(0, 0, 0, 0.3)',
          position: scrollProgress > 0 ? 'fixed' : 'static',
          top: scrollProgress > 0 ? `${80 + (1 - scrollProgress) * 200}px` : 'auto',
          left: scrollProgress > 0 ? `${2 + (1 - scrollProgress) * 20}rem` : 'auto',
          zIndex: scrollProgress > 0 ? 101 : 'auto',
          transform: `scale(${1 - scrollProgress * 0.65})`,
          transformOrigin: 'top left',
          transition: scrollProgress === 0 ? 'all 0.3s ease-in-out' : 'none',
        }}
      />
      <Stack align="center" gap="xs">
        {/* Placeholder for title when it becomes fixed */}
        {scrollProgress > 0 && (
          <div style={{ height: '3rem', width: '100%' }} />
        )}
        <div style={{
          textAlign: 'center',
          position: scrollProgress > 0 ? 'fixed' : 'static',
          top: scrollProgress > 0 ? `${85 + (1 - scrollProgress) * 200}px` : 'auto',
          left: scrollProgress > 0 ? `${120 + (1 - scrollProgress) * 200}px` : 'auto',
          zIndex: scrollProgress > 0 ? 101 : 'auto',
          transform: `scale(${1 - scrollProgress * 0.4})`,
          transformOrigin: 'top left',
          transition: scrollProgress === 0 ? 'all 0.3s ease-in-out' : 'none',
        }}>
          <StyledTitle
            style={{
              color: 'var(--mantine-color-gray-0)',
              fontSize: '2.5rem',
              fontWeight: 700,
              textAlign: 'center',
              margin: 0,
              whiteSpace: 'nowrap',
            }}
            selectedFont={selectedFont}
          >
            {name}
          </StyledTitle>
        </div>

        <Text size="lg" c="dimmed">{subtitle}</Text>

        {location && (
          <Group gap="xs" align="center">
            <IconMapPin size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
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
