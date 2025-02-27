"use client"

import { Card, Group, Stack, Text, Title, RingProgress } from '@mantine/core'
import { IconHeadphones, IconHeart, IconShare } from '@tabler/icons-react'
import { useEffect, useState } from 'react'

interface TrackAnalytics {
  plays: number
  likes: number
  shares: number
}

interface TrackAnalyticsProps {
  trackId: string
}

const MOCK_ANALYTICS: Record<string, TrackAnalytics> = {
  'track-1': { plays: 1250, likes: 432, shares: 89 },
  'track-2': { plays: 850, likes: 234, shares: 45 },
  // Add more mock data as needed
}

export function TrackAnalytics({ trackId }: TrackAnalyticsProps) {
  const [analytics, setAnalytics] = useState<TrackAnalytics>({ plays: 0, likes: 0, shares: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate API call delay
    const fetchAnalytics = async () => {
      setLoading(true)
      try {
        // Simulate network delay
        await new Promise(resolve => setTimeout(resolve, 500))
        
        const data = MOCK_ANALYTICS[trackId] || { plays: 0, likes: 0, shares: 0 }
        setAnalytics(data)
      } catch (error) {
        console.error('Error fetching analytics:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchAnalytics()
  }, [trackId])

  // Calculate engagement rate (likes + shares / plays * 100)
  const engagementRate = analytics.plays > 0
    ? ((analytics.likes + analytics.shares) / analytics.plays) * 100
    : 0

  return (
    <Card withBorder radius="md" padding="xl">
      <Title order={2} size="h3" mb="xl">Track Analytics</Title>

      <Group justify="space-between" align="flex-start">
        <Stack gap="lg">
          <Group gap="xl">
            <Group gap="xs">
              <IconHeadphones size={20} style={{ color: 'var(--mantine-color-blue-6)' }} />
              <Text size="lg" fw={500}>{analytics.plays.toLocaleString()}</Text>
              <Text size="sm" c="dimmed">Plays</Text>
            </Group>

            <Group gap="xs">
              <IconHeart size={20} style={{ color: 'var(--mantine-color-red-6)' }} />
              <Text size="lg" fw={500}>{analytics.likes.toLocaleString()}</Text>
              <Text size="sm" c="dimmed">Likes</Text>
            </Group>

            <Group gap="xs">
              <IconShare size={20} style={{ color: 'var(--mantine-color-green-6)' }} />
              <Text size="lg" fw={500}>{analytics.shares.toLocaleString()}</Text>
              <Text size="sm" c="dimmed">Shares</Text>
            </Group>
          </Group>

          <Stack gap="xs">
            <Text size="sm" fw={500}>Engagement Rate</Text>
            <Text size="xs" c="dimmed">
              Calculated from likes and shares relative to total plays
            </Text>
          </Stack>
        </Stack>

        <RingProgress
          size={120}
          thickness={12}
          roundCaps
          sections={[{ value: engagementRate, color: 'blue' }]}
          label={
            <Text ta="center" size="sm" fw={700}>
              {engagementRate.toFixed(1)}%
            </Text>
          }
        />
      </Group>
    </Card>
  )
}

