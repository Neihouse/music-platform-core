"use client";

import { useContext, useState, useRef } from "react";
import { 
  Group, 
  Text, 
  ActionIcon, 
  Box, 
  Stack,
  Paper,
  Image,
  Slider
} from "@mantine/core";
import { 
  IconPlayerPlay, 
  IconPlayerPause, 
  IconPlayerStop,
  IconVolume,
  IconVolumeOff
} from "@tabler/icons-react";
import PlaybackContext from "@/lib/PlayerContext";
import { formatDuration } from "@/lib/formatting";

export function GlobalPlayer() {
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const volumeSliderTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  const { 
    currentTrack, 
    isPlaying, 
    isLoading,
    currentTime, 
    duration, 
    volume,
    playTrack,
    pauseTrack, 
    resumeTrack,
    stopTrack,
    setVolume,
    seekTo,
    error
  } = useContext(PlaybackContext);

  if (!currentTrack) {
    return null;
  }

  const handlePlayPause = () => {
    if (isPlaying) {
      pauseTrack();
    } else {
      resumeTrack();
    }
  };

  const handleProgressClick = (event: React.MouseEvent<HTMLDivElement>) => {
    if (duration === 0) return;
    
    const rect = event.currentTarget.getBoundingClientRect();
    const clickX = event.clientX - rect.left;
    const percentage = clickX / rect.width;
    const newTime = percentage * duration;
    
    seekTo(newTime);
  };

  const handleVolumeChange = (newVolume: number) => {
    setVolume(newVolume / 100);
  };

  const toggleMute = () => {
    setVolume(volume > 0 ? 0 : 1);
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;
  const volumePercent = Math.round(volume * 100);

  // Construct the image URL from Supabase storage
  const imageUrl = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/images/tracks/${currentTrack.id}`;

  return (
    <Paper 
      shadow="md" 
      style={{ 
        position: 'fixed', 
        bottom: 0, 
        left: 0, 
        right: 0, 
        zIndex: 1000,
        borderRadius: 0,
        borderTop: '1px solid var(--mantine-color-gray-3)',
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        height: '72px',
      }}
    >
      <Stack gap={0} h="100%">
        {/* Progress bar - thin at top */}
        <Box 
          style={{ 
            cursor: duration > 0 ? 'pointer' : 'default',
            height: '3px',
            backgroundColor: 'var(--mantine-color-gray-2)',
            position: 'relative',
          }}
          onClick={handleProgressClick}
        >
          <Box
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: 'var(--mantine-color-blue-6)',
              transition: 'width 0.1s ease',
            }}
          />
        </Box>
        
        {/* Main player content */}
        <Group 
          justify="space-between" 
          align="center" 
          px="lg" 
          py={0}
          style={{ flex: 1, height: '69px' }}
        >
          {/* Track info with album art */}
          <Group gap="sm" style={{ flex: 1, minWidth: 0, maxWidth: 300 }}>
            <Box
              style={{
                width: 48,
                height: 48,
                borderRadius: 6,
                overflow: "hidden",
                flexShrink: 0,
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
              }}
            >
              <Image
                src={imageUrl}
                alt={`${currentTrack.title} cover`}
                width="100%"
                height="100%"
                radius="sm"
                fallbackSrc="https://via.placeholder.com/48x48?text=♪"
                style={{ objectFit: "cover", width: "100%", height: "100%" }}
              />
            </Box>
            
            <Box style={{ minWidth: 0, flex: 1 }}>
              <Text size="sm" fw={500} lineClamp={1} c="dark">
                {currentTrack.title}
              </Text>
              <Text size="xs" c="dimmed" lineClamp={1}>
                {currentTrack.artist || "Unknown Artist"}
              </Text>
              {error && (
                <Text size="xs" c="red">
                  {error}
                </Text>
              )}
            </Box>
          </Group>

          {/* Control buttons - Center */}
          <Group gap="xs">
            <ActionIcon 
              variant="filled" 
              color="blue" 
              size="lg"
              onClick={handlePlayPause}
              loading={isLoading}
              disabled={!!error}
            >
              {isPlaying ? <IconPlayerPause size={18} /> : <IconPlayerPlay size={18} />}
            </ActionIcon>
            
            <ActionIcon 
              variant="subtle" 
              color="gray"
              size="sm"
              onClick={stopTrack}
            >
              <IconPlayerStop size={14} />
            </ActionIcon>
          </Group>

          {/* Time and Volume - Right side */}
          <Group gap="md" style={{ flex: 1, justifyContent: 'flex-end', maxWidth: 200 }} visibleFrom="sm">
            <Text size="xs" c="dimmed" style={{ whiteSpace: 'nowrap' }}>
              {formatDuration(currentTime)} / {formatDuration(duration)}
            </Text>
            
            <Group gap="xs" style={{ position: 'relative' }}>
              <ActionIcon 
                variant="subtle" 
                color="gray"
                size="sm"
                onClick={toggleMute}
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => {
                  if (volumeSliderTimeoutRef.current) {
                    clearTimeout(volumeSliderTimeoutRef.current);
                  }
                  volumeSliderTimeoutRef.current = setTimeout(() => {
                    setShowVolumeSlider(false);
                  }, 100);
                }}
              >
                {volume > 0 ? <IconVolume size={16} /> : <IconVolumeOff size={16} />}
              </ActionIcon>
              
              {showVolumeSlider && (
                <Box 
                  style={{
                    width: 80,
                    position: 'absolute',
                    right: '100%',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    marginRight: '8px',
                    zIndex: 1001,
                    background: 'white',
                    padding: '8px',
                    borderRadius: '6px',
                    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
                  }}
                  onMouseEnter={() => setShowVolumeSlider(true)}
                  onMouseLeave={() => setShowVolumeSlider(false)}
                >
                  <Slider
                    value={volumePercent}
                    onChange={handleVolumeChange}
                    size="xs"
                    color="blue"
                    min={0}
                    max={100}
                  />
                </Box>
              )}
            </Group>
          </Group>

          {/* Mobile - just time */}
          <Text size="xs" c="dimmed" hiddenFrom="sm">
            {formatDuration(currentTime)}
          </Text>
        </Group>
      </Stack>
    </Paper>
  );
}
