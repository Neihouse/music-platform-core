/**
 * ArtistCard Component
 * 
 * A reusable artist card component that follows the same design patterns as MusicCard and EventCard.
 * Supports both grid and card layouts with responsive sizing and interactive elements.
 * 
 * Features:
 * - Two layout modes: 'grid' (compact) and card layouts ('sm', 'md', 'lg')
 * - Hover animations and interactive overlays
 * - Favorite functionality
 * - Artist avatar and banner image support
 * - Follower count and track count display
 * - Gradient accents and modern styling
 * - TypeScript types based on database-first approach using global.types
 * 
 * Design Patterns:
 * - Grid layout: Square aspect ratio with overlay actions, similar to MusicCard grid
 * - Card layout: Vertical card with header, content, and actions, similar to EventCard
 * - Hover effects: Transform and shadow animations consistent with other cards
 * - Color scheme: Blue/cyan gradient theme for artist-specific branding
 * 
 * @example
 * // Basic usage
 * <ArtistCard
 *   artist={{
 *     id: '1',
 *     name: 'John Doe',
 *     bio: 'Electronic music producer',
 *     avatarUrl: '/avatar.jpg',
 *     followerCount: 1250,
 *     trackCount: 12
 *   }}
 *   onClick={() => console.log('Navigate to artist')}
 * />
 * 
 * // Grid layout for compact displays
 * <ArtistCard
 *   artist={artistData}
 *   size="grid"
 * />
 */
"use client";

import { getBannerUrl } from "@/lib/images/image-utils-client";
import { ArtistWithImages } from "@/utils/supabase/global.types";
import {
  ActionIcon,
  Avatar,
  Badge,
  Box,
  Card,
  Group,
  Image,
  Stack,
  Text,
  rem,
} from "@mantine/core";
import { IconDots, IconHeart, IconMicrophone, IconUsers } from "@tabler/icons-react";

interface ArtistCardProps {
  artist: Pick<ArtistWithImages, 'id' | 'name' | 'bio'> & {
    avatarUrl?: string | null;
    bannerUrl?: string | null;
    followerCount?: number;
    trackCount?: number;
    genre?: string;
  };
  size?: 'sm' | 'md' | 'lg' | 'grid';
  onClick?: () => void;
  onFavorite?: () => void;
}

