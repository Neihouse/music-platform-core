"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  TextInput, 
  ActionIcon, 
  Paper, 
  Stack, 
  Group, 
  Text, 
  Badge, 
  Box,
  Transition,
  Loader,
  Overlay,
  rem
} from '@mantine/core'
import { IconSearch, IconMusic, IconUser, IconX } from '@tabler/icons-react'
import { useClickOutside, useDebouncedValue, useDisclosure } from '@mantine/hooks'
import Link from 'next/link'

interface SearchResult {
  id: string
  title?: string
  name?: string
  type: 'track' | 'artist'
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [debouncedQuery] = useDebouncedValue(query, 300)
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [opened, { open, close }] = useDisclosure(false)
  const supabase = createClientComponentClient()
  
  const ref = useClickOutside(close)

  const handleSearch = async () => {
    if (!debouncedQuery.trim()) {
      setResults([])
      return
    }

    setIsSearching(true)
    open()
    try {
      // Search tracks
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .select('id, title')
        .ilike('title', `%${debouncedQuery}%`)
        .limit(5)

      if (trackError) throw trackError

      // Search artists
      const { data: artistData, error: artistError } = await supabase
        .from('users')
        .select('id, username')
        .eq('user_type', 'artist')
        .ilike('username', `%${debouncedQuery}%`)
        .limit(5)

      if (artistError) throw artistError

      const combinedResults: SearchResult[] = [
        ...trackData.map((track) => ({ ...track, type: 'track' as const })),
        ...artistData.map((artist) => ({ id: artist.id, name: artist.username, type: 'artist' as const }))
      ]

      setResults(combinedResults)
    } catch (error) {
      console.error('Search error:', error)
    } finally {
      setIsSearching(false)
    }
  }

  useEffect(() => {
    handleSearch()
  }, [debouncedQuery])

  return (
    <Box pos="relative" ref={ref} maw={400} w="100%" mx="auto">
      <TextInput
        placeholder="Search tracks or artists..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        size="md"
        radius="xl"
        leftSection={<IconSearch size={18} stroke={1.5} />}
        rightSection={
          isSearching ? (
            <Loader size="xs" />
          ) : query ? (
            <ActionIcon 
              variant="subtle" 
              onClick={() => setQuery('')}
              radius="xl"
              size="sm"
            >
              <IconX size={14} />
            </ActionIcon>
          ) : null
        }
        styles={(theme) => ({
          input: {
            '&:focus': {
              borderColor: theme.colors.blue[5],
            },
          },
        })}
      />
      
      <Transition mounted={results.length > 0 && opened} transition="pop-top-left" duration={200}>
        {(styles) => (
          <Paper 
            shadow="md" 
            radius="md" 
            pos="absolute" 
            top={45} 
            left={0} 
            right={0} 
            withBorder
            style={styles}
            pt="xs"
          >
            <Stack gap={0}>
              {results.map((result) => (
                <Box
                  key={result.id}
                  component={Link}
                  href={result.type === 'track' ? `/track/${result.id}` : `/artist/${result.id}`}
                  p="sm"
                  style={(theme) => ({
                    textDecoration: 'none',
                    color: 'inherit',
                    cursor: 'pointer',
                    '&:hover': {
                      backgroundColor: theme.colors.gray[0]
                    },
                    transition: 'background-color 150ms ease'
                  })}
                >
                  <Group wrap="nowrap">
                    {result.type === 'track' ? (
                      <IconMusic size={16} stroke={1.5} />
                    ) : (
                      <IconUser size={16} stroke={1.5} />
                    )}
                    <Box style={{ flex: 1, minWidth: 0 }}>
                      <Text size="sm" fw={500} lineClamp={1}>
                        {result.type === 'track' ? result.title : result.name}
                      </Text>
                    </Box>
                    <Badge 
                      size="sm" 
                      variant="light"
                      radius="xl"
                      px="sm"
                      color={result.type === 'track' ? 'blue' : 'green'}
                    >
                      {result.type}
                    </Badge>
                  </Group>
                </Box>
              ))}
            </Stack>
          </Paper>
        )}
      </Transition>

      {opened && results.length > 0 && (
        <Overlay 
          color="#000" 
          backgroundOpacity={0.05} 
          blur={1}
          zIndex={198}
          onClick={close}
        />
      )}
    </Box>
  )
}

