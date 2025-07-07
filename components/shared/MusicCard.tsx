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
import { IconPlayerPlay, IconPlayerPause, IconHeart, IconDots } from "@tabler/icons-react";
import { getBannerUrl } from "@/lib/images/image-utils-client";
import { useContext } from "react";
import PlaybackContext from "@/lib/PlayerContext";

interface MusicCardProps {
  id: string;
  title: string;
  artist: string;
  coverUrl?: string;
  duration?: string;
  plays?: number;
  isLiked?: boolean;
  size?: 'sm' | 'md' | 'lg' | 'grid';
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
  const { currentTrack, isPlaying, playTrack, pauseTrack, resumeTrack } = useContext(PlaybackContext);
  
  // Check if this track is currently playing
  const isCurrentTrack = currentTrack?.id === id;
  const isTrackPlaying = isCurrentTrack && isPlaying;

  const cardSize = {
    sm: { minWidth: 160, maxWidth: 180, height: 240 },
    md: { minWidth: 180, maxWidth: 200, height: 260 },
    lg: { minWidth: 200, maxWidth: 220, height: 280 },
    grid: { width: '100%', height: 'auto' }
  }[size] || { minWidth: 180, maxWidth: 200, height: 260 };

  const trackImageUrl = coverUrl ? getBannerUrl(coverUrl) : null;

  const handlePlay = () => {
    if (isCurrentTrack) {
      // If this track is currently playing, pause it
      if (isPlaying) {
        pauseTrack();
      } else {
        // If this track is current but paused, resume it
        resumeTrack();
      }
    } else {
      // Play this track (will stop any currently playing track)
      playTrack(id);
    }
    onPlay?.(); // Still call the optional callback if provided
  };

  return size === 'grid' ? (
    // Grid layout - matches original MusicGrid design exactly
    <Box
      style={{
        cursor: 'pointer',
        transition: 'transform 0.3s ease',
      }}
      onClick={() => {
        handlePlay();
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
        <Image
          src={trackImageUrl || '/placeholder-album.jpg'}
          alt={title}
          style={{ 
            aspectRatio: '1', 
            borderRadius: '8px',
            width: '100%'
          }}
          fallbackSrc="https://via.placeholder.com/200x200/2C2E33/FFFFFF?text=Music"
        />
        <Box
          style={{
            position: 'absolute',
            inset: 0,
            background: 'rgba(0, 0, 0, 0.3)',
            backdropFilter: 'blur(2px)',
            opacity: isTrackPlaying ? 1 : 0,
            transition: 'opacity 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            borderRadius: '8px',
          }}
          className="play-overlay"
        >
          <ActionIcon
            size="xl"
            color="white"
            variant="filled"
            style={{ backgroundColor: 'rgba(255, 255, 255, 0.9)' }}
            onClick={(e) => {
              e.stopPropagation();
              handlePlay();
            }}
          >
            {isTrackPlaying ? (
              <IconPlayerPause size={24} style={{ color: 'black' }} />
            ) : (
              <IconPlayerPlay size={24} style={{ color: 'black' }} />
            )}
          </ActionIcon>
        </Box>
      </Box>
      <Stack gap="xs" mt="sm">
        <Text size="sm" fw={500} c="gray.0" style={{ textAlign: 'center' }}>
          {title}
        </Text>
        <Text size="xs" c="dimmed" style={{ textAlign: 'center' }}>
        {artist} {/*• {plays ? `${plays} ${plays === 1 ? 'play' : 'plays'}` : '0 plays'} */}
        </Text>
      </Stack>
    </Box>
  ) : (
    <Card
      p="sm"
      radius="lg"
      style={{
        width: '100%',
        minWidth: cardSize.minWidth,
        maxWidth: cardSize.maxWidth,
        height: cardSize.height,
        background: isCurrentTrack 
          ? 'var(--mantine-color-dark-7)' 
          : 'var(--mantine-color-dark-8)',
        border: isCurrentTrack 
          ? '1px solid var(--mantine-color-blue-6)' 
          : '1px solid var(--mantine-color-dark-6)',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
        position: 'relative',
        overflow: 'hidden',
        boxSizing: 'border-box',
      }}
      onClick={() => {
        console.log(`Clicked on track: ${title} by ${artist}`);
        handlePlay();
        onClick?.(); // Still call the optional callback if provided
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = 'translateY(-4px)';
        e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.3)';
        e.currentTarget.style.borderColor = isCurrentTrack 
          ? 'var(--mantine-color-blue-5)' 
          : 'var(--mantine-color-gray-6)';
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
        e.currentTarget.style.borderColor = isCurrentTrack 
          ? 'var(--mantine-color-blue-6)' 
          : 'var(--mantine-color-dark-6)';
        // Hide play button (unless track is playing)
        const playButton = e.currentTarget.querySelector('[data-play-button]') as HTMLElement;
        if (playButton && !isTrackPlaying) {
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
          h={cardSize.minWidth ? cardSize.minWidth - 32 : 168}
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
            opacity: isTrackPlaying ? 1 : 0, // Show button if track is playing
            transform: isTrackPlaying ? 'translateY(0)' : 'translateY(8px)',
            transition: 'all 0.3s ease',
            boxShadow: '0 4px 16px rgba(0, 0, 0, 0.3)',
          }}
          onClick={(e) => {
            e.stopPropagation();
            handlePlay();
          }}
        >
          {isTrackPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
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
