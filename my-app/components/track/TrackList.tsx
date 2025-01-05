import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { ChevronUp } from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
  votes: number
}

interface TrackListProps {
  tracks: Track[]
  onVote: (trackId: string) => void
}

export function TrackList({ tracks, onVote }: TrackListProps) {
  return (
    <div className="space-y-4">
      {tracks.map((track) => (
        <Card key={track.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {track.title}
            </CardTitle>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => onVote(track.id)}
              aria-label={`Upvote ${track.title}`}
            >
              <ChevronUp className="h-4 w-4" />
              {track.votes}
            </Button>
          </CardHeader>
          <CardContent>
            <p className="text-xs text-muted-foreground">{track.artist}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}

