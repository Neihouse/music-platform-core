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
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useHover } from '@mantine/hooks'

interface VoteButtonProps {
  trackId: string
  initialVotes: number
  userHasVoted: boolean
  onAuthRequired?: () => void
}

export function VoteButton({ 
  trackId, 
  initialVotes, 
  userHasVoted,
  onAuthRequired 
}: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [hasVoted, setHasVoted] = useState(userHasVoted)
  const [isLoading, setIsLoading] = useState(false)
  const { hovered, ref } = useHover()
  const supabase = createClientComponentClient()

  const handleVote = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      onAuthRequired?.()
      return
    }

    setIsLoading(true)
    try {
      if (hasVoted) {
        // Remove vote
        const { error } = await supabase
          .from('votes')
          .delete()
          .match({ user_id: user.id, track_id: trackId })

        if (!error) {
          setVotes(votes - 1)
          setHasVoted(false)
        }
      } else {
        // Add vote
        const { error } = await supabase
          .from('votes')
          .insert({ user_id: user.id, track_id: trackId })

        if (!error) {
          setVotes(votes + 1)
          setHasVoted(true)
        }
      }
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Group gap={8} ref={ref}>
      <Tooltip 
        label={hasVoted ? "Remove vote" : "Vote for this track"}
        position="top"
        withArrow
        arrowSize={6}
      >
        <ActionIcon
          variant={hasVoted ? "filled" : "light"}
          size="lg"
          radius="xl"
          onClick={handleVote}
          loading={isLoading}
          color={hasVoted ? "blue" : "gray"}
          aria-label="Vote for track"
          style={{
            transition: 'all 150ms ease',
            transform: hovered ? 'scale(1.1)' : 'scale(1)',
            '&:active': {
              transform: 'scale(0.95)',
            },
          }}
        >
          <Transition
            mounted={hasVoted}
            transition="pop"
            duration={200}
          >
            {(styles) => (
              <IconThumbUpFilled 
                style={{ ...styles, width: rem(20), height: rem(20) }} 
                stroke={1.5} 
              />
            )}
          </Transition>
          <Transition
            mounted={!hasVoted}
            transition="pop"
            duration={200}
          >
            {(styles) => (
              <IconThumbUp 
                style={{ ...styles, width: rem(20), height: rem(20), position: 'absolute' }} 
                stroke={1.5} 
              />
            )}
          </Transition>
        </ActionIcon>
      </Tooltip>
      <Badge 
        size="lg" 
        variant="light" 
        color={hasVoted ? "blue" : "gray"}
        radius="xl"
        px="md"
        style={{
          transition: 'all 150ms ease',
          transform: hovered ? 'scale(1.05)' : 'scale(1)',
        }}
      >
        {votes.toLocaleString()}
      </Badge>
    </Group>
  )
}

