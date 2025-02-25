"use client"

import { useState, useEffect } from 'react'
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
  IconX,
  IconPlayerPlay,
  IconTrash
} from '@tabler/icons-react'
import { useForm } from '@mantine/form'
import { useDisclosure } from '@mantine/hooks'
import { getUser } from '@/utils/auth'
import { notifications } from '@mantine/notifications'

// Mock data for development
const MOCK_PLAYLISTS = [
  {
    id: '1',
    name: 'Summer Vibes 2024',
    tracks: [
      { id: '1', title: 'Sunny Day', artist: 'Beach Boys' },
      { id: '2', title: 'Ocean Waves', artist: 'Chill Masters' },
      { id: '3', title: 'Tropical Breeze', artist: 'Island Crew' }
    ]
  },
  {
    id: '2',
    name: 'Workout Mix',
    tracks: [
      { id: '4', title: 'Power Up', artist: 'Energy Squad' },
      { id: '5', title: 'Run Fast', artist: 'Fitness Beats' },
      { id: '6', title: 'No Pain No Gain', artist: 'Gym Heroes' }
    ]
  }
];

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

interface PlaylistFormValues {
  name: string
}

export function PlaylistCreator() {
  const [playlists, setPlaylists] = useState<Playlist[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [formOpened, { open: openForm, close: closeForm }] = useDisclosure(false)

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
      const user = getUser()
      if (!user) {
        setError('Please log in to view your playlists')
        return
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000))

      setPlaylists(MOCK_PLAYLISTS)
    } catch (err) {
      setError('Failed to fetch playlists')
      console.error('Error fetching playlists:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const createPlaylist = async (values: PlaylistFormValues) => {
    try {
      const user = getUser()
      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to create playlists',
          color: 'red'
        })
        return
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      const newPlaylist: Playlist = {
        id: Math.random().toString(36).substr(2, 9),
        name: values.name,
        tracks: []
      }

      setPlaylists([newPlaylist, ...playlists])
      form.reset()
      closeForm()

      notifications.show({
        title: 'Success',
        message: 'Playlist created successfully',
        color: 'green'
      })
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to create playlist',
        color: 'red'
      })
      console.error('Error creating playlist:', err)
    }
  }

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return

    try {
      const { source, destination } = result
      const playlistIndex = playlists.findIndex(p => p.id === source.droppableId)
      const updatedPlaylists = [...playlists]
      const [reorderedTrack] = updatedPlaylists[playlistIndex].tracks.splice(source.index, 1)
      updatedPlaylists[playlistIndex].tracks.splice(destination.index, 0, reorderedTrack)

      setPlaylists(updatedPlaylists)

      notifications.show({
        title: 'Success',
        message: 'Track order updated',
        color: 'green'
      })
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to update track order',
        color: 'red'
      })
      console.error('Error updating track order:', err)
    }
  }

  const handlePlay = (trackId: string) => {
    notifications.show({
      title: 'Playing',
      message: 'Track started playing',
      color: 'blue'
    })
  }

  const handleRemoveTrack = (playlistId: string, trackId: string) => {
    try {
      const updatedPlaylists = playlists.map(playlist => {
        if (playlist.id === playlistId) {
          return {
            ...playlist,
            tracks: playlist.tracks.filter(track => track.id !== trackId)
          }
        }
        return playlist
      })

      setPlaylists(updatedPlaylists)

      notifications.show({
        title: 'Success',
        message: 'Track removed from playlist',
        color: 'green'
      })
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: 'Failed to remove track',
        color: 'red'
      })
      console.error('Error removing track:', err)
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

          <DragDropContext onDragEnd={onDragEnd}>
            {playlists.length > 0 ? (
              <Stack gap="md">
                {playlists.map((playlist) => (
                  <Paper 
                    key={playlist.id} 
                    shadow="sm" 
                    p="md" 
                    radius="md" 
                    withBorder
                  >
                    <Stack gap="sm">
                      <Title order={4}>{playlist.name}</Title>
                      <Droppable droppableId={playlist.id}>
                        {(provided) => (
                          <Box
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                          >
                            {playlist.tracks.length > 0 ? (
                              <Stack gap={4}>
                                {playlist.tracks.map((track, index) => (
                                  <Draggable
                                    key={track.id}
                                    draggableId={track.id}
                                    index={index}
                                  >
                                    {(provided) => (
                                      <Paper
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        shadow="xs"
                                        p="sm"
                                        radius="md"
                                      >
                                        <Group justify="space-between" wrap="nowrap">
                                          <Group gap="sm" wrap="nowrap">
                                            <ActionIcon
                                              {...provided.dragHandleProps}
                                              variant="subtle"
                                              color="gray"
                                            >
                                              <IconGripVertical size={16} />
                                            </ActionIcon>
                                            <Stack gap={2}>
                                              <Text fw={500} size="sm">
                                                {track.title}
                                              </Text>
                                              <Text size="xs" c="dimmed">
                                                {track.artist}
                                              </Text>
                                            </Stack>
                                          </Group>
                                          <Group gap="xs">
                                            <ActionIcon
                                              variant="light"
                                              color="blue"
                                              onClick={() => handlePlay(track.id)}
                                            >
                                              <IconPlayerPlay size={16} />
                                            </ActionIcon>
                                            <ActionIcon
                                              variant="light"
                                              color="red"
                                              onClick={() => handleRemoveTrack(playlist.id, track.id)}
                                            >
                                              <IconTrash size={16} />
                                            </ActionIcon>
                                          </Group>
                                        </Group>
                                      </Paper>
                                    )}
                                  </Draggable>
                                ))}
                              </Stack>
                            ) : (
                              <Text c="dimmed" ta="center" py="xl">
                                No tracks in this playlist
                              </Text>
                            )}
                            {provided.placeholder}
                          </Box>
                        )}
                      </Droppable>
                    </Stack>
                  </Paper>
                ))}
              </Stack>
            ) : (
              <Alert 
                color="gray" 
                variant="light"
                icon={<IconMusic size={rem(16)} />}
              >
                You haven&apos;t created any playlists yet
              </Alert>
            )}
          </DragDropContext>
        </Stack>
      </Card>
    </Stack>
  )
}

