"use client"

import { useState } from 'react'
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { 
  Stack,
  TextInput,
  Select,
  Button,
  Alert,
  Paper,
  Text,
  Group,
  rem
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Dropzone } from '@mantine/dropzone'
import { 
  IconUpload,
  IconX,
  IconAlertCircle,
  IconCheck,
  IconMusic 
} from '@tabler/icons-react'

interface FormValues {
  title: string;
  genre: string;
  file: File | null;
  coverArt: File | null;
}

export function TrackUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const supabase = createClientComponentClient()

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      genre: '',
      file: null,
      coverArt: null,
    },
    validate: {
      title: (value) => !value.trim() ? 'Title is required' : null,
      genre: (value) => !value ? 'Genre is required' : null,
      file: (value) => !value ? 'Audio file is required' : null,
    },
  })

  const handleUpload = async () => {
    if (!form.isValid()) return;
    
    setIsUploading(true)
    setError(null)
    setSuccess(null)

    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('User not found')

      if (!form.values.file) return;

      // Upload track file
      const trackFileName = `${user.id}/${Date.now()}-${form.values.file.name}`
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(trackFileName, form.values.file as File)

      if (uploadError) throw uploadError

      // Upload cover art if provided
      let coverArtUrl = null
      if (form.values.coverArt) {
        const coverArtFileName = `${user.id}/${Date.now()}-${form.values.coverArt.name}`
        const { error: coverArtUploadError } = await supabase.storage
          .from('cover-art')
          .upload(coverArtFileName, form.values.coverArt)

        if (coverArtUploadError) throw coverArtUploadError

        const { data: { publicUrl } } = supabase.storage
          .from('cover-art')
          .getPublicUrl(coverArtFileName)

        coverArtUrl = publicUrl
      }

      // Insert track data into the database
      const { error: insertError } = await supabase
        .from('tracks')
        .insert({
          title: form.values.title,
          genre: form.values.genre,
          artist_id: user.id,
          file_path: trackFileName,
          cover_art_url: coverArtUrl
        })

      if (insertError) throw insertError

      setSuccess('Track uploaded successfully!')
      form.reset()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload track')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <Paper p="xl" radius="md" withBorder>
      <Stack gap="md">
        <TextInput
          label="Track Title"
          placeholder="Enter track title"
          required
          {...form.getInputProps('title')}
        />

        <Select
          label="Genre"
          placeholder="Select genre"
          data={[
            { value: 'rock', label: 'Rock' },
            { value: 'pop', label: 'Pop' },
            { value: 'jazz', label: 'Jazz' },
            // Add more genres...
          ]}
          required
          {...form.getInputProps('genre')}
        />

        <Dropzone
          onDrop={(files) => form.setFieldValue('file', files[0])}
          maxSize={30 * 1024 ** 2}
          accept={{
            'audio/*': ['.mp3', '.wav']
          }}
          multiple={false}
        >
          <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
            <Dropzone.Accept>
              <IconUpload
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-blue-6)' }}
                stroke={1.5}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-red-6)' }}
                stroke={1.5}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconMusic
                style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
                stroke={1.5}
              />
            </Dropzone.Idle>

            <Stack gap="xs" align="center">
              <Text size="xl">Drop audio file here or click to browse</Text>
              <Text size="sm" c="dimmed">
                MP3 or WAV file, up to 30MB
              </Text>
            </Stack>
          </Group>
        </Dropzone>

        {error && (
          <Alert color="red" title="Error" variant="filled" icon={<IconAlertCircle size={16} />}>
            {error}
          </Alert>
        )}

        {success && (
          <Alert color="green" title="Success" variant="filled" icon={<IconCheck size={16} />}>
            {success}
          </Alert>
        )}

        <Button
          onClick={handleUpload}
          loading={isUploading}
          leftSection={<IconUpload size={16} />}
          disabled={!form.isValid()}
        >
          {isUploading ? 'Uploading...' : 'Upload Track'}
        </Button>
      </Stack>
    </Paper>
  )
}

