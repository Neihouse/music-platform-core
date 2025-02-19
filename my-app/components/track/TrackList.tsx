"use client"

import { 
  Group, 
  Text, 
  Stack, 
  Paper, 
  Badge, 
  ActionIcon, 
  Tooltip,
  Box,
  rem
} from '@mantine/core'
import { 
  IconPlayerPlay, 
  IconHeart, 
  IconClock, 
  IconDotsVertical 
} from '@tabler/icons-react'
import { useHover } from '@mantine/hooks'

interface Track {
  id: number
  title: string
  artist: string
  plays?: number
  likes?: number
  genre?: string
  duration?: string
}

interface TrackListProps {
  tracks: Track[]
  onPlay?: (id: number) => void
  onLike?: (id: number) => void
  onOptionsClick?: (id: number) => void
}

export function TrackList({ 
  tracks, 
  onPlay, 
  onLike,
  onOptionsClick 
}: TrackListProps) {
  return (
    <Stack gap="xs">
      {tracks.map((track) => (
        <TrackItem 
          key={track.id} 
          track={track}
          onPlay={onPlay}
          onLike={onLike}
          onOptionsClick={onOptionsClick}
        />
      ))}
    </Stack>
  )
}

interface TrackItemProps {
  track: Track
  onPlay?: (id: number) => void
  onLike?: (id: number) => void
  onOptionsClick?: (id: number) => void
}

function TrackItem({ track, onPlay, onLike, onOptionsClick }: TrackItemProps) {
  const { hovered, ref } = useHover()

  return (
    <Paper 
      ref={ref}
      p="md" 
      radius="md" 
      withBorder
      style={(theme) => ({
        backgroundColor: theme.white,
        transition: 'all 150ms ease',
        transform: hovered ? 'translateY(-2px)' : 'none',
        boxShadow: hovered ? theme.shadows.sm : 'none',
      })}
    >
      <Group justify="space-between" wrap="nowrap">
        <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
          <Tooltip label="Play track">
            <ActionIcon 
              variant="light"
              color="blue"
              onClick={() => onPlay?.(track.id)}
              size="lg"
              radius="xl"
              style={{
                transition: 'transform 150ms ease',
                transform: hovered ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <IconPlayerPlay style={{ width: rem(18), height: rem(18) }} />
            </ActionIcon>
          </Tooltip>
          
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Group justify="space-between" wrap="nowrap">
              <Box style={{ flex: 1, minWidth: 0 }}>
                <Text fw={500} size="sm" lineClamp={1}>
                  {track.title}
                </Text>
                <Group gap="xs" wrap="nowrap">
                  <Text size="sm" c="dimmed" lineClamp={1}>
                    {track.artist}
                  </Text>
                  {track.genre && (
                    <Badge 
                      size="sm" 
                      variant="light" 
                      radius="xl"
                      px="sm"
                    >
                      {track.genre}
                    </Badge>
                  )}
                </Group>
              </Box>
              {track.duration && (
                <Group gap="xs" wrap="nowrap">
                  <IconClock size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                  <Text size="sm" c="dimmed">
                    {track.duration}
                  </Text>
                </Group>
              )}
            </Group>
          </Box>
        </Group>

        <Group gap="lg" wrap="nowrap">
          {track.plays !== undefined && (
            <Tooltip label="Total plays">
              <Text size="sm" c="dimmed">
                {track.plays.toLocaleString()} plays
              </Text>
            </Tooltip>
          )}
          
          {track.likes !== undefined && (
            <Group gap="xs" wrap="nowrap">
              <Tooltip label="Like track">
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={() => onLike?.(track.id)}
                  radius="xl"
                  style={{
                    transition: 'transform 150ms ease',
                    transform: hovered ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  <IconHeart style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              </Tooltip>
              <Text size="sm" c="dimmed">
                {track.likes.toLocaleString()}
              </Text>
            </Group>
          )}

          {onOptionsClick && (
            <Tooltip label="More options">
              <ActionIcon
                variant="subtle"
                onClick={() => onOptionsClick(track.id)}
                radius="xl"
                style={{
                  transition: 'transform 150ms ease',
                  transform: hovered ? 'scale(1.1)' : 'scale(1)',
                }}
              >
                <IconDotsVertical style={{ width: rem(16), height: rem(16) }} />
              </ActionIcon>
            </Tooltip>
          )}
        </Group>
      </Group>
    </Paper>
  )
}

