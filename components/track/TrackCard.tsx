"use client";

import { 
  Card, 
  Image, 
  Text, 
  Group, 
  Stack,
  ActionIcon,
  Badge,
  Tooltip,
  Menu,
  Progress,
  Transition,
  Box,
  rem,
  useMantineTheme,
  useComputedColorScheme
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
  IconInfoCircle,
  IconClock,
  IconChartBar
} from '@tabler/icons-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import Link from 'next/link'
import { getUser } from '@/utils/auth'
import { useHover } from '@mantine/hooks'

interface TrackCardProps {
  id: string | number
  title: string
  artist: string
  coverArt: string
  genre?: string
  duration?: string
  plays?: number
  likes?: number
  isLiked?: boolean
  onPlay?: () => void
  onLike?: () => void
}

export function TrackCard({
  id,
  title,
  artist,
  coverArt,
  genre,
  duration,
  plays,
  likes,
  isLiked = false,
  onPlay,
  onLike
}: TrackCardProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [progress, setProgress] = useState(0)
  const { hovered, ref } = useHover()
  const theme = useMantineTheme()
  const computedColorScheme = useComputedColorScheme('light')

  const handlePlay = (e: React.MouseEvent) => {
    e.preventDefault()
    const user = getUser()
    if (!user) {
      notifications.show({
        title: 'Error',
        message: 'Please log in to play tracks',
        color: 'red'
      })
      return
    }

    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      // Simulate track progress
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval)
            setIsPlaying(false)
            return 0
          }
          return prev + 1
        })
      }, 1000)
    }

    notifications.show({
      title: isPlaying ? 'Paused' : 'Playing',
      message: isPlaying ? `Paused "${title}"` : `Now playing "${title}" by ${artist}`,
      color: 'blue'
    })

    onPlay?.()
  }

  const handleLike = (e: React.MouseEvent) => {
    e.preventDefault()
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
      message: isLiked 
        ? `Removed "${title}" from your likes` 
        : `Added "${title}" to your likes`,
      color: 'green'
    })

    onLike?.()
  }

  const handleAddToPlaylist = (e: React.MouseEvent) => {
    e.preventDefault()
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

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    notifications.show({
      title: 'Shared',
      message: `Share link for "${title}" copied to clipboard`,
      color: 'green'
    })
  }

  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault()
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
      message: `Starting download for "${title}"`,
      color: 'blue'
    })
  }

  return (
    <Card 
      ref={ref}
      component={Link}
      href={`/tracks/${id}`}
      padding="md" 
      radius="md" 
      withBorder
      style={{
        backgroundColor: computedColorScheme === 'dark' ? theme.colors.dark[7] : theme.white,
        transition: 'all 150ms ease',
        transform: hovered ? 'translateY(-5px)' : 'none',
        boxShadow: hovered ? theme.shadows.md : theme.shadows.sm,
      }}
    >
      <Card.Section>
        <Box pos="relative">
          <Image
            src={coverArt}
            height={200}
            alt={title}
            fallbackSrc="https://placehold.co/400x400?text=Cover"
          />
          <Transition mounted={hovered} transition="fade" duration={200}>
            {(styles) => (
              <Box
                pos="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                style={{
                  ...styles,
                  background: 'rgba(0, 0, 0, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <ActionIcon
                  variant="filled"
                  color="blue"
                  size="xl"
                  radius="xl"
                  onClick={handlePlay}
                >
                  {isPlaying ? (
                    <IconPlayerPause style={{ width: rem(24), height: rem(24) }} />
                  ) : (
                    <IconPlayerPlay style={{ width: rem(24), height: rem(24) }} />
                  )}
                </ActionIcon>
              </Box>
            )}
          </Transition>
        </Box>
      </Card.Section>

      {isPlaying && (
        <Progress 
          value={progress} 
          size="xs" 
          radius={0}
          animated={isPlaying}
        />
      )}

      <Stack gap="xs" mt="md">
        <Group justify="space-between" wrap="nowrap">
          <Box style={{ flex: 1 }}>
            <Text fw={500} size="md" lineClamp={1}>
              {title}
            </Text>
            <Text size="sm" c="dimmed" lineClamp={1}>
              {artist}
            </Text>
          </Box>
          <Menu position="bottom-end" withArrow>
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
                onClick={handleAddToPlaylist}
              >
                Add to Playlist
              </Menu.Item>
              <Menu.Item
                leftSection={<IconShare size={14} />}
                onClick={handleShare}
              >
                Share
              </Menu.Item>
              <Menu.Item
                leftSection={<IconDownload size={14} />}
                onClick={handleDownload}
              >
                Download
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item
                leftSection={<IconInfoCircle size={14} />}
                component={Link}
                href={`/tracks/${id}`}
              >
                View Details
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Group gap="xs" wrap="nowrap">
          {genre && (
            <Badge variant="light" size="sm">
              {genre}
            </Badge>
          )}
          {duration && (
            <Group gap={4} wrap="nowrap">
              <IconClock size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm" c="dimmed">
                {duration}
              </Text>
            </Group>
          )}
        </Group>

        <Group justify="space-between" wrap="nowrap">
          <Group gap="xs" wrap="nowrap">
            <Tooltip label={isLiked ? 'Unlike' : 'Like'}>
              <ActionIcon
                variant="light"
                color="red"
                onClick={handleLike}
              >
                {isLiked ? (
                  <IconHeartFilled size={16} />
                ) : (
                  <IconHeart size={16} />
                )}
              </ActionIcon>
            </Tooltip>
            <Text size="sm" c="dimmed">
              {likes?.toLocaleString() || '0'}
            </Text>
          </Group>

          {plays !== undefined && (
            <Group gap={4} wrap="nowrap">
              <IconChartBar size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
              <Text size="sm" c="dimmed">
                {plays.toLocaleString()}
              </Text>
            </Group>
          )}
        </Group>
      </Stack>
    </Card>
  )
}
