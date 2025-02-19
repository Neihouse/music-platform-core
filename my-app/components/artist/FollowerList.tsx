"use client"

import { useState, useEffect } from 'react'
import { 
  Stack, 
  Text, 
  Paper, 
  Group, 
  Avatar, 
  Button,
  Title,
  Loader,
  Center,
  Alert,
  ScrollArea,
  rem
} from '@mantine/core'
import { IconAlertCircle, IconUserPlus, IconUserMinus } from '@tabler/icons-react'
import { getUser } from '@/utils/auth'
import { notifications } from '@mantine/notifications'

// Mock data for development
const MOCK_FOLLOWERS = [
  {
    id: '1',
    username: 'MusicLover123',
    avatar_url: 'https://picsum.photos/200/200?random=1',
    isFollowing: false
  },
  {
    id: '2',
    username: 'BeatMaster',
    avatar_url: 'https://picsum.photos/200/200?random=2',
    isFollowing: true
  },
  {
    id: '3',
    username: 'RhythmQueen',
    avatar_url: 'https://picsum.photos/200/200?random=3',
    isFollowing: false
  },
  {
    id: '4',
    username: 'SoundExplorer',
    avatar_url: 'https://picsum.photos/200/200?random=4',
    isFollowing: true
  },
  {
    id: '5',
    username: 'MelodyMaker',
    avatar_url: 'https://picsum.photos/200/200?random=5',
    isFollowing: false
  }
];

interface Follower {
  id: string;
  username: string;
  avatar_url: string | null;
  isFollowing: boolean;
}

interface FollowerListProps {
  artistId: string;
}

export function FollowerList({ artistId }: FollowerListProps) {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchFollowers()
  }, [artistId])

  const fetchFollowers = async () => {
    try {
      const user = getUser()
      if (!user) {
        setError('Please log in to view followers')
        return
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setFollowers(MOCK_FOLLOWERS)
    } catch (err) {
      setError('Failed to fetch followers')
      console.error('Error fetching followers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async (followerId: string) => {
    try {
      const user = getUser()
      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to follow users',
          color: 'red'
        })
        return
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      setFollowers(current =>
        current.map(follower =>
          follower.id === followerId
            ? { ...follower, isFollowing: true }
            : follower
        )
      )

      notifications.show({
        title: 'Success',
        message: 'User followed successfully',
        color: 'green'
      })
    } catch (err) {
      console.error('Error following user:', err)
      notifications.show({
        title: 'Error',
        message: 'Failed to follow user',
        color: 'red'
      })
    }
  }

  const handleUnfollow = async (followerId: string) => {
    try {
      const user = getUser()
      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to unfollow users',
          color: 'red'
        })
        return
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      setFollowers(current =>
        current.map(follower =>
          follower.id === followerId
            ? { ...follower, isFollowing: false }
            : follower
        )
      )

      notifications.show({
        title: 'Success',
        message: 'User unfollowed successfully',
        color: 'green'
      })
    } catch (err) {
      console.error('Error unfollowing user:', err)
      notifications.show({
        title: 'Error',
        message: 'Failed to unfollow user',
        color: 'red'
      })
    }
  }

  if (isLoading) {
    return (
      <Center h={200}>
        <Loader size="lg" />
      </Center>
    )
  }

  if (error) {
    return (
      <Alert 
        color="red" 
        title="Error" 
        variant="filled"
        icon={<IconAlertCircle size={rem(16)} />}
      >
        {error}
      </Alert>
    )
  }

  if (followers.length === 0) {
    return (
      <Paper p="xl" radius="md" withBorder>
        <Stack align="center" gap="md">
          <Title order={3}>No Followers Yet</Title>
          <Text c="dimmed" ta="center">
            This artist doesn&apos;t have any followers yet. Be the first to follow!
          </Text>
        </Stack>
      </Paper>
    )
  }

  return (
    <Paper radius="md" withBorder>
      <ScrollArea h={400}>
        <Stack gap={0}>
          {followers.map((follower) => (
            <Group 
              key={follower.id} 
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
              <Group gap="md" wrap="nowrap">
                <Avatar
                  src={follower.avatar_url}
                  alt={follower.username}
                  radius="xl"
                  size="md"
                >
                  {follower.username.charAt(0).toUpperCase()}
                </Avatar>
                <Text fw={500} size="sm">
                  {follower.username}
                </Text>
              </Group>

              <Button
                variant={follower.isFollowing ? "light" : "filled"}
                color={follower.isFollowing ? "gray" : "blue"}
                size="xs"
                radius="xl"
                leftSection={
                  follower.isFollowing 
                    ? <IconUserMinus size={14} /> 
                    : <IconUserPlus size={14} />
                }
                onClick={() => 
                  follower.isFollowing 
                    ? handleUnfollow(follower.id)
                    : handleFollow(follower.id)
                }
              >
                {follower.isFollowing ? 'Unfollow' : 'Follow'}
              </Button>
            </Group>
          ))}
        </Stack>
      </ScrollArea>
    </Paper>
  )
}

