"use client";

import {
  Container,
  Group,
  Text,
  ActionIcon,
  Paper,
  useMantineTheme
} from '@mantine/core'
import {
  IconBrandGithub,
  IconBrandTwitter,
  IconBrandInstagram,
  IconHeadphones,
  IconMicrophone,
  IconMusic,
  IconPlaylist
} from '@tabler/icons-react'

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
      { label: "Upload Music", href: "/upload" },
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
  const theme = useMantineTheme();

  return (
    <Paper
      component="footer"
      py="xs"
      withBorder
      radius={0}
      h="100%"
      style={{
        display: 'flex',
        alignItems: 'center',
        borderLeft: 0,
        borderRight: 0,
        borderBottom: 0,
      }}
    >
      <Container size="xl" style={{ width: "100%" }}>
        <Group justify="space-between" wrap="nowrap">
          <Text size="sm" c="dimmed">
            © {year} MusicApp. All rights reserved.
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
              >
                <link.icon size={16} stroke={1.5} />
              </ActionIcon>
            ))}
          </Group>
        </Group>
      </Container>
    </Paper>
  );
}
