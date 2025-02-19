"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
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

interface DatabaseResponse {
  follower: {
    id: string;
    username: string;
    avatar_url: string | null;
  };
}

interface Follower {
  id: string;
  username: string;
  avatar_url: string | null;
  isFollowing?: boolean;
}

interface FollowerListProps {
  artistId: string;
}

export function FollowerList({ artistId }: FollowerListProps) {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchFollowers()
  }, [artistId])

  const fetchFollowers = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()

      const { data, error } = await supabase
        .from('followers')
        .select(`
          follower:users!followers_follower_id_fkey (
            id,
            username,
            avatar_url
          )
        `)
        .eq('artist_id', artistId)
        .order('created_at', { ascending: false })

      if (error) throw error

      // If user is logged in, check which followers they're following
      let followingData: string[] = []
      if (user) {
        const { data: following } = await supabase
          .from('followers')
          .select('artist_id')
          .eq('follower_id', user.id)

        followingData = following?.map(f => f.artist_id) || []
      }

      const transformedFollowers: Follower[] = (data as unknown as DatabaseResponse[]).map(item => ({
        id: item.follower.id,
        username: item.follower.username,
        avatar_url: item.follower.avatar_url,
        isFollowing: followingData.includes(item.follower.id)
      }))

      setFollowers(transformedFollowers)
    } catch (err) {
      setError('Failed to fetch followers')
      console.error('Error fetching followers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleFollow = async (followerId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('followers')
        .insert({ follower_id: user.id, artist_id: followerId })

      if (error) throw error

      setFollowers(current =>
        current.map(follower =>
          follower.id === followerId
            ? { ...follower, isFollowing: true }
            : follower
        )
      )
    } catch (err) {
      console.error('Error following user:', err)
    }
  }

  const handleUnfollow = async (followerId: string) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('followers')
        .delete()
        .match({ follower_id: user.id, artist_id: followerId })

      if (error) throw error

      setFollowers(current =>
        current.map(follower =>
          follower.id === followerId
            ? { ...follower, isFollowing: false }
            : follower
        )
      )
    } catch (err) {
      console.error('Error unfollowing user:', err)
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

