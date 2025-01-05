"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Plus, GripVertical } from 'lucide-react'

interface Track {
  id: string
  title: string
  artist: string
}

interface Playlist {
  id: string
  name: string
  tracks: Track[]
}

export function PlaylistCreator() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [newPlaylistName, setNewPlaylistName] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchPlaylists()
  }, [])

  const fetchPlaylists = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      const { data, error } = await supabase
        .from('playlists')
        .select('id, name, tracks(id, title, artist:users(username))')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      setPlaylists(data)
    } catch (err) {
      setError('Failed to fetch playlists')
      console.error('Error fetching playlists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createPlaylist = async () => {
    if (!newPlaylistName.trim()) return

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      const { data, error } = await supabase
        .from('playlists')
        .insert({ name: newPlaylistName, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setPlaylists([...playlists, { ...data, tracks: [] }])
      setNewPlaylistName('')
    } catch (err) {
      setError('Failed to create playlist')
      console.error('Error creating playlist:', err)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    const { source, destination } = result
    const playlistIndex = playlists.findIndex(p => p.id === source.droppableId)
    const updatedPlaylists = [...playlists]
    const [reorderedTrack] = updatedPlaylists[playlistIndex].tracks.splice(source.index, 1)
    updatedPlaylists[playlistIndex].tracks.splice(destination.index, 0, reorderedTrack)

    setPlaylists(updatedPlaylists)

    try {
      const { error } = await supabase
        .from('playlist_tracks')
        .update({ position: destination.index })
        .eq('playlist_id', source.droppableId)
        .eq('track_id', reorderedTrack.id)

      if (error) throw error
    } catch (err) {
      setError('Failed to update track order')
      console.error('Error updating track order:', err)
    }
  }

  if (isLoading) return <div>Loading playlists...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Create New Playlist</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex space-x-2">
            <Input
              value={newPlaylistName}
              onChange={(e) => setNewPlaylistName(e.target.value)}
              placeholder="Enter playlist name"
            />
            <Button onClick={createPlaylist}>
              <Plus className="mr-2 h-4 w-4" /> Create
            </Button>
          </div>
        </CardContent>
      </Card>

      <DragDropContext onDragEnd={onDragEnd}>
        {playlists.map(playlist => (
          <Card key={playlist.id}>
            <CardHeader>
              <CardTitle>{playlist.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <Droppable droppableId={playlist.id}>
                {(provided) => (
                  <ul {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                    {playlist.tracks.map((track, index) => (
                      <Draggable key={track.id} draggableId={track.id} index={index}>
                        {(provided) => (
                          <li
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            className="flex items-center space-x-2 p-2 bg-gray-100 rounded"
                          >
                            <span {...provided.dragHandleProps}>
                              <GripVertical className="h-4 w-4 text-gray-500" />
                            </span>
                            <span>{track.title} - {track.artist}</span>
                          </li>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </ul>
                )}
              </Droppable>
            </CardContent>
          </Card>
        ))}
      </DragDropContext>
    </div>
  )
}

