"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface TrackAnalytics {
  id: string
  title: string
  total_plays: number
  total_votes: number
  total_comments: number
  daily_stats: {
    date: string
    plays: number
    votes: number
    comments: number
  }[]
}

export function TrackAnalytics({ trackId }: { trackId: string }) {
  const [analytics, setAnalytics] = useState<TrackAnalytics | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  useEffect(() => {
    fetchTrackAnalytics()
  }, [trackId])

  const fetchTrackAnalytics = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('track_analytics')
        .select('*')
        .eq('id', trackId)
        .single()

      if (error) throw error

      setAnalytics(data)
    } catch (err) {
      setError('Failed to fetch track analytics')
      console.error('Error fetching track analytics:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading) return <div>Loading track analytics...</div>
  if (error) return <div>Error: {error}</div>
  if (!analytics) return <div>No analytics data available</div>

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Track Analytics: {analytics.title}</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Plays</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.total_plays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Votes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.total_votes}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Total Comments</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{analytics.total_comments}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Engagement Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={analytics.daily_stats}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="plays" stroke="#8884d8" name="Plays" />
                <Line type="monotone" dataKey="votes" stroke="#82ca9d" name="Votes" />
                <Line type="monotone" dataKey="comments" stroke="#ffc658" name="Comments" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

