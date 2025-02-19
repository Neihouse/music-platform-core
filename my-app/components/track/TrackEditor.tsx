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
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useEffect, useState } from "react";

type FormValues = {
  title: string;
  genre: string;
  coverArt: File | null;
};

interface TrackUpdate {
  title: string;
  genre: string;
  cover_art_url?: string;
}

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
}

export function TrackEditor({ trackId }: TrackEditorProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const supabase = createClientComponentClient();

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
      setError(null);
      try {
        const { data, error } = await supabase
          .from("tracks")
          .select("title, genre")
          .eq("id", trackId)
          .single();

        if (error) throw error;
        if (data) {
          form.setValues({
            title: data.title || "",
            genre: data.genre || "",
            coverArt: null,
          });
        } else {
          setError("Track details not found.");
        }
      } catch (error) {
        console.error('Error fetching track details:', error);
        setError("Failed to fetch track details.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrackDetails();
  }, [trackId, form]);

  const onSubmit = async (values: FormValues) => {
    if (!form.isValid()) return;
    
    setIsSubmitting(true);
    setError(null);
    setSuccess(null);
    
    try {
      const updates: TrackUpdate = {
        title: values.title,
        genre: values.genre,
      };

      if (values.coverArt) {
        const fileName = `${trackId}_${Date.now()}.jpg`;
        const { error: uploadError } = await supabase.storage
          .from("cover-art")
          .upload(fileName, values.coverArt);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage
          .from("cover-art")
          .getPublicUrl(fileName);
        updates.cover_art_url = data.publicUrl;
      }

      const { error } = await supabase
        .from("tracks")
        .update(updates)
        .eq("id", trackId);
      if (error) throw error;

      setSuccess("Track updated successfully.");
      form.resetDirty();
    } catch (error) {
      console.error('Error updating track:', error);
      setError("Failed to update track.");
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
            {...form.getInputProps('title')}
          />

          <Select
            label="Genre"
            placeholder="Select a genre"
            data={GENRE_OPTIONS}
            searchable
            required
            {...form.getInputProps('genre')}
          />

          <FileInput
            label="Cover Art"
            placeholder="Upload cover art"
            accept="image/*"
            clearable
            leftSection={<IconPhoto size={rem(14)} />}
            {...form.getInputProps('coverArt')}
          />

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
            type="submit" 
            loading={isSubmitting}
            leftSection={<IconUpload size={16} />}
            disabled={isSubmitting || !form.isDirty()}
          >
            {isSubmitting ? "Updating..." : "Update Track"}
          </Button>
        </Stack>
      </form>
    </Paper>
  );
}
