"use client";

import { 
  Group, 
  Text, 
  rem, 
  Stack,
  Progress,
  Alert,
  Paper,
  Transition,
  Box
} from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { 
  IconUpload, 
  IconX, 
  IconMusic,
  IconAlertCircle,
  IconFileMusic
} from '@tabler/icons-react';
import { useState } from 'react';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

interface FileUploaderProps {
  onUploadComplete: (trackId: string) => void;
}

export function FileUploader({ onUploadComplete }: FileUploaderProps) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [currentFile, setCurrentFile] = useState<FileWithPath | null>(null);
  const supabase = createClientComponentClient();

  const handleDrop = async (files: FileWithPath[]) => {
    const file = files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setUploadProgress(0);
    setCurrentFile(file);

    try {
      // First, create a track record
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: trackData, error: trackError } = await supabase
        .from('tracks')
        .insert({
          title: file.name.replace(/\.[^/.]+$/, ''), // Remove extension
          artist_id: user.id,
          status: 'processing'
        })
        .select()
        .single();

      if (trackError) throw trackError;
      if (!trackData) throw new Error('Failed to create track record');

      // Then upload the file
      const fileName = `${trackData.id}_${Date.now()}.${file.name.split('.').pop()}`;
      const { error: uploadError } = await supabase.storage
        .from('tracks')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false,
        });

      if (uploadError) throw uploadError;

      // Update track record with file URL
      const { data: { publicUrl } } = supabase.storage
        .from('tracks')
        .getPublicUrl(fileName);

      const { error: updateError } = await supabase
        .from('tracks')
        .update({ 
          file_url: publicUrl,
          status: 'ready'
        })
        .eq('id', trackData.id);

      if (updateError) throw updateError;

      onUploadComplete(trackData.id);
      setCurrentFile(null);
    } catch (err) {
      console.error('Upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to upload track');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Stack gap="md">
      <Dropzone
        onDrop={handleDrop}
        onReject={() => setError('File rejected. Please check the file type and size.')}
        maxSize={30 * 1024 ** 2}
        accept={{
          'audio/mpeg': ['.mp3'],
          'audio/wav': ['.wav']
        }}
        multiple={false}
        loading={isUploading}
        style={(theme) => ({
          borderColor: error 
            ? theme.colors.red[6] 
            : theme.colors.blue[6],
        })}
      >
        <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
          <Dropzone.Accept>
            <IconUpload
              style={{ 
                width: rem(52), 
                height: rem(52), 
                color: 'var(--mantine-color-blue-6)',
                transition: 'transform 150ms ease',
                transform: 'scale(1.1)',
              }}
              stroke={1.5}
            />
          </Dropzone.Accept>
          <Dropzone.Reject>
            <IconX
              style={{ 
                width: rem(52), 
                height: rem(52), 
                color: 'var(--mantine-color-red-6)',
                transition: 'transform 150ms ease',
                transform: 'scale(1.1)',
              }}
              stroke={1.5}
            />
          </Dropzone.Reject>
          <Dropzone.Idle>
            <IconMusic
              style={{ 
                width: rem(52), 
                height: rem(52), 
                color: 'var(--mantine-color-dimmed)',
                transition: 'transform 150ms ease',
              }}
              stroke={1.5}
            />
          </Dropzone.Idle>

          <Stack gap="xs" align="center">
            <Text size="xl" inline>
              Drag your track here or click to browse
            </Text>
            <Text size="sm" c="dimmed" inline>
              Attach one audio file (up to 30MB) in MP3 or WAV format
            </Text>
          </Stack>
        </Group>
      </Dropzone>

      <Transition 
        mounted={currentFile !== null} 
        transition="slide-up"
        duration={200}
      >
        {(styles) => (
          <Paper 
            shadow="sm" 
            p="md" 
            radius="md" 
            withBorder
            style={styles}
          >
            <Stack gap="sm">
              <Group gap="sm" wrap="nowrap">
                <IconFileMusic 
                  size={24} 
                  style={{ color: 'var(--mantine-color-blue-6)' }} 
                />
                <Box style={{ flex: 1, minWidth: 0 }}>
                  <Text size="sm" fw={500} lineClamp={1}>
                    {currentFile?.name}
                  </Text>
                  <Text size="xs" c="dimmed">
                    {currentFile ? `${(currentFile.size / (1024 * 1024)).toFixed(2)} MB` : ''}
                  </Text>
                </Box>
              </Group>
              <Progress 
                value={uploadProgress} 
                size="xl" 
                radius="xl" 
                striped 
                animated
                color={error ? "red" : "blue"}
              />
            </Stack>
          </Paper>
        )}
      </Transition>

      {error && (
        <Alert 
          color="red" 
          title="Upload Error" 
          variant="filled"
          icon={<IconAlertCircle size={rem(16)} />}
        >
          {error}
        </Alert>
      )}
    </Stack>
  );
} 