"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

interface CommentInputProps {
  trackId: string
  onCommentAdded: () => void
}

export function CommentInput({ trackId, onCommentAdded }: CommentInputProps) {
  const [comment, setComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const supabase = createClientComponentClient()

  const handleSubmit = async () => {
    if (!comment.trim()) return

    setIsSubmitting(true)
    const { data: { user } } = await supabase.auth.getUser()

    if (user) {
      const { error } = await supabase
        .from('comments')
        .insert({ user_id: user.id, track_id: trackId, content: comment })

      if (!error) {
        setComment('')
        onCommentAdded()
      } else {
        console.error('Error submitting comment:', error)
      }
    }

    setIsSubmitting(false)
  }

  return (
    <div className="space-y-2">
      <Textarea
        placeholder="Write a comment..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button onClick={handleSubmit} disabled={isSubmitting}>
        {isSubmitting ? 'Submitting...' : 'Submit Comment'}
      </Button>
    </div>
  )
}

