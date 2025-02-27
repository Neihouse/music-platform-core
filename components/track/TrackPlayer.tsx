"use client"

import { Card, Group, Stack, Text, ActionIcon, Slider, Image } from '@mantine/core'
import { IconPlayerPlay, IconPlayerPause, IconVolume, IconVolumeOff } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'

interface TrackPlayerProps {
  track: {
    id: string
    title: string
    artist: string
    coverUrl: string
    audioUrl: string
  }
}

export function TrackPlayer({ track }: TrackPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(1)
  const [isMuted, setIsMuted] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
  }, [volume])

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration)
    }
  }

  const handleSliderChange = (value: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value
      setCurrentTime(value)
    }
  }

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  return (
    <Card withBorder radius="md" padding="lg">
      <Group align="flex-start" wrap="nowrap">
        <Image
          src={track.coverUrl}
          alt={track.title}
          width={120}
          height={120}
          radius="md"
          fallbackSrc="/placeholder-image.jpg"
        />

        <Stack style={{ flex: 1 }} gap="xs">
          <Group justify="space-between" wrap="nowrap">
            <Stack gap={0}>
              <Text size="lg" fw={500} lineClamp={1}>
                {track.title}
              </Text>
              <Text size="sm" c="dimmed" lineClamp={1}>
                {track.artist}
              </Text>
            </Stack>

            <Group gap="xs">
              <ActionIcon
                variant="light"
                size="lg"
                radius="xl"
                onClick={toggleMute}
                aria-label={isMuted ? 'Unmute' : 'Mute'}
              >
                {isMuted ? <IconVolumeOff size={20} /> : <IconVolume size={20} />}
              </ActionIcon>

              <ActionIcon
                variant="light"
                size="lg"
                radius="xl"
                onClick={togglePlay}
                aria-label={isPlaying ? 'Pause' : 'Play'}
              >
                {isPlaying ? <IconPlayerPause size={20} /> : <IconPlayerPlay size={20} />}
              </ActionIcon>
            </Group>
          </Group>

          <Stack gap="xs">
            <Slider
              value={currentTime}
              onChange={handleSliderChange}
              max={duration}
              min={0}
              step={0.1}
              label={formatTime}
              size="sm"
            />

            <Group justify="space-between" wrap="nowrap">
              <Text size="sm" c="dimmed">
                {formatTime(currentTime)}
              </Text>
              <Text size="sm" c="dimmed">
                {formatTime(duration)}
              </Text>
            </Group>

            <Group>
              <Text size="sm" c="dimmed">Volume:</Text>
              <Slider
                value={volume}
                onChange={setVolume}
                max={1}
                min={0}
                step={0.1}
                size="xs"
                w={100}
                disabled={isMuted}
              />
            </Group>
          </Stack>
        </Stack>
      </Group>

      <audio
        ref={audioRef}
        src={track.audioUrl}
        onTimeUpdate={handleTimeUpdate}
        onLoadedMetadata={handleLoadedMetadata}
        onEnded={() => setIsPlaying(false)}
      />
    </Card>
  )
} 