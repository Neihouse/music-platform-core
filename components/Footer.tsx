"use client";

import {
  ActionIcon,
  Container,
  Group,
  Text,
} from '@mantine/core';
import {
  IconBrandGithub,
  IconBrandInstagram,
  IconBrandTwitter,
  IconHeadphones,
  IconMicrophone,
  IconMusic,
  IconPlaylist
} from '@tabler/icons-react';

const FOOTER_DATA = {
  discover: {
    title: "Discover",
    links: [
      { label: "Featured Artists", href: "/artists" },
      { label: "New Releases", href: "/new-releases" },
      { label: "Popular Tracks", href: "/popular" },
      { label: "Genres", href: "/genres" },
    ],
  },
  artists: {
    title: "For Artists",
    links: [
      { label: "Upload Music", href: "/upload/tracks" },
      { label: "Artist Dashboard", href: "/dashboard" },
      { label: "Analytics", href: "/analytics" },
      { label: "Promotion Tools", href: "/promote" },
    ],
  },
  fans: {
    title: "For Fans",
    links: [
      { label: "Create Playlist", href: "/playlists/create" },
      { label: "My Library", href: "/library" },
      { label: "Following", href: "/following" },
      { label: "Liked Tracks", href: "/likes" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Contact", href: "/contact" },
      { label: "Terms", href: "/terms-of-service" },
      { label: "Privacy", href: "/privacy-policy" },
    ],
  },
};

const SOCIAL_LINKS = [
  {
    icon: IconBrandGithub,
    href: 'https://github.com/your-org/music-platform',
    label: 'GitHub'
  },
  {
    icon: IconBrandTwitter,
    href: 'https://twitter.com/your-handle',
    label: 'Twitter'
  },
  {
    icon: IconBrandInstagram,
    href: 'https://instagram.com/your-handle',
    label: 'Instagram'
  },
];

const FEATURES = [
  { icon: IconHeadphones, label: "High Quality Audio" },
  { icon: IconMicrophone, label: "Artist Tools" },
  { icon: IconMusic, label: "Unlimited Uploads" },
  { icon: IconPlaylist, label: "Smart Playlists" },
];

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        backgroundColor: 'var(--mantine-color-dark-8)',
        borderTop: '1px solid var(--mantine-color-dark-4)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '0 1rem',
      }}
    >
      <Container size="xl" style={{ width: "100%" }}>
        <Group justify="space-between" wrap="nowrap">
          <Text size="sm" c="dimmed">
            © {year} Myuzo. All rights reserved.
          </Text>
          <Group gap="md" wrap="nowrap">
            {SOCIAL_LINKS.map((link) => (
              <ActionIcon
                key={link.href}
                component="a"
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                variant="subtle"
                size="sm"
                radius="xl"
                aria-label={link.label}
                style={{
                  color: 'var(--mantine-color-dimmed)',
                  '&:hover': {
                    color: 'var(--mantine-color-gray-0)',
                    backgroundColor: 'var(--mantine-color-dark-6)',
                  }
                }}
              >
                <link.icon size={16} stroke={1.5} />
              </ActionIcon>
            ))}
          </Group>
        </Group>
      </Container>
    </div>
  );
}
