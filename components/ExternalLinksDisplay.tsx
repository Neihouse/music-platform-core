"use client";

import {
  Group,
  Text,
  ActionIcon,
  Tooltip,
  UnstyledButton,
  Box,
  rem,
} from "@mantine/core";
import {
  IconBrandInstagram,
  IconBrandTwitter,
  IconBrandFacebook,
  IconBrandYoutube,
  IconBrandTiktok,
  IconBrandSpotify,
  IconBrandSoundcloud,
  IconBrandBandcamp,
  IconWorld,
  IconExternalLink,
} from "@tabler/icons-react";

export interface ExternalLinksDisplayProps {
  links: string[] | null;
}

const PLATFORM_ICONS: Record<string, React.ComponentType<any>> = {
  instagram: IconBrandInstagram,
  twitter: IconBrandTwitter,
  facebook: IconBrandFacebook,
  youtube: IconBrandYoutube,
  tiktok: IconBrandTiktok,
  spotify: IconBrandSpotify,
  soundcloud: IconBrandSoundcloud,
  bandcamp: IconBrandBandcamp,
  website: IconWorld,
};

const PLATFORM_COLORS: Record<string, string> = {
  instagram: "#E4405F",
  twitter: "#1DA1F2", 
  facebook: "#1877F2",
  youtube: "#FF0000",
  tiktok: "#000000",
  spotify: "#1DB954",
  soundcloud: "#FF5500",
  bandcamp: "#629AA0",
  website: "#6C757D",
};

const PLATFORM_LABELS: Record<string, string> = {
  instagram: "Instagram",
  twitter: "Twitter", 
  facebook: "Facebook",
  youtube: "YouTube",
  tiktok: "TikTok",
  spotify: "Spotify",
  soundcloud: "SoundCloud",
  bandcamp: "Bandcamp",
  website: "Website",
};

function detectPlatform(url: string): string {
  const lowercaseUrl = url.toLowerCase();
  
  if (lowercaseUrl.includes("instagram.com")) return "instagram";
  if (lowercaseUrl.includes("twitter.com") || lowercaseUrl.includes("x.com")) return "twitter";
  if (lowercaseUrl.includes("facebook.com")) return "facebook";
  if (lowercaseUrl.includes("youtube.com") || lowercaseUrl.includes("youtu.be")) return "youtube";
  if (lowercaseUrl.includes("tiktok.com")) return "tiktok";
  if (lowercaseUrl.includes("spotify.com")) return "spotify";
  if (lowercaseUrl.includes("soundcloud.com")) return "soundcloud";
  if (lowercaseUrl.includes("bandcamp.com")) return "bandcamp";
  
  return "website";
}

export function ExternalLinksDisplay({ links }: ExternalLinksDisplayProps) {
  if (!links || links.length === 0) {
    return null;
  }

  return (
    <Group gap="xs">
      {links.map((url, index) => {
          const platform = detectPlatform(url);
          const IconComponent = PLATFORM_ICONS[platform] || IconExternalLink;
          const color = PLATFORM_COLORS[platform] || "#6C757D";
          const label = PLATFORM_LABELS[platform] || "Website";

          return (
            <Tooltip key={index} label={`Visit ${label}`} position="top">
              <UnstyledButton
                component="a"
                href={url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: rem(44),
                  height: rem(44),
                  borderRadius: rem(12),
                  backgroundColor: color,
                  color: 'white',
                  transition: 'all 0.2s ease',
                  border: 'none',
                  cursor: 'pointer',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = `0 8px 20px ${color}40`;
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0px)';
                  e.currentTarget.style.boxShadow = 'none';
                }}
              >
                <IconComponent size={20} stroke={2} />
              </UnstyledButton>
            </Tooltip>
          );
        })}
      </Group>
    );
  }