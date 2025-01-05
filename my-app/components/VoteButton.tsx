"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { ThumbsUp } from 'lucide-react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface VoteButtonProps {
  trackId: string
  initialVotes: number
  userHasVoted: boolean
}

export function VoteButton({ trackId, initialVotes, userHasVoted }: VoteButtonProps) {
  const [votes, setVotes] = useState(initialVotes)
  const [hasVoted, setHasVoted] = useState(userHasVoted)
  const supabase = createClientComponentClient()

  const handleVote = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      // Handle unauthenticated user (e.g., show login prompt)
      return
    }

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
  }

  return (
    <Button
      variant={hasVoted ? "default" : "outline"}
      size="sm"
      onClick={handleVote}
    >
      <ThumbsUp className="h-4 w-4 mr-2" />
      {votes}
    </Button>
  )
}

