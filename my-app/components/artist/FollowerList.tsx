"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent } from '@/components/ui/card'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import Link from 'next/link'

interface Follower {
  id: string
  username: string
  avatar_url: string | null
}

interface FollowerListProps {
  artistId: string
}

export function FollowerList({ artistId }: FollowerListProps) {
  const [followers, setFollowers] = useState<Follower[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const pageSize = 10
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchFollowers()
  }, [artistId, page])

  const fetchFollowers = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('followers')
        .select('user_id')
        .eq('artist_id', artistId)
        .range((page - 1) * pageSize, page * pageSize - 1)

      if (error) throw error

      const followerIds = data.map(follower => follower.user_id)

      const { data: followerData, error: followerError } = await supabase
        .from('users')
        .select('id, username, avatar_url')
        .in('id', followerIds)

      if (followerError) throw followerError

      setFollowers(prevFollowers => [...prevFollowers, ...followerData])
      setHasMore(followerData.length === pageSize)
    } catch (err) {
      setError('Failed to fetch followers')
      console.error('Error fetching followers:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = () => {
    setPage(prevPage => prevPage + 1)
  }

  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Followers</h2>
      {followers.map(follower => (
        <Card key={follower.id}>
          <CardContent className="flex items-center p-4">
            <Avatar className="h-10 w-10 mr-4">
              <AvatarImage src={follower.avatar_url || undefined} alt={follower.username} />
              <AvatarFallback>{follower.username.charAt(0).toUpperCase()}</AvatarFallback>
            </Avatar>
            <Link href={`/fan/${follower.id}`} className="text-blue-600 hover:underline">
              {follower.username}
            </Link>
          </CardContent>
        </Card>
      ))}
      {isLoading && <div>Loading followers...</div>}
      {hasMore && !isLoading && (
        <Button onClick={loadMore} className="w-full">
          Load More
        </Button>
      )}
    </div>
  )
}

