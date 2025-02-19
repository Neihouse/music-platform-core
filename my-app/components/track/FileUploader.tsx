"use client";

import { Group, Text, useMantineTheme, rem } from '@mantine/core';
import { Dropzone, FileWithPath } from '@mantine/dropzone';
import { IconUpload, IconX, IconFile } from '@tabler/icons-react';
import { notifications } from '@mantine/notifications';
import { getUser } from '@/utils/auth';

interface FileUploaderProps {
  onUpload: (file: File) => void;
  onProgress?: (progress: number) => void;
  onUploadComplete?: (id: string) => void;
  accept?: string[];
  maxSize?: number;
  label?: string;
  loading?: boolean;
}

export function FileUploader({ 
  onUpload, 
  onProgress,
  onUploadComplete,
  accept = ['audio/mpeg', 'audio/wav'],
  maxSize = 30 * 1024 ** 2, // 30MB
  label = 'Upload audio file',
  loading = false
}: FileUploaderProps) {
  const theme = useMantineTheme();

  const handleDrop = async (files: FileWithPath[]) => {
    try {
      const user = getUser();
      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to upload files',
          color: 'red'
        });
        return;
      }

      const file = files[0];
      if (!file) return;

      // Simulate file validation
      if (file.size > maxSize) {
        notifications.show({
          title: 'Error',
          message: `File size must be less than ${maxSize / 1024 / 1024}MB`,
          color: 'red'
        });
        return;
      }

      if (!accept.includes(file.type)) {
        notifications.show({
          title: 'Error',
          message: 'Invalid file type. Please upload an MP3 or WAV file.',
          color: 'red'
        });
        return;
      }

      // Simulate file upload with progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        onProgress?.(progress);
        
        if (progress >= 100) {
          clearInterval(interval);
          onUpload(file);
          // Simulate getting an ID from the server
          const mockId = Math.random().toString(36).substr(2, 9);
          onUploadComplete?.(mockId);
        }
      }, 500);

    } catch (error) {
      console.error('Error handling file:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to process file',
        color: 'red'
      });
    }
  };

  return (
    <Dropzone
      onDrop={handleDrop}
      maxSize={maxSize}
      accept={accept}
      multiple={false}
      loading={loading}
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
          <IconFile
            style={{ width: rem(52), height: rem(52), color: 'var(--mantine-color-dimmed)' }}
            stroke={1.5}
          />
        </Dropzone.Idle>

        <div>
          <Text size="xl" inline>
            {label}
          </Text>
          <Text size="sm" c="dimmed" inline mt={7}>
            Drag & drop files here or click to browse
          </Text>
        </div>
      </Group>
    </Dropzone>
  );
} 