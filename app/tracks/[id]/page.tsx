"use client";

import { Container, Group, Stack, Title, Text, Button, Loader, Center } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { TrackPlayer } from '@/components/track/TrackPlayer'
import { TrackAnalytics } from '@/components/track/TrackAnalytics'
import { notifications } from '@mantine/notifications'
import { getUser } from '@/utils/auth'

interface Track {
  id: string
  title: string
  artist: string
  coverUrl: string
  audioUrl: string
  genre: string
  description: string
  createdAt: string
  userId: string
}

const MOCK_TRACKS: Record<string, Track> = {
  'track-1': {
    id: 'track-1',
    title: 'Summer Vibes',
    artist: 'DJ Cool',
    coverUrl: '/mock/cover1.jpg',
    audioUrl: '/mock/track1.mp3',
    genre: 'Electronic',
    description: 'A chill electronic track perfect for summer days.',
    createdAt: '2024-03-15T10:00:00Z',
    userId: 'user-1'
  },
  // Add more mock tracks as needed
}

export default function TrackPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [track, setTrack] = useState<Track | null>(null)
  const [loading, setLoading] = useState(true)
  const user = getUser()

  useEffect(() => {
    const fetchTrack = async () => {
      setLoading(true)
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const data = MOCK_TRACKS[params.id]
        if (!data) {
          throw new Error('Track not found')
        }
        
        setTrack(data)
      } catch (error) {
        console.error('Error fetching track:', error)
        notifications.show({
          title: 'Error',
          message: 'Failed to load track',
          color: 'red'
        })
        router.push('/tracks')
      } finally {
        setLoading(false)
      }
    }

    fetchTrack()
  }, [params.id, router])

  const handleDelete = async () => {
    if (!track) return
    
    if (!confirm('Are you sure you want to delete this track?')) {
      return
    }

    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 500))
      
      notifications.show({
        title: 'Success',
        message: 'Track deleted successfully',
        color: 'green'
      })
      
      router.push('/tracks')
    } catch (error) {
      console.error('Error deleting track:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to delete track',
        color: 'red'
      })
    }
  }

  if (loading) {
    return (
      <Center h="100vh">
        <Loader size="xl" />
      </Center>
    )
  }

  if (!track) {
    return null
  }

  const isOwner = user?.id === track.userId

  return (
    <Container size="lg" py="xl">
      <Stack gap="xl">
        <Group justify="space-between" align="flex-start">
          <Stack gap="xs">
            <Title>{track.title}</Title>
            <Text size="lg" c="dimmed">{track.artist}</Text>
          </Stack>

          {isOwner && (
            <Group>
              <Button
                variant="light"
                leftSection={<IconEdit size={20} />}
                onClick={() => router.push(`/tracks/${track.id}/edit`)}
              >
                Edit
              </Button>
              <Button
                variant="light"
                color="red"
                leftSection={<IconTrash size={20} />}
                onClick={handleDelete}
              >
                Delete
              </Button>
            </Group>
          )}
        </Group>

        <TrackPlayer
          track={{
            id: track.id,
            title: track.title,
            artist: track.artist,
            coverUrl: track.coverUrl,
            audioUrl: track.audioUrl
          }}
        />

        <Text>{track.description}</Text>

        <TrackAnalytics trackId={track.id} />
      </Stack>
    </Container>
  )
}
