"use client";

import { useContext, useState, useRef, useEffect } from "react";
import { 
  Group, 
  Text, 
  ActionIcon, 
  Box, 
  Stack,
  Paper,
  Image,
  Slider,
  useMantineTheme,
  useMantineColorScheme
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
  const theme = useMantineTheme();
  const { colorScheme } = useMantineColorScheme();
  
  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (volumeSliderTimeoutRef.current) {
        clearTimeout(volumeSliderTimeoutRef.current);
      }
    };
  }, []);

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
        borderTop: `1px solid ${colorScheme === 'dark' ? theme.colors.dark[4] : theme.colors.gray[3]}`,
        background: colorScheme === 'dark' 
          ? theme.colors.dark[7] 
          : theme.colors.gray[0],
        backdropFilter: 'blur(10px)',
        height: '72px',
        width: '100%',
        maxWidth: '100vw',
        overflowX: 'hidden',
      }}
    >
      <Stack 
        gap={0} 
        h="100%" 
        style={{
          width: '100%',
          maxWidth: '100%',
          overflowX: 'hidden'
        }}
      >
        {/* Progress bar - thin at top */}
        <Box 
          style={{ 
            cursor: duration > 0 ? 'pointer' : 'default',
            height: '3px',
            position: 'relative',
            backgroundColor: colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2],
            width: '100%',
            maxWidth: '100%'
          }}
          onClick={handleProgressClick}
        >
          <Box
            style={{
              height: '100%',
              width: `${progress}%`,
              backgroundColor: theme.colors.blue[6],
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
          style={{ 
            flex: 1, 
            height: '69px',
            width: '100%',
            maxWidth: '100%',
            overflowX: 'hidden'
          }}
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
              <Text size="sm" fw={500} lineClamp={1} c={colorScheme === 'dark' ? 'gray.0' : 'dark'}>
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
                    background: colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
                    padding: '8px',
                    borderRadius: '6px',
                    boxShadow: colorScheme === 'dark' 
                      ? '0 4px 12px rgba(0, 0, 0, 0.4)' 
                      : '0 4px 12px rgba(0, 0, 0, 0.15)',
                    border: colorScheme === 'dark' 
                      ? `1px solid ${theme.colors.dark[4]}` 
                      : 'none',
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
