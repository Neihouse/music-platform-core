"use client";

import {
  Box,
  Card,
  Image,
  Text,
  Group,
  Badge,
  ActionIcon,
  Stack,
  rem,
  Avatar,
} from "@mantine/core";
import { IconPlayerPlay, IconHeart, IconDots } from "@tabler/icons-react";
import { getBannerUrl } from "@/lib/images/image-utils-client";

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  duration?: string;
  plays?: number;
  isLiked?: boolean;
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  onPlay?: () => void;
  onLike?: () => void;
}

export function MusicCard({
  id,
  title,
  artist,
  coverUrl,
  duration,
  plays,
  isLiked = false,
  size = 'md',
  onClick,
  onPlay,
  onLike,
}: MusicCardProps) {
  const cardSize = {
    sm: { width: 180, height: 240 },
    md: { width: 200, height: 260 },
    lg: { width: 220, height: 280 }
  }[size];

  const trackImageUrl = coverUrl ? getBannerUrl(coverUrl) : null;

  return (
    <Card
      w={cardSize.width}
      h={cardSize.height}
      p="sm"
      radius="lg"
      style={{
        background: 'var(--mantine-color-dark-8)',
        border: '1px solid var(--mantine-color-dark-6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
      }}
      onClick={onClick}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = 'var(--mantine-color-gray-6)';
        // Show play button
        const playButton = e.currentTarget.querySelector('[data-play-button]') as HTMLElement;
        if (playButton) {
          playButton.style.opacity = '1';
          playButton.style.transform = 'translateY(0)';
        }
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '';
        e.currentTarget.style.borderColor = 'var(--mantine-color-dark-6)';
        // Hide play button
        const playButton = e.currentTarget.querySelector('[data-play-button]') as HTMLElement;
        if (playButton) {
          playButton.style.opacity = '0';
          playButton.style.transform = 'translateY(8px)';
        }
      }}
    >
      {/* Cover Image */}
      <Box pos="relative" mb="sm">
        <Image
          src={trackImageUrl || '/placeholder-album.jpg'}
          alt={title}
          h={cardSize.width - 32}
          radius="md"
          fallbackSrc="https://via.placeholder.com/200x200/2C2E33/FFFFFF?text=Music"
        />
        
        {/* Play Button Overlay */}
        <ActionIcon
          data-play-button
          size="xl"
          radius="xl"
          variant="filled"
          color="blue"
          style={{
            position: 'absolute',
            bottom: rem(8),
            right: rem(8),
            opacity: 0,
            transform: 'translateY(8px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            onPlay?.();
          }}
        >
          <IconPlayerPlay size={20} />
        </ActionIcon>
      </Box>

      {/* Track Info */}
      <Stack gap="xs">
        <Text
          fw={600}
          size="sm"
          c="white"
          lineClamp={1}
          style={{ lineHeight: 1.3 }}
        >
          {title}
        </Text>
        
        <Text
          size="xs"
          c="dimmed"
          lineClamp={1}
          style={{ lineHeight: 1.3 }}
        >
          {artist}
        </Text>

        {/* Bottom Row */}
        <Group justify="space-between" align="center" mt="auto">
          {plays && (
            <Text size="xs" c="dimmed">
              {plays.toLocaleString()} plays
            </Text>
          )}
          
          <Group gap="xs">
            {duration && (
              <Text size="xs" c="dimmed">
                {duration}
              </Text>
            )}
            
            <ActionIcon
              size="sm"
              variant="subtle"
              color={isLiked ? "red" : "gray"}
              onClick={(e) => {
                e.stopPropagation();
                onLike?.();
              }}
            >
              <IconHeart size={12} fill={isLiked ? "currentColor" : "none"} />
            </ActionIcon>
          </Group>
        </Group>
      </Stack>
    </Card>
  );
}
