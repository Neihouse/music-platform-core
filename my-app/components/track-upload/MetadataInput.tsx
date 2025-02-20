"use client";
import { clientSupabase } from "@/db/client";
import { Button, Group, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import * as React from "react";

export interface IMetadataInputProps {
  onCreate: (trackMetadata: any) => void;
}

export function MetadataInput({ onCreate }: IMetadataInputProps) {
  const form = useForm({
    /**
     * We can make it all one-button (upload, metadata, cover art)
     * submission in the future, but the control flow logic is a little
     * more complicated. So creating the metadata (table row in database) then uploading
     * file (supabase.storage / bucket upload) are two discreet steps for now
     */
    initialValues: {
      title: "",
      //   genre: "",
      //   file: null,
      //   coverArt: null,
    },
    validate: {
      title: (value: string) => {
        if (!value.trim()) return "Title is required";
        if (value.length > 100) return "Title must be 100 characters or less";
        return null;
      },
      //   genre: (value: string) => (!value ? "Genre is required" : null),
      //  file: (value) => {
      //    if (!value) return 'Audio file is required';
      //    if (value.size > 30 * 1024 * 1024) return 'File size must be less than 30MB';
      //    return null;
      //  },
      //  coverArt: (value) => {
      //    if (value && value.size > 5 * 1024 * 1024) return 'Cover art must be less than 5MB';
      //    return null;
      //  },
    },
  });

  return (
    <form onSubmit={form.onSubmit((vals) => createTrack(vals))}>
      <TextInput
        label="Track Title"
        placeholder="Enter track title"
        required
        size="md"
        {...form.getInputProps("title")}
      />

      <Group justify="flex-end" mt="md">
        <Button type="submit">Done with metadata</Button>
      </Group>
    </form>
  );

  async function createTrack({ title }: { title: string }) {
    try {
      const resp = await clientSupabase.from("tracks").upsert({
        id: 1,
        title,
      });

      console.log("Response: ", resp);
      onCreate(resp);
    } catch (error) {
      console.error(error);
    }
  }
}
