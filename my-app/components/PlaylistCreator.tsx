"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd'
import { 
  Card, 
  TextInput, 
  Button, 
  Stack, 
  Group, 
  Title, 
  Text, 
  Alert, 
  Box,
  Paper,
  Loader,
  Center,
  Transition,
  ActionIcon,
  rem
} from '@mantine/core'
import { 
  IconPlus, 
  IconGripVertical, 
  IconAlertCircle,
  IconMusic,
  IconX
} from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'

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

interface DatabaseTrack {
  id: string
  title: string
  artist: {
    username: string
  }[]
}

interface DatabasePlaylist {
  id: string
  name: string
  tracks: DatabaseTrack[]
}

interface PlaylistFormValues {
  name: string
}

export function PlaylistCreator() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false)
  const supabase = createClientComponentClient()

  const form = useForm<PlaylistFormValues>({
    initialValues: {
      name: '',
    },
    validate: {
      name: (value) => {
        if (!value.trim()) return 'Name is required';
        if (value.length > 50) return 'Name must be 50 characters or less';
        return null;
      },
    },
  })

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

      const transformedPlaylists: Playlist[] = (data as DatabasePlaylist[]).map(playlist => ({
        id: playlist.id,
        name: playlist.name,
        tracks: playlist.tracks.map(track => ({
          id: track.id,
          title: track.title,
          artist: track.artist[0]?.username || 'Unknown Artist'
        }))
      }))

      setPlaylists(transformedPlaylists)
    } catch (err) {
      setError('Failed to fetch playlists')
      console.error('Error fetching playlists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createPlaylist = async (values: PlaylistFormValues) => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      const { data, error } = await supabase
        .from('playlists')
        .insert({ name: values.name, user_id: user.id })
        .select()
        .single()

      if (error) throw error

      setPlaylists([...playlists, { ...data, tracks: [] }])
      form.reset()
      closeForm()
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

  return (
    <Stack gap="lg">
      <Card shadow="sm" padding="lg" radius="md" withBorder>
        <Stack gap="md">
          <Group justify="space-between" align="center">
            <Title order={3}>Your Playlists</Title>
            <Button 
              leftSection={<IconPlus size={16} />}
              variant="light"
              onClick={openForm}
            >
              Create Playlist
            </Button>
          </Group>

          <Transition mounted={formOpened} transition="slide-down" duration={200}>
            {(styles) => (
              <Paper 
                shadow="sm" 
                p="md" 
                radius="md" 
                withBorder
                style={styles}
              >
                <form onSubmit={form.onSubmit(createPlaylist)}>
                  <Stack gap="md">
                    <TextInput
                      placeholder="Enter playlist name"
                      label="Playlist Name"
                      description="Give your playlist a memorable name"
                      radius="md"
                      {...form.getInputProps('name')}
                      rightSection={
                        form.values.name && (
                          <ActionIcon 
                            variant="subtle" 
                            onClick={() => form.setFieldValue('name', '')}
                            size="sm"
                          >
                            <IconX size={14} />
                          </ActionIcon>
                        )
                      }
                    />
                    <Group justify="flex-end" gap="sm">
                      <Button 
                        variant="subtle" 
                        onClick={closeForm}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit"
                        disabled={!form.values.name.trim()}
                      >
                        Create
                      </Button>
                    </Group>
                  </Stack>
                </form>
              </Paper>
            )}
          </Transition>
        </Stack>
      </Card>

      <DragDropContext onDragEnd={onDragEnd}>
        {playlists.map(playlist => (
          <Card key={playlist.id} shadow="sm" padding="lg" radius="md" withBorder>
            <Stack gap="md">
              <Title order={3}>{playlist.name}</Title>
              <Droppable droppableId={playlist.id}>
                {(provided) => (
                  <Box 
                    {...provided.droppableProps} 
                    ref={provided.innerRef}
                  >
                    <Stack gap="xs">
                      {playlist.tracks.map((track, index) => (
                        <Draggable key={track.id} draggableId={track.id} index={index}>
                          {(provided) => (
                            <Paper
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              withBorder
                              p="md"
                              radius="md"
                              style={(theme) => ({
                                backgroundColor: theme.white,
                                transition: 'transform 150ms ease, box-shadow 150ms ease',
                                '&:hover': {
                                  transform: 'translateY(-2px)',
                                  boxShadow: theme.shadows.sm,
                                },
                                ...provided.draggableProps.style,
                              })}
                            >
                              <Group gap="sm" wrap="nowrap">
                                <Box 
                                  {...provided.dragHandleProps}
                                  style={{ cursor: 'grab' }}
                                >
                                  <IconGripVertical 
                                    size={16} 
                                    style={{ color: 'var(--mantine-color-gray-5)' }} 
                                  />
                                </Box>
                                <IconMusic 
                                  size={16} 
                                  style={{ color: 'var(--mantine-color-blue-5)' }} 
                                />
                                <Stack gap={2} style={{ flex: 1, minWidth: 0 }}>
                                  <Text size="sm" fw={500} lineClamp={1}>
                                    {track.title}
                                  </Text>
                                  <Text size="xs" c="dimmed" lineClamp={1}>
                                    {track.artist}
                                  </Text>
                                </Stack>
                              </Group>
                            </Paper>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                      {playlist.tracks.length === 0 && (
                        <Paper 
                          p="xl" 
                          radius="md" 
                          style={(theme) => ({
                            backgroundColor: theme.colors.gray[0],
                            border: `2px dashed ${theme.colors.gray[3]}`,
                          })}
                        >
                          <Stack align="center" gap="xs">
                            <IconMusic 
                              size={24} 
                              style={{ color: 'var(--mantine-color-gray-5)' }} 
                            />
                            <Text c="dimmed" ta="center">
                              Drag and drop tracks here
                            </Text>
                          </Stack>
                        </Paper>
                      )}
                    </Stack>
                  </Box>
                )}
              </Droppable>
            </Stack>
          </Card>
        ))}
      </DragDropContext>
    </Stack>
  )
}

