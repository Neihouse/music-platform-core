"use client"

import { useState, useEffect } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Loader2, Upload } from 'lucide-react'

const formSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100, 'Title must be 100 characters or less'),
  genre: z.string().min(1, 'Genre is required'),
  coverArt: z.instanceof(File).optional(),
})

type FormValues = z.infer<typeof formSchema>

interface TrackEditorProps {
  trackId: string
}

export function TrackEditor({ trackId }: TrackEditorProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      genre: '',
    },
  })

  useEffect(() => {
    fetchTrackDetails()
  }, [trackId])

  const fetchTrackDetails = async () => {
    setIsLoading(true)
    setError(null)

    try {
      const { data, error } = await supabase
        .from('tracks')
        .select('title, genre')
        .eq('id', trackId)
        .single()

      if (error) throw error

      form.reset({
        title: data.title,
        genre: data.genre,
      })
    } catch (err) {
      setError('Failed to fetch track details')
      console.error('Error fetching track details:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const onSubmit = async (values: FormValues) => {
    setIsLoading(true)
    setError(null)
    setSuccess(null)

    try {
      const updates: any = {
        title: values.title,
        genre: values.genre,
      }

      if (values.coverArt) {
        const fileName = `${trackId}_${Date.now()}.jpg`
        const { error: uploadError } = await supabase.storage
          .from('cover-art')
          .upload(fileName, values.coverArt)

        if (uploadError) throw uploadError

        const { data: { publicUrl } } = supabase.storage
          .from('cover-art')
          .getPublicUrl(fileName)

        updates.cover_art_url = publicUrl
      }

      const { error } = await supabase
        .from('tracks')
        .update(updates)
        .eq('id', trackId)

      if (error) throw error

      setSuccess('Track updated successfully')
    } catch (err) {
      setError('Failed to update track')
      console.error('Error updating track:', err)
    } finally {
      setIsLoading(false)
    }
  }

  if (isLoading && !form.formState.isSubmitting) {
    return <div>Loading track details...</div>
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="genre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Genre</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a genre" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="pop">Pop</SelectItem>
                  <SelectItem value="rock">Rock</SelectItem>
                  <SelectItem value="hip-hop">Hip Hop</SelectItem>
                  <SelectItem value="electronic">Electronic</SelectItem>
                  <SelectItem value="classical">Classical</SelectItem>
                  <SelectItem value="jazz">Jazz</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="coverArt"
          render={({ field: { onChange, value, ...rest } }) => (
            <FormItem>
              <FormLabel>Cover Art</FormLabel>
              <FormControl>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) onChange(file)
                  }}
                  {...rest}
                />
              </FormControl>
              <FormDescription>Upload a new cover art image (optional)</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {success && (
          <Alert>
            <AlertDescription>{success}</AlertDescription>
          </Alert>
        )}

        <Button type="submit" disabled={isLoading}>
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Updating...
            </>
          ) : (
            <>
              <Upload className="mr-2 h-4 w-4" />
              Update Track
            </>
          )}
        </Button>
      </form>
    </Form>
  )
}

