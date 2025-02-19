"use client"

import { useState, useRef } from 'react'
import { 
  TextInput, 
  Loader, 
  Box, 
  Text, 
  Group, 
  Avatar, 
  Paper,
  ActionIcon,
  Transition,
  Stack,
  Badge,
  Divider,
  UnstyledButton,
  rem
} from '@mantine/core'
import { 
  IconSearch,
  IconPlayerPlay,
  IconHeart,
  IconX,
  IconMusic,
  IconMicrophone,
  IconClock
} from '@tabler/icons-react'
import Link from 'next/link'
import { useClickOutside, useDebouncedValue } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'

// Mock data for development
const MOCK_DATA = {
  recentSearches: [
    'Summer Vibes',
    'Night Drive',
    'Chill Mix',
    'Workout Playlist'
  ],
  tracks: [
    { 
      id: '1', 
      title: 'Summer Vibes', 
      artist: 'DJ Cool', 
      cover_url: 'https://picsum.photos/100',
      genre: 'Electronic',
      duration: '3:45'
    },
    { 
      id: '2', 
      title: 'Night Drive', 
      artist: 'The Cruisers', 
      cover_url: 'https://picsum.photos/101',
      genre: 'Rock',
      duration: '4:20'
    },
    { 
      id: '3', 
      title: 'Mountain High', 
      artist: 'Nature Sounds', 
      cover_url: 'https://picsum.photos/102',
      genre: 'Ambient',
      duration: '5:10'
    },
  ],
  artists: [
    { 
      id: '1', 
      name: 'DJ Cool', 
      avatar_url: 'https://picsum.photos/200',
      followers: 12345,
      genres: ['Electronic', 'House']
    },
    { 
      id: '2', 
      name: 'The Cruisers', 
      avatar_url: 'https://picsum.photos/201',
      followers: 8765,
      genres: ['Rock', 'Alternative']
    },
    { 
      id: '3', 
      name: 'Nature Sounds', 
      avatar_url: 'https://picsum.photos/202',
      followers: 5432,
      genres: ['Ambient', 'Meditation']
    },
  ],
}

interface Track {
  id: string
  title: string
  artist: string
  cover_url: string
  genre: string
  duration: string
}

interface Artist {
  id: string
  name: string
  avatar_url: string
  followers: number
  genres: string[]
}

