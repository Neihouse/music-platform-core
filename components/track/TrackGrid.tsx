"use client"

import { 
  Grid, 
  Card, 
  Image, 
  Text, 
  Group, 
  Badge, 
  ActionIcon, 
  Tooltip,
  Stack,
  rem,
  AspectRatio
} from '@mantine/core'
import { 
  IconPlayerPlay, 
  IconHeart, 
  IconDotsVertical,
  IconClock
} from '@tabler/icons-react'
import { useHover } from '@mantine/hooks'

interface Track {
  id: number
  title: string
  artist: string
  coverArt?: string
  plays?: number
  likes?: number
  genre?: string
  duration?: string
}

interface TrackGridProps {
  tracks: Track[]
  onPlay?: (id: number) => void
  onLike?: (id: number) => void
  onOptionsClick?: (id: number) => void
}

export function TrackGrid({ 
  tracks, 
  onPlay, 
  onLike,
  onOptionsClick 
}: TrackGridProps) {
  return (
    <Grid gutter={{ base: 'sm', sm: 'md', lg: 'lg' }}>
      {tracks.map((track) => (
        <Grid.Col key={track.id} span={{ base: 12, sm: 6, md: 4, lg: 3 }}>
          <TrackCard 
            track={track}
            onPlay={onPlay}
            onLike={onLike}
            onOptionsClick={onOptionsClick}
          />
        </Grid.Col>
      ))}
    </Grid>
  )
}

interface TrackCardProps {
  track: Track
  onPlay?: (id: number) => void
  onLike?: (id: number) => void
  onOptionsClick?: (id: number) => void
}

function TrackCard({ track, onPlay, onLike, onOptionsClick }: TrackCardProps) {
  const { hovered, ref } = useHover()

  return (
    <Card 
      ref={ref}
      p="md" 
      radius="md" 
      withBorder
      style={(theme) => ({
        backgroundColor: theme.white,
        transition: 'all 150ms ease',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? theme.shadows.md : theme.shadows.sm,
      })}
    >
      <Card.Section>
        <AspectRatio ratio={1}>
          <div style={{ position: 'relative' }}>
            <Image
              src={track.coverArt || '/default-cover.jpg'}
              alt={track.title}
              height={240}
              fallbackSrc="https://placehold.co/600x600?text=No+Cover"
            />
            {hovered && (
              <Tooltip label="Play track">
                <ActionIcon
                  variant="filled"
                  color="blue"
                  onClick={() => onPlay?.(track.id)}
                  size="xl"
                  radius="xl"
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%) scale(1.2)',
                    transition: 'transform 150ms ease',
                  }}
                >
                  <IconPlayerPlay style={{ width: rem(24), height: rem(24) }} />
                </ActionIcon>
              </Tooltip>
            )}
          </div>
        </AspectRatio>
      </Card.Section>

      <Stack gap="xs" mt="md">
        <Text fw={500} size="md" lineClamp={1}>
          {track.title}
        </Text>
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

        <Group justify="space-between" wrap="nowrap">
          {track.duration && (
            <Group gap="xs" wrap="nowrap">
              <IconClock size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm" c="dimmed">
                {track.duration}
              </Text>
            </Group>
          )}

          <Group gap="md" wrap="nowrap">
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
                  }}
                >
                  <IconDotsVertical style={{ width: rem(16), height: rem(16) }} />
                </ActionIcon>
              </Tooltip>
            )}
          </Group>
        </Group>
      </Stack>
    </Card>
  )
} 