"use client";

import { 
  AppShell,
  Container, 
  Group, 
  Text, 
  Stack,
  ActionIcon,
  rem,
  Divider,
  SimpleGrid,
  Box
} from '@mantine/core'
import { 
  IconBrandGithub, 
  IconBrandTwitter,
  IconBrandInstagram,
  IconHeart,
  IconHeadphones,
  IconMicrophone,
  IconMusic,
  IconPlaylist
} from '@tabler/icons-react'
import Link from 'next/link'

const FOOTER_DATA = {
  discover: {
    title: 'Discover',
    links: [
      { label: 'Featured Artists', href: '/artists' },
      { label: 'New Releases', href: '/new-releases' },
      { label: 'Popular Tracks', href: '/popular' },
      { label: 'Genres', href: '/genres' },
    ],
  },
  artists: {
    title: 'For Artists',
    links: [
      { label: 'Upload Music', href: '/upload' },
      { label: 'Artist Dashboard', href: '/dashboard' },
      { label: 'Analytics', href: '/analytics' },
      { label: 'Promotion Tools', href: '/promote' },
    ],
  },
  fans: {
    title: 'For Fans',
    links: [
      { label: 'Create Playlist', href: '/playlists/create' },
      { label: 'My Library', href: '/library' },
      { label: 'Following', href: '/following' },
      { label: 'Liked Tracks', href: '/likes' },
    ],
  },
  company: {
    title: 'Company',
    links: [
      { label: 'About', href: '/about' },
      { label: 'Contact', href: '/contact' },
      { label: 'Terms', href: '/terms-of-service' },
      { label: 'Privacy', href: '/privacy-policy' },
    ],
  },
}

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
]

const FEATURES = [
  { icon: IconHeadphones, label: 'High Quality Audio' },
  { icon: IconMicrophone, label: 'Artist Tools' },
  { icon: IconMusic, label: 'Unlimited Uploads' },
  { icon: IconPlaylist, label: 'Smart Playlists' },
]

export function Footer() {
  const year = new Date().getFullYear()

  return (
    <AppShell.Footer py="xl">
      <Container size="xl">
        <Stack gap="xl">
          {/* Logo and Social Links */}
          <Group justify="space-between" wrap="nowrap">
            <Box>
              <Text 
                component={Link} 
                href="/"
                size="xl" 
                fw={700}
                style={{
                  color: 'var(--mantine-color-text)',
                  textDecoration: 'none',
                }}
              >
                MusicApp
              </Text>
              <Text size="sm" c="dimmed" mt="xs" maw={300}>
                Connect with artists and discover new music. Share your sound with the world.
              </Text>
            </Box>

            <Group gap="md" wrap="nowrap">
              {SOCIAL_LINKS.map((link) => (
                <ActionIcon
                  key={link.href}
                  component="a"
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="subtle"
                  size="lg"
                  radius="xl"
                  aria-label={link.label}
                >
                  <link.icon size={18} stroke={1.5} />
                </ActionIcon>
              ))}
            </Group>
          </Group>

          <Divider />

          {/* Features */}
          <SimpleGrid cols={{ base: 2, sm: 4 }} spacing="lg">
            {FEATURES.map((feature) => (
              <Group key={feature.label} gap="xs" wrap="nowrap">
                <feature.icon 
                  size={24} 
                  style={{ color: 'var(--mantine-color-blue-6)' }} 
                />
                <Text size="sm" fw={500}>
                  {feature.label}
                </Text>
              </Group>
            ))}
          </SimpleGrid>

          <Divider />

          {/* Navigation Links */}
          <SimpleGrid cols={{ base: 1, xs: 2, sm: 4 }} spacing="xl">
            {Object.entries(FOOTER_DATA).map(([key, section]) => (
              <Stack key={key} gap="md">
                <Text fw={500}>{section.title}</Text>
                <Stack gap="xs">
                  {section.links.map((link) => (
                    <Text
                      key={link.href}
                      component={Link}
                      href={link.href}
                      size="sm"
                      style={{
                        color: 'var(--mantine-color-dimmed)',
                        textDecoration: 'none',
                        transition: 'color 150ms ease',
                        '&:hover': {
                          color: 'var(--mantine-color-text)',
                        },
                      }}
                    >
                      {link.label}
                    </Text>
                  ))}
                </Stack>
              </Stack>
            ))}
          </SimpleGrid>

          <Divider />

          {/* Copyright */}
          <Group justify="center" gap="xs">
            <Text size="sm" c="dimmed">
              Made with <IconHeart size={rem(14)} style={{ color: 'var(--mantine-color-red-6)' }} /> © {year} MusicApp
            </Text>
          </Group>
        </Stack>
      </Container>
    </AppShell.Footer>
  )
}