export function SearchBar() {
  const [value, setValue] = useState('')
  const [debouncedValue] = useDebouncedValue(value, 300)
  const [loading, setLoading] = useState(false)
  const [focused, setFocused] = useState(false)
  const [results, setResults] = useState<{
    tracks: Track[]
    artists: Artist[]
  }>({ tracks: [], artists: [] })
  const wrapperRef = useClickOutside(() => setFocused(false))

  const handleSearch = async (query: string) => {
    setValue(query)

    if (query.length < 2) {
      setResults({ tracks: [], artists: [] })
      return
    }

    setLoading(true)

    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 500))

      // Filter mock data
      const filteredTracks = MOCK_DATA.tracks.filter(track =>
        track.title.toLowerCase().includes(query.toLowerCase()) ||
        track.artist.toLowerCase().includes(query.toLowerCase()) ||
        track.genre.toLowerCase().includes(query.toLowerCase())
      )

      const filteredArtists = MOCK_DATA.artists.filter(artist =>
        artist.name.toLowerCase().includes(query.toLowerCase()) ||
        artist.genres.some(genre => genre.toLowerCase().includes(query.toLowerCase()))
      )

      setResults({
        tracks: filteredTracks,
        artists: filteredArtists,
      })
    } catch (error) {
      console.error('Search error:', error)
      notifications.show({
        title: 'Error',
        message: 'Failed to perform search',
        color: 'red'
      })
    } finally {
      setLoading(false)
    }
  }

  const handlePlay = (track: Track) => {
    notifications.show({
      title: 'Playing',
      message: `Now playing "${track.title}" by ${track.artist}`,
      color: 'blue'
    })
  }

  const handleClearSearch = () => {
    setValue('')
    setResults({ tracks: [], artists: [] })
  }

  const handleRecentSearch = (term: string) => {
    setValue(term)
    handleSearch(term)
  }

  return (
    <Box ref={wrapperRef}>
      <TextInput
        value={value}
        onChange={(event) => handleSearch(event.currentTarget.value)}
        placeholder="Search tracks, artists, or genres..."
        size="md"
        radius="xl"
        leftSection={loading ? <Loader size="xs" /> : <IconSearch size={16} />}
        rightSection={
          value && (
            <ActionIcon 
              variant="subtle" 
              onClick={handleClearSearch}
              radius="xl"
            >
              <IconX size={16} />
            </ActionIcon>
          )
        }
        onFocus={() => setFocused(true)}
      />

      <Transition mounted={focused && (value.length >= 2 || value.length === 0)} transition="pop-top-left" duration={200}>
        {(styles) => (
          <Paper
            shadow="md"
            radius="md"
            pos="absolute"
            style={{ width: '100%', ...styles }}
            mt={8}
            p="md"
            withBorder
          >
            {value.length < 2 ? (
              <Stack gap="md">
                <Group justify="space-between">
                  <Text size="sm" fw={500} c="dimmed">
                    Recent Searches
                  </Text>
                  <IconClock size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                </Group>
                {MOCK_DATA.recentSearches.map((term) => (
                  <UnstyledButton
                    key={term}
                    onClick={() => handleRecentSearch(term)}
                  >
                    <Group gap="sm">
                      <IconSearch size={14} style={{ color: 'var(--mantine-color-dimmed)' }} />
                      <Text size="sm">{term}</Text>
                    </Group>
                  </UnstyledButton>
                ))}
              </Stack>
            ) : (
              <Stack gap="md">
                {results.tracks.length > 0 && (
                  <>
                    <Group justify="space-between">
                      <Text size="sm" fw={500} c="dimmed">
                        Tracks
                      </Text>
                      <IconMusic size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                    </Group>
                    {results.tracks.map((track) => (
                      <UnstyledButton
                        key={track.id}
                        component={Link}
                        href={`/tracks/${track.id}`}
                      >
                        <Group wrap="nowrap" justify="space-between">
                          <Group gap="sm" wrap="nowrap" style={{ flex: 1 }}>
                            <Avatar src={track.cover_url} size="md" radius="sm" />
                            <div style={{ flex: 1 }}>
                              <Text size="sm" fw={500} lineClamp={1}>
                                {track.title}
                              </Text>
                              <Text size="xs" c="dimmed" lineClamp={1}>
                                {track.artist}
                              </Text>
                            </div>
                          </Group>
                          <Group gap="xs">
                            <Badge size="sm" variant="light">
                              {track.genre}
                            </Badge>
                            <Text size="xs" c="dimmed">
                              {track.duration}
                            </Text>
                            <ActionIcon
                              variant="light"
                              color="blue"
                              onClick={(e) => {
                                e.preventDefault()
                                handlePlay(track)
                              }}
                            >
                              <IconPlayerPlay size={16} />
                            </ActionIcon>
                          </Group>
                        </Group>
                      </UnstyledButton>
                    ))}
                  </>
                )}

                {results.artists.length > 0 && (
                  <>
                    <Divider />
                    <Group justify="space-between">
                      <Text size="sm" fw={500} c="dimmed">
                        Artists
                      </Text>
                      <IconMicrophone size={16} style={{ color: 'var(--mantine-color-dimmed)' }} />
                    </Group>
                    {results.artists.map((artist) => (
                      <UnstyledButton
                        key={artist.id}
                        component={Link}
                        href={`/artists/${artist.id}`}
                      >
                        <Group wrap="nowrap" justify="space-between">
                          <Group gap="sm" wrap="nowrap">
                            <Avatar src={artist.avatar_url} size="md" radius="xl" />
                            <div>
                              <Text size="sm" fw={500}>
                                {artist.name}
                              </Text>
                              <Group gap={4}>
                                <Text size="xs" c="dimmed">
                                  {artist.followers.toLocaleString()} followers
                                </Text>
                                <Text size="xs" c="dimmed">•</Text>
                                <Text size="xs" c="dimmed">
                                  {artist.genres.join(', ')}
                                </Text>
                              </Group>
                            </div>
                          </Group>
                        </Group>
                      </UnstyledButton>
                    ))}
                  </>
                )}

                {results.tracks.length === 0 && results.artists.length === 0 && (
                  <Text c="dimmed" ta="center" py="xl">
                    No results found for "{value}"
                  </Text>
                )}
              </Stack>
            )}
          </Paper>
        )}
      </Transition>
    </Box>
  )
}

