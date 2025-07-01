"use client";

import {
  Box,
  Card,
  Image,
  Text,
  Group,
  Badge,
  Stack,
  rem,
  Avatar,
  Button,
} from "@mantine/core";
import { IconMapPin, IconUsers, IconCalendarEvent } from "@tabler/icons-react";
import { getAvatarUrl, getBannerUrl } from "@/lib/images/image-utils-client";

interface ArtistCardProps {
  id: string;
  name: string;
  bio?: string;
  avatarUrl?: string;
  bannerUrl?: string;
  genre?: string;
  followerCount?: number;
  location?: string;
  upcomingShows?: number;
  isVerified?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onFollow?: () => void;
}

export function ArtistCard({
  id,
  name,
  bio,
  avatarUrl,
  bannerUrl,
  genre,
  followerCount,
  location,
  upcomingShows,
  isVerified = false,
  size = 'md',
  onClick,
  onFollow,
}: ArtistCardProps) {
  const cardSize = {
    sm: { width: 240, height: 320 },
    md: { width: 280, height: 360 },
    lg: { width: 320, height: 400 }
  }[size];

  const bannerImageUrl = bannerUrl ? getBannerUrl(bannerUrl) : null;
  const avatarImageUrl = avatarUrl ? getAvatarUrl(avatarUrl) : null;

  return (
    <Card
      w={cardSize.width}
      h={cardSize.height}
      p={0}
      radius="xl"
      style={{
        background: 'var(--mantine-color-dark-8)',
        border: '1px solid var(--mantine-color-dark-6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        overflow: 'hidden',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-8px)';
        e.currentTarget.style.boxShadow = '0 25px 50px rgba(0, 0, 0, 0.4)';
        e.currentTarget.style.borderColor = 'var(--mantine-color-gray-6)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--mantine-color-dark-6)';
      }}
    >
      {/* Banner Section */}
      <Box
        h={120}
        style={{
          background: bannerImageUrl
            ? `url(${bannerImageUrl})`
            : 'linear-gradient(135deg, var(--mantine-color-blue-6), var(--mantine-color-cyan-6))',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          position: 'relative',
        }}
      >
        {genre && (
          <Badge
            size="sm"
            variant="filled"
            color="dark"
            style={{
              position: 'absolute',
              top: rem(12),
              right: rem(12),
              backgroundColor: 'rgba(0, 0, 0, 0.7)',
            }}
          >
            {genre}
          </Badge>
        )}
      </Box>

      {/* Content */}
      <Box p="lg" style={{ position: 'relative', height: cardSize.height - 120 }}>
        {/* Avatar overlapping banner */}
        <Avatar
          src={avatarImageUrl}
          alt={name}
          size={60}
          radius="xl"
          style={{
            position: 'absolute',
            top: -30,
            left: rem(20),
            border: '3px solid var(--mantine-color-dark-8)',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
        />

        <Stack justify="space-between" h="100%" pt={40}>
          <Stack gap="sm">
            <Group align="center" gap="xs">
              <Text fw={700} size="lg" c="white" lineClamp={1}>
                {name}
              </Text>
              {isVerified && (
                <Badge size="xs" color="blue" variant="filled">
                  ✓
                </Badge>
              )}
            </Group>

            {bio && (
              <Text size="sm" c="dimmed" lineClamp={2} style={{ lineHeight: 1.4 }}>
                {bio}
              </Text>
            )}

            <Stack gap="xs">
              {location && (
                <Group gap="xs" align="center">
                  <IconMapPin size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    {location}
                  </Text>
                </Group>
              )}

              {followerCount && (
                <Group gap="xs" align="center">
                  <IconUsers size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    {followerCount.toLocaleString()} followers
                  </Text>
                </Group>
              )}

              {upcomingShows && (
                <Group gap="xs" align="center">
                  <IconCalendarEvent size={14} color="var(--mantine-color-dimmed)" />
                  <Text size="xs" c="dimmed">
                    {upcomingShows} upcoming shows
                  </Text>
                </Group>
              )}
            </Stack>
          </Stack>

          <Button
            size="sm"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
            fullWidth
            radius="xl"
            onClick={(e) => {
              e.stopPropagation();
              onFollow?.();
            }}
          >
            Follow
          </Button>
        </Stack>
      </Box>
    </Card>
  );
}
