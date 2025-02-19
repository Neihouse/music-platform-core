"use client"

import { useState } from 'react'
import { 
  Stack,
  TextInput,
  Select,
  Button,
  Paper,
  Text,
  Group,
  rem,
  Progress,
  Image,
  ActionIcon,
  Box
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { Dropzone, FileWithPath } from '@mantine/dropzone'
import { 
  IconUpload,
  IconX,
  IconMusic,
  IconPhoto,
  IconTrash
} from '@tabler/icons-react'
import { notifications } from '@mantine/notifications'
import { getUser } from '@/utils/auth'

const GENRES = [
  { value: 'electronic', label: 'Electronic' },
  { value: 'rock', label: 'Rock' },
  { value: 'pop', label: 'Pop' },
  { value: 'jazz', label: 'Jazz' },
  { value: 'hiphop', label: 'Hip Hop' },
  { value: 'classical', label: 'Classical' },
  { value: 'ambient', label: 'Ambient' },
  { value: 'folk', label: 'Folk' },
  { value: 'rnb', label: 'R&B' },
  { value: 'metal', label: 'Metal' }
]

interface FormValues {
  title: string;
  genre: string;
  file: FileWithPath | null;
  coverArt: FileWithPath | null;
}

export function TrackUploader() {
  const [isUploading, setIsUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  const form = useForm<FormValues>({
    initialValues: {
      title: '',
      genre: '',
      file: null,
      coverArt: null,
    },
    validate: {
      title: (value) => {
        if (!value.trim()) return 'Title is required';
        if (value.length > 100) return 'Title must be 100 characters or less';
        return null;
      },
      genre: (value) => !value ? 'Genre is required' : null,
      file: (value) => {
        if (!value) return 'Audio file is required';
        if (value.size > 30 * 1024 * 1024) return 'File size must be less than 30MB';
        return null;
      },
      coverArt: (value) => {
        if (value && value.size > 5 * 1024 * 1024) return 'Cover art must be less than 5MB';
        return null;
      },
    },
  })

  const handleUpload = async () => {
    if (!form.isValid()) return;
    
    try {
      const user = getUser()
      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to upload tracks',
          color: 'red'
        })
        return
      }

      setIsUploading(true)
      setUploadProgress(0)

      // Simulate file upload progress
      const duration = 3000 // 3 seconds
      const interval = 100 // Update every 100ms
      const steps = duration / interval
      let progress = 0

      const progressInterval = setInterval(() => {
        progress += (100 / steps)
        setUploadProgress(Math.min(progress, 99))
      }, interval)

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, duration))

      clearInterval(progressInterval)
      setUploadProgress(100)

      notifications.show({
        title: 'Success',
        message: 'Track uploaded successfully!',
        color: 'green'
      })

      // Reset form after a brief delay
      setTimeout(() => {
        form.reset()
        setPreviewUrl(null)
        setUploadProgress(0)
      }, 1000)
    } catch (err) {
      notifications.show({
        title: 'Error',
        message: err instanceof Error ? err.message : 'Failed to upload track',
        color: 'red'
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleCoverArtDrop = (files: FileWithPath[]) => {
    const file = files[0]
    form.setFieldValue('coverArt', file)

    // Create preview URL
    const url = URL.createObjectURL(file)
    setPreviewUrl(url)
  }

  const handleRemoveCoverArt = () => {
    form.setFieldValue('coverArt', null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  return (
    <Paper p="xl" radius="md" withBorder>
      <Stack gap="md">
        <TextInput
          label="Track Title"
          placeholder="Enter track title"
          required
          size="md"
          {...form.getInputProps('title')}
        />

        <Select
          label="Genre"
          placeholder="Select genre"
          data={GENRES}
          required
          size="md"
          searchable
          {...form.getInputProps('genre')}
        />

        <Box>
          <Text fw={500} size="sm" mb={8}>
            Audio File
          </Text>
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
                <Text size="xl" inline>
                  {form.values.file 
                    ? form.values.file.name
                    : 'Drop audio file here or click to browse'
                  }
                </Text>
                <Text size="sm" c="dimmed">
                  MP3 or WAV file, up to 30MB
                </Text>
              </Stack>
            </Group>
          </Dropzone>
        </Box>

        <Box>
          <Text fw={500} size="sm" mb={8}>
            Cover Art (Optional)
          </Text>
          {previewUrl ? (
            <Paper p="xs" radius="md" withBorder>
              <Group wrap="nowrap" align="center">
                <Image
                  src={previewUrl}
                  alt="Cover art preview"
                  w={100}
                  h={100}
                  radius="md"
                  fallbackSrc="https://placehold.co/100x100?text=No+Image"
                />
                <Stack gap={4} style={{ flex: 1 }}>
                  <Text size="sm" lineClamp={1}>
                    {form.values.coverArt?.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {form.values.coverArt && (form.values.coverArt.size / (1024 * 1024)).toFixed(2)} MB
                  </Text>
                </Stack>
                <ActionIcon
                  variant="light"
                  color="red"
                  onClick={handleRemoveCoverArt}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            </Paper>
          ) : (
            <Dropzone
              onDrop={handleCoverArtDrop}
              maxSize={5 * 1024 ** 2}
              accept={{
                'image/*': ['.png', '.jpg', '.jpeg', '.webp']
              }}
              multiple={false}
            >
              <Group justify="center" gap="xl" mih={150} style={{ pointerEvents: 'none' }}>
                <Dropzone.Accept>
                  <IconUpload
                    style={{ width: rem(40), height: rem(40), color: 'var(--mantine-color-blue-6)' }}
                    stroke={1.5}
                  />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX
                    style={{ width: rem(40), height: rem(40), color: 'var(--mantine-color-red-6)' }}
                    stroke={1.5}
                  />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconPhoto
                    style={{ width: rem(40), height: rem(40), color: 'var(--mantine-color-dimmed)' }}
                    stroke={1.5}
                  />
                </Dropzone.Idle>

                <Stack gap="xs" align="center">
                  <Text size="lg">Drop cover art here or click to browse</Text>
                  <Text size="sm" c="dimmed">
                    PNG, JPG, or WEBP file, up to 5MB
                  </Text>
                </Stack>
              </Group>
            </Dropzone>
          )}
        </Box>

        {uploadProgress > 0 && (
          <Progress 
            value={uploadProgress} 
            size="xl" 
            radius="xl"
            striped
            animated={uploadProgress < 100}
          />
        )}

        <Button
          onClick={handleUpload}
          loading={isUploading}
          leftSection={<IconUpload size={16} />}
          disabled={!form.isValid()}
          size="md"
        >
          {isUploading ? 'Uploading...' : 'Upload Track'}
        </Button>
      </Stack>
    </Paper>
  )
}