export function ArtistCard({
  artist,
  size = 'md',
  onClick,
  onFavorite,
}: ArtistCardProps) {
  const cardSize = {
    sm: { minWidth: 160, maxWidth: 180, height: 240 },
    md: { minWidth: 180, maxWidth: 200, height: 260 },
    lg: { minWidth: 200, maxWidth: 220, height: 280 },
    grid: { width: '100%', height: 'auto' }
  }[size] || { minWidth: 180, maxWidth: 200, height: 260 };

  const artistImageUrl = artist.avatarUrl ? getBannerUrl(artist.avatarUrl) : null;
  const bannerImageUrl = artist.bannerUrl ? getBannerUrl(artist.bannerUrl) : null;

  return size === 'grid' ? (
    // Grid layout - mobile-first responsive design
    <Box
      style={{
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
      onClick={() => {
        onClick?.();
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'scale(1.05)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'scale(1)';
      }}
    >
      <Box style={{ position: 'relative' }}>
        {/* Banner or Avatar as main image */}
        <Image
          src={bannerImageUrl || artistImageUrl || '/placeholder-artist.jpg'}
          alt={artist.name}
          style={{
            aspectRatio: '1',
            borderRadius: '8px',
            width: '100%'
          }}
          fallbackSrc="https://via.placeholder.com/200x200/2C2E33/FFFFFF?text=Artist"
        />

        {/* Artist Avatar overlay if we have a banner */}
        {bannerImageUrl && artistImageUrl && (
          <Avatar
            src={artistImageUrl}
            alt={artist.name}
            size="lg"
            style={{
              position: 'absolute',
              bottom: rem(8),
              left: rem(8),
              border: '3px solid white',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.3)',
            }}
          />
        )}
      </Box>

      <Stack gap="xs" mt="sm">
        <Text
          size="sm"
          fw={500}
          c="gray.0"
          ta="center"
        >
          {artist.name}
        </Text>
        <Group gap="xs" justify="center">
          {artist.followerCount && (
            <Text size="xs" c="dimmed">
              {artist.followerCount.toLocaleString()} followers
            </Text>
          )}
          {artist.trackCount && (
            <Text size="xs" c="dimmed">
              • {artist.trackCount} tracks
            </Text>
          )}
        </Group>
      </Stack>
    </Box>
  ) : (
    // Card layout - consistent with EventCard and MusicCard patterns
    <Card
      radius="xl"
      shadow="lg"
      p="lg"
      withBorder
      style={{
        width: '100%',
        minWidth: cardSize.minWidth,
        maxWidth: cardSize.maxWidth,
        height: cardSize.height,
        overflow: 'hidden',
        transition: 'all 0.3s ease',
        border: '1px solid var(--mantine-color-gray-2)',
        background: 'linear-gradient(135deg, rgba(var(--mantine-color-blue-1-rgb), 0.5), rgba(255,255,255,0.9))',
        position: 'relative',
        cursor: 'pointer',
      }}
      onClick={() => {
        onClick?.();
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
      }}
    >
      {/* Gradient top accent */}
      <Box
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 4,
          background: 'linear-gradient(90deg, var(--mantine-color-blue-5), var(--mantine-color-cyan-5))',
        }}
      />

      {/* Header with avatar and badges */}
      <Group justify="space-between" mb="md" align="flex-start">
        <Avatar
          src={artistImageUrl}
          alt={artist.name}
          size="xl"
          radius="xl"
          style={{
            border: '3px solid var(--mantine-color-blue-1)',
            boxShadow: '0 4px 20px rgba(34, 139, 230, 0.3)',
            flexShrink: 0
          }}
        />

        <Stack gap={4} align="flex-end" style={{ flex: 1, minWidth: 0 }}>
          {artist.genre && (
            <Badge
              size="sm"
              variant="light"
              color="blue"
              style={{ fontWeight: 600 }}
            >
              {artist.genre}
            </Badge>
          )}
        </Stack>
      </Group>

      {/* Artist Details */}
      <Stack gap="sm" mb="lg">
        <Text
          fw={700}
          size={rem(18)}
          lineClamp={1}
          style={{ lineHeight: 1.3 }}
        >
          {artist.name}
        </Text>

        {artist.bio && (
          <Text
            size="sm"
            c="dimmed"
            lineClamp={2}
            style={{ lineHeight: 1.4 }}
          >
            {artist.bio}
          </Text>
        )}

        {/* Stats */}
        <Group gap="lg" mt="xs">
          {artist.followerCount !== undefined && (
            <Group gap="xs" align="center">
              <ActionIcon
                size="sm"
                variant="light"
                color="gray"
                radius="xl"
              >
                <IconUsers size={12} />
              </ActionIcon>
              <Text size="sm" c="dimmed" fw={500}>
                {artist.followerCount.toLocaleString()} followers
              </Text>
            </Group>
          )}

          {artist.trackCount !== undefined && (
            <Group gap="xs" align="center">
              <ActionIcon
                size="sm"
                variant="light"
                color="blue"
                radius="xl"
              >
                <IconMicrophone size={12} />
              </ActionIcon>
              <Text size="sm" fw={600} c="blue.7">
                {artist.trackCount} tracks
              </Text>
            </Group>
          )}
        </Group>
      </Stack>

      {/* Action Section */}
      <Group justify="space-between" align="center" mt="auto">
        <ActionIcon
          size="md"
          variant="subtle"
          color="gray"
          onClick={(e) => {
            e.stopPropagation();
            onFavorite?.();
          }}
        >
          <IconHeart size={16} />
        </ActionIcon>

        <ActionIcon
          size="md"
          variant="subtle"
          color="gray"
        >
          <IconDots size={16} />
        </ActionIcon>
      </Group>
    </Card>
  );
}
