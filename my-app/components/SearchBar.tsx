"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Search } from 'lucide-react'

interface SearchResult {
  id: string
  title?: string
  name?: string
  type: 'track' | 'artist'
}

export function SearchBar() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<SearchResult[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const supabase = createClientComponentClient()

  const handleSearch = async () => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      // Search tracks
      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .select('id, title')
        .ilike('title', `%${query}%`)
        .limit(5)

      if (trackError) throw trackError

      // Search artists
      const { data: artistData, error: artistError } = await supabase
        .from('users')
        .select('id, username')
        .eq('user_type', 'artist')
        .ilike('username', `%${query}%`)
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

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="flex">
        <Input
          type="text"
          placeholder="Search tracks or artists..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-grow"
        />
        <Button onClick={handleSearch} disabled={isSearching} className="ml-2">
          <Search className="h-4 w-4" />
        </Button>
      </div>
      {results.length > 0 && (
        <ul className="mt-2 bg-white shadow-md rounded-md overflow-hidden">
          {results.map((result) => (
            <li key={result.id} className="p-2 hover:bg-gray-100">
              {result.type === 'track' ? result.title : result.name} ({result.type})
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}

