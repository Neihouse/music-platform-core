"use client";

import { 
  TextInput, 
  Button, 
  Stack, 
  Alert, 
  Select, 
  FileInput, 
  LoadingOverlay, 
  Paper,
  rem
} from '@mantine/core';
import { useForm } from '@mantine/form';
import { IconUpload, IconPhoto, IconAlertCircle, IconCheck } from '@tabler/icons-react';
import { useEffect, useState } from "react";
import { notifications } from '@mantine/notifications';
import { getUser } from '@/utils/auth';

// Mock data for development
const MOCK_TRACKS = {
  '1': {
    title: 'Summer Vibes',
    genre: 'house',
    cover_art_url: 'https://picsum.photos/400/400?random=1'
  },
  '2': {
    title: 'Night Drive',
    genre: 'techno',
    cover_art_url: 'https://picsum.photos/400/400?random=2'
  }
};

type FormValues = {
  title: string;
  genre: string;
  coverArt: File | null;
};

const GENRE_OPTIONS = [
  { value: 'house', label: 'House' },
  { value: 'techno', label: 'Techno' },
  { value: 'trance', label: 'Trance' },
  { value: 'dubstep', label: 'Dubstep' },
  { value: 'drum-and-bass', label: 'Drum and Bass' },
  { value: 'future-bass', label: 'Future Bass' },
  { value: 'trap', label: 'Trap' },
  { value: 'hardstyle', label: 'Hardstyle' },
  { value: 'progressive-house', label: 'Progressive House' },
  { value: 'deep-house', label: 'Deep House' },
  { value: 'electro-house', label: 'Electro House' },
  { value: 'big-room', label: 'Big Room' },
  { value: 'minimal', label: 'Minimal' },
  { value: 'psytrance', label: 'Psytrance' },
  { value: 'edm', label: 'EDM (General)' },
];

interface TrackEditorProps {
  trackId: string;
  onUpdate?: (updatedTrack: { title: string; genre: string; cover_art_url?: string }) => void;
}

export function TrackEditor({ trackId, onUpdate }: TrackEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    initialValues: {
      title: "",
      genre: "",
      coverArt: null,
    },
    validate: {
      title: (value) => {
        if (!value) return "Title is required";
        if (value.length > 100) return "Title must be 100 characters or less";
        return null;
      },
      genre: (value) => (!value ? "Genre is required" : null),
    },
  });

  useEffect(() => {
    const fetchTrackDetails = async () => {
      setIsLoading(true);
      
      try {
        const user = getUser();
        if (!user) {
          notifications.show({
            title: 'Error',
            message: 'Please log in to edit tracks',
            color: 'red'
          });
          return;
        }

        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));

        const mockTrack = MOCK_TRACKS[trackId as keyof typeof MOCK_TRACKS];
        if (mockTrack) {
          form.setValues({
            title: mockTrack.title,
            genre: mockTrack.genre,
            coverArt: null,
          });
        } else {
          notifications.show({
            title: 'Error',
            message: 'Track not found',
            color: 'red'
          });
        }
      } catch (error) {
        console.error('Error fetching track details:', error);
        notifications.show({
          title: 'Error',
          message: 'Failed to fetch track details',
          color: 'red'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackDetails();
  }, [trackId, form]);

  const onSubmit = async (values: FormValues) => {
    if (!form.isValid()) return;
    
    setIsSubmitting(true);
    
    try {
      const user = getUser();
      if (!user) {
        notifications.show({
          title: 'Error',
          message: 'Please log in to update tracks',
          color: 'red'
        });
        return;
      }

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      let cover_art_url: string | undefined;
      
      if (values.coverArt) {
        // Simulate cover art upload
        await new Promise(resolve => setTimeout(resolve, 500));
        cover_art_url = URL.createObjectURL(values.coverArt);
      }

      const updatedTrack = {
        title: values.title,
        genre: values.genre,
        ...(cover_art_url && { cover_art_url })
      };

      // Update mock data
      if (trackId in MOCK_TRACKS) {
        MOCK_TRACKS[trackId as keyof typeof MOCK_TRACKS] = {
          ...MOCK_TRACKS[trackId as keyof typeof MOCK_TRACKS],
          ...updatedTrack
        };
      }

      notifications.show({
        title: 'Success',
        message: 'Track updated successfully',
        color: 'green',
        icon: <IconCheck size={16} />
      });

      form.resetDirty();
      onUpdate?.(updatedTrack);
    } catch (error) {
      console.error('Error updating track:', error);
      notifications.show({
        title: 'Error',
        message: 'Failed to update track',
        color: 'red',
        icon: <IconAlertCircle size={16} />
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Paper pos="relative" p="md" radius="md" withBorder>
      <LoadingOverlay 
        visible={isLoading} 
        zIndex={1000} 
        overlayProps={{ radius: "sm", blur: 2 }}
      />
      
      <form onSubmit={form.onSubmit(onSubmit)}>
        <Stack gap="md">
          <TextInput
            label="Title"
            placeholder="Enter track title"
            required
            size="md"
            {...form.getInputProps('title')}
          />

          <Select
            label="Genre"
            placeholder="Select a genre"
            data={GENRE_OPTIONS}
            searchable
            required
            size="md"
            {...form.getInputProps('genre')}
          />

          <FileInput
            label="Cover Art"
            placeholder="Upload new cover art"
            accept="image/*"
            clearable
            size="md"
            leftSection={<IconPhoto size={rem(14)} />}
            {...form.getInputProps('coverArt')}
          />

          <Button 
            type="submit" 
            loading={isSubmitting}
            leftSection={<IconUpload size={16} />}
            disabled={isSubmitting || !form.isDirty()}
            size="md"
          >
            {isSubmitting ? "Updating..." : "Update Track"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
