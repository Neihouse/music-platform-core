"use client"

import { useState } from 'react'
import { 
  ActionIcon, 
  Badge, 
  Tooltip, 
  Group,
  Transition,
  rem
} from '@mantine/core'
import { IconThumbUp, IconThumbUpFilled } from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getUser } from '@/utils/auth'

interface VoteButtonProps {
  trackId: string
  initialVotes?: number
  initialVoted?: boolean
}

export function VoteButton({ trackId, initialVotes = 0, initialVoted = false }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [voted, setVoted] = useState(initialVoted)
  const [loading, setLoading] = useState(false)

  const handleVote = async () => {
    try {
      setLoading(true)
      const user = getUser()

      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to vote',
          color: 'red',
        })
        return
      }

      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500))

      if (voted) {
        setVotes(prev => prev - 1)
        setVoted(false)
        notifications.show({
          title: 'Success',
          message: 'Vote removed',
          color: 'blue',
        })
      } else {
        setVotes(prev => prev + 1)
        setVoted(true)
        notifications.show({
          title: 'Success',
          message: 'Vote added',
          color: 'green',
        })
      }
    } catch (error) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update vote',
        color: 'red',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Group gap={8}>
      <Tooltip 
        label={voted ? "Remove vote" : "Vote for this track"}
        position="top"
        withArrow
        arrowSize={6}
      >
        <ActionIcon
          variant={voted ? 'filled' : 'light'}
          size="lg"
          radius="xl"
          onClick={handleVote}
          loading={loading}
          color={voted ? 'red' : 'gray'}
          aria-label="Vote for track"
        >
          <IconThumbUp size={20} />
        </ActionIcon>
      </Tooltip>
      <Badge 
        size="lg" 
        variant="light" 
        color={voted ? 'red' : 'gray'}
        radius="xl"
        px="md"
      >
        {votes.toLocaleString()}
      </Badge>
    </Group>
  )
}

