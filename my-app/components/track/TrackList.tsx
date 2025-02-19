"use client"

import { 
  Paper, 
  Group, 
  Text, 
  ActionIcon, 
  Stack,
  Avatar,
  Badge,
  Tooltip,
  Menu,
  UnstyledButton,
  Transition,
  rem,
  Skeleton,
  Container,
  useMantineTheme,
  Box
} from '@mantine/core'
import { 
  IconPlayerPlay, 
  IconPlayerPause,
  IconHeart,
  IconHeartFilled,
  IconDotsVertical,
  IconPlaylistAdd,
  IconShare,
  IconDownload,
  IconInfoCircle
} from '@tabler/icons-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import Link from 'next/link'
import { getUser } from '@/utils/auth'
import { useViewportSize } from '@mantine/hooks'
import { useVirtualizer } from '@tanstack/react-virtual'

interface Track {
  id: number
  title: string
  artist: string
  plays?: number
  likes?: number
  genre?: string
  duration?: string
  cover_url?: string
  isLiked?: boolean
  isPlaying?: boolean
}

interface TrackListProps {
  tracks: Track[]
  onPlay?: (id: number) => void
  onLike?: (id: number) => void
  showHeader?: boolean
  isLoading?: boolean
}

export function TrackList({ 
  tracks, 
  onPlay, 
  onLike, 
  showHeader = true,
  isLoading = false 
}: TrackListProps) {
  const theme = useMantineTheme()
  const { width } = useViewportSize()
  const isMobile = width < theme.breakpoints.sm
  
  const [playingTrackId, setPlayingTrackId] = useState<number | null>(null)
  const [hoveredTrackId, setHoveredTrackId] = useState<number | null>(null)

  // Virtualization setup
  const parentRef = React.useRef<HTMLDivElement>(null)
  const rowVirtualizer = useVirtualizer({
    count: isLoading ? 10 : tracks.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 80, // Estimated row height
    overscan: 5
  })

  const handlePlay = (track: Track) => {
    const user = getUser()
    if (!user) {
      notifications.show({
        title: 'Error',
        message: 'Please log in to play tracks',
        color: 'red'
      })
      return
    }

    if (playingTrackId === track.id) {
      setPlayingTrackId(null)
      notifications.show({
        title: 'Paused',
        message: `Paused "${track.title}"`,
        color: 'blue'
      })
    } else {
      setPlayingTrackId(track.id)
      notifications.show({
        title: 'Playing',
        message: `Now playing "${track.title}" by ${track.artist}`,
        color: 'blue'
      })
    }

    onPlay?.(track.id)
  }

  const handleLike = (track: Track) => {
    const user = getUser()
    if (!user) {
      notifications.show({
        title: 'Error',
        message: 'Please log in to like tracks',
        color: 'red'
      })
      return
    }

    notifications.show({
      title: 'Success',
      message: track.isLiked 
        ? `Removed "${track.title}" from your likes` 
        : `Added "${track.title}" to your likes`,
      color: 'green'
    })

    onLike?.(track.id)
  }

  const handleAddToPlaylist = (track: Track) => {
    const user = getUser()
    if (!user) {
      notifications.show({
        title: 'Error',
        message: 'Please log in to add tracks to playlists',
        color: 'red'
      })
      return
    }

    notifications.show({
      title: 'Coming Soon',
      message: 'Playlist functionality will be available soon!',
      color: 'blue'
    })
  }

  const handleShare = (track: Track) => {
    notifications.show({
      title: 'Shared',
      message: `Share link for "${track.title}" copied to clipboard`,
      color: 'green'
    })
  }

  const handleDownload = (track: Track) => {
    const user = getUser()
    if (!user) {
      notifications.show({
        title: 'Error',
        message: 'Please log in to download tracks',
        color: 'red'
      })
      return
    }

    notifications.show({
      title: 'Downloading',
      message: `Starting download for "${track.title}"`,
      color: 'blue'
    })
  }

  const TrackItem = ({ track, index }: { track: Track; index: number }) => (
    <UnstyledButton
      component={Link}
      href={`/tracks/${track.id}`}
      onMouseEnter={() => setHoveredTrackId(track.id)}
      onMouseLeave={() => setHoveredTrackId(null)}
      w="100%"
    >
      <Group 
        wrap="nowrap" 
        justify="space-between" 
        p="md"
        style={(theme) => ({
          borderBottom: `1px solid ${theme.colors.gray[2]}`,
          backgroundColor: 
            playingTrackId === track.id 
              ? theme.colors.blue[0] 
              : hoveredTrackId === track.id 
              ? theme.colors.gray[0] 
              : 'transparent',
          '&:last-child': {
            borderBottom: 'none'
          }
        })}
      >
        <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
          <Avatar 
            src={track.cover_url || 'https://placehold.co/400x400?text=Cover'} 
            size={isMobile ? "md" : "lg"}
            radius="md"
          >
            {track.title[0]}
          </Avatar>
          <div style={{ flex: 1 }}>
            <Text size={isMobile ? "xs" : "sm"} fw={500} lineClamp={1}>
              {track.title}
            </Text>
            <Text size="xs" c="dimmed" lineClamp={1}>
              {track.artist}
            </Text>
          </div>
        </Group>

        {!isMobile && (
          <Group gap="xl" wrap="nowrap">
            <Badge variant="light" size="sm" w={100} style={{ textTransform: 'none' }}>
              {track.genre || 'Unknown'}
            </Badge>
            <Text size="sm" c="dimmed" w={80} ta="center">
              {track.duration || '--:--'}
            </Text>
            <Text size="sm" c="dimmed" w={80} ta="center">
              {track.plays?.toLocaleString() || '0'}
            </Text>
            <Text size="sm" c="dimmed" w={80} ta="center">
              {track.likes?.toLocaleString() || '0'}
            </Text>
          </Group>
        )}

        <Group gap="xs">
          <Tooltip label={playingTrackId === track.id ? 'Pause' : 'Play'}>
            <ActionIcon
              variant="light"
              color="blue"
              onClick={(e) => {
                e.preventDefault()
                handlePlay(track)
              }}
            >
              {playingTrackId === track.id ? (
                <IconPlayerPause size={16} />
              ) : (
                <IconPlayerPlay size={16} />
              )}
            </ActionIcon>
          </Tooltip>

          <Tooltip label={track.isLiked ? 'Unlike' : 'Like'}>
            <ActionIcon
              variant="light"
              color="red"
              onClick={(e) => {
                e.preventDefault()
                handleLike(track)
              }}
            >
              {track.isLiked ? (
                <IconHeartFilled size={16} />
              ) : (
                <IconHeart size={16} />
              )}
            </ActionIcon>
          </Tooltip>

          <Menu position="bottom-end" withinPortal>
            <Menu.Target>
              <ActionIcon
                variant="subtle"
                onClick={(e) => e.preventDefault()}
              >
                <IconDotsVertical size={16} />
              </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<IconPlaylistAdd size={14} />}
                onClick={(e) => {
                  e.preventDefault()
                  handleAddToPlaylist(track)
                }}
              >
                Add to Playlist
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconShare size={14} />}
                onClick={(e) => {
                  e.preventDefault()
                  handleShare(track)
                }}
              >
                Share
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconDownload size={14} />}
                onClick={(e) => {
                  e.preventDefault()
                  handleDownload(track)
                }}
              >
                Download
              </Menu.Item>
              <Menu.Item 
                leftSection={<IconInfoCircle size={14} />}
                component={Link}
                href={`/tracks/${track.id}`}
              >
                View Details
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      </Group>
    </UnstyledButton>
  )

  const LoadingSkeleton = ({ index }: { index: number }) => (
    <Group 
      wrap="nowrap" 
      justify="space-between" 
      p="md"
      style={(theme) => ({
        borderBottom: `1px solid ${theme.colors.gray[2]}`,
        '&:last-child': {
          borderBottom: 'none'
        }
      })}
    >
      <Group gap="md" wrap="nowrap" style={{ flex: 1 }}>
        <Skeleton height={isMobile ? 40 : 64} width={isMobile ? 40 : 64} radius="md" />
        <div style={{ flex: 1 }}>
          <Skeleton height={16} width="60%" mb={8} />
          <Skeleton height={12} width="40%" />
        </div>
      </Group>

      {!isMobile && (
        <Group gap="xl" wrap="nowrap">
          <Skeleton height={20} width={100} radius="xl" />
          <Skeleton height={16} width={80} />
          <Skeleton height={16} width={80} />
          <Skeleton height={16} width={80} />
        </Group>
      )}

      <Group gap="xs">
        <Skeleton height={30} width={30} radius="xl" />
        <Skeleton height={30} width={30} radius="xl" />
        <Skeleton height={30} width={30} radius="xl" />
      </Group>
    </Group>
  )

  return (
    <Paper radius="md" withBorder>
      {showHeader && !isMobile && (
        <Group 
          p="md" 
          justify="space-between" 
          style={(theme) => ({
            borderBottom: `1px solid ${theme.colors.gray[2]}`
          })}
        >
          <Text fw={500} size="sm" c="dimmed">Title</Text>
          <Group gap="xl" pr={50}>
            <Text fw={500} size="sm" c="dimmed" w={100} ta="center">Genre</Text>
            <Text fw={500} size="sm" c="dimmed" w={80} ta="center">Duration</Text>
            <Text fw={500} size="sm" c="dimmed" w={80} ta="center">Plays</Text>
            <Text fw={500} size="sm" c="dimmed" w={80} ta="center">Likes</Text>
          </Group>
        </Group>
      )}

      <Box
        ref={parentRef}
        h={Math.min(tracks.length * 80, 600)}
        style={{ overflowY: 'auto' }}
      >
        <Box
          h={rowVirtualizer.getTotalSize()}
          pos="relative"
          w="100%"
        >
          {rowVirtualizer.getVirtualItems().map((virtualRow) => (
            <Box
              key={virtualRow.index}
              pos="absolute"
              top={0}
              left={0}
              w="100%"
              h={virtualRow.size}
              transform={`translateY(${virtualRow.start}px)`}
            >
              {isLoading ? (
                <LoadingSkeleton index={virtualRow.index} />
              ) : (
                <TrackItem 
                  track={tracks[virtualRow.index]} 
                  index={virtualRow.index} 
                />
              )}
            </Box>
          ))}
        </Box>
      </Box>
    </Paper>
  )
}

