"use client"

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
  IconShare,
  IconPlaylist,
  IconClock,
  IconMusic,
  IconEdit,
  IconTrash
} from '@tabler/icons-react'
import { useState } from 'react'
import { notifications } from '@mantine/notifications'
import Link from 'next/link'
import { getUser } from '@/utils/auth'
import { useHover } from '@mantine/hooks'

interface PlaylistCardProps {
  id: string | number
  title: string
  creator: string
  coverArt: string
  trackCount: number
  duration?: string
  isLiked?: boolean
  isOwner?: boolean
  onPlay?: () => void
  onLike?: () => void
  onEdit?: () => void
  onDelete?: () => void
}

export function PlaylistCard({
  id,
  title,
  creator,
  coverArt,
  trackCount,
  duration,
  isLiked = false,
  isOwner = false,
  onPlay,
  onLike,
  onEdit,
  onDelete
}: PlaylistCardProps) {
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
        message: 'Please log in to play playlists',
        color: 'red'
      })
      return
    }

    setIsPlaying(!isPlaying)
    if (!isPlaying) {
      // Simulate playlist progress
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
      message: isPlaying ? `Paused "${title}"` : `Now playing playlist "${title}"`,
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
        message: 'Please log in to like playlists',
        color: 'red'
      })
      return
    }

    notifications.show({
      title: 'Success',
      message: isLiked 
        ? `Removed "${title}" from your liked playlists` 
        : `Added "${title}" to your liked playlists`,
      color: 'green'
    })

    onLike?.()
  }

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault()
    notifications.show({
      title: 'Shared',
      message: `Share link for playlist "${title}" copied to clipboard`,
      color: 'green'
    })
  }

  const handleEdit = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isOwner) return

    notifications.show({
      title: 'Editing',
      message: `Opening editor for playlist "${title}"`,
      color: 'blue'
    })

    onEdit?.()
  }

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!isOwner) return

    notifications.show({
      title: 'Warning',
      message: `Are you sure you want to delete playlist "${title}"?`,
      color: 'red'
    })

    onDelete?.()
  }

  return (
    <Card 
      ref={ref}
      component={Link}
      href={`/playlists/${id}`}
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
            fallbackSrc="https://placehold.co/400x400?text=Playlist"
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
              by {creator}
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
                leftSection={<IconShare size={14} />}
                onClick={handleShare}
              >
                Share
              </Menu.Item>
              {isOwner && (
                <>
                  <Menu.Item
                    leftSection={<IconEdit size={14} />}
                    onClick={handleEdit}
                  >
                    Edit
                  </Menu.Item>
                  <Menu.Item
                    leftSection={<IconTrash size={14} />}
                    onClick={handleDelete}
                    color="red"
                  >
                    Delete
                  </Menu.Item>
                </>
              )}
            </Menu.Dropdown>
          </Menu>
        </Group>

        <Group gap="xs" wrap="nowrap">
          <Badge 
            variant="light" 
            size="sm"
            leftSection={<IconMusic size={12} />}
          >
            {trackCount} {trackCount === 1 ? 'track' : 'tracks'}
          </Badge>
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

          <Badge 
            variant="dot" 
            color="blue"
            size="sm"
            leftSection={<IconPlaylist size={12} />}
          >
            Playlist
          </Badge>
        </Group>
      </Stack>
    </Card>
  )
} 