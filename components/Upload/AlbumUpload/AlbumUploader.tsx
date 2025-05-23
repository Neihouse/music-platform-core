"use client";
import { createClient } from "@/utils/supabase/client";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IAudioMetadata, parseBlob } from "music-metadata";
import {
  Affix,
  Button,
  Card,
  Group,
  Space,
  Stack,
  Paper,
  ThemeIcon,
  Text,
  Badge,
  TextInput,
  Textarea,
  Title,
  Divider
} from "@mantine/core";
import { IconUpload, IconDisc } from "@tabler/icons-react";
import { handleInsertAlbum } from "@/app/upload/actions";
import { AlbumArtUpload } from "./AlbumArtUpload";
import { AlbumMetadataDisplay } from "./AlbumMetadataDisplay";

export interface IAlbumUploaderProps {
  bucket: string;
  isMobile?: boolean;
}

export interface AlbumTrackWithMetadata {
  metadata: IAudioMetadata;
  file: FileWithPath;
  trackNumber?: number;
}

export interface AlbumData {
  title: string;
  description?: string;
  releaseDate?: string;
  genre?: string;
}

export function AlbumUploader({ bucket, isMobile = false }: IAlbumUploaderProps) {
  const [uploadState, setUploadState] = useState<
    "initial" | "pending" | "error" | "success"
  >();
  const [albumTracks, setAlbumTracks] = useState<AlbumTrackWithMetadata[]>([]);
  const [albumData, setAlbumData] = useState<AlbumData>({
    title: "",
    description: "",
    releaseDate: "",
    genre: ""
  });
  const [albumArtUrl, setAlbumArtUrl] = useState<string>("");

  const updateAlbumData = (field: keyof AlbumData, value: string) => {
    setAlbumData(prev => ({ ...prev, [field]: value }));
  };

  const updateTrackMetadata = (
    track: AlbumTrackWithMetadata,
    key: string,
    value: string
  ) => {
    setAlbumTracks(prev =>
      prev.map(t =>
        t === track
          ? {
            ...t,
            metadata: {
              ...t.metadata,
              common: { ...t.metadata.common, [key]: value }
            }
          }
          : t
      )
    );
  };

  const updateTrackNumber = (track: AlbumTrackWithMetadata, trackNumber: number) => {
    setAlbumTracks(prev =>
      prev.map(t =>
        t === track ? { ...t, trackNumber } : t
      )
    );
  };

  const removeTrack = (track: AlbumTrackWithMetadata) => {
    setAlbumTracks(prev => prev.filter(t => t !== track));
  };

  const onDrop = async (files: FileWithPath[]) => {
    setUploadState("pending");
    const newTracks: AlbumTrackWithMetadata[] = [];

    for (const file of files) {
      try {
        const metadata = await parseBlob(file);
        newTracks.push({
          metadata,
          file,
          trackNumber: albumTracks.length + newTracks.length + 1
        });
      } catch (error) {
        console.error("Error parsing metadata:", error);
        notifications.show({
          title: "Error",
          message: `Failed to parse metadata for ${file.name}`,
          color: "red"
        });
      }
    }

    setAlbumTracks(prev => [...prev, ...newTracks]);
    setUploadState("initial");
  };

  const handleUpload = async () => {
    if (!albumData.title.trim()) {
      notifications.show({
        title: "Error",
        message: "Album title is required",
        color: "red"
      });
      return;
    }

    if (albumTracks.length === 0) {
      notifications.show({
        title: "Error",
        message: "At least one track is required",
        color: "red"
      });
      return;
    }

    setUploadState("pending");

    try {
      // Sort tracks by track number
      const sortedTracks = [...albumTracks].sort((a, b) =>
        (a.trackNumber || 0) - (b.trackNumber || 0)
      );

      await handleInsertAlbum(albumData, sortedTracks, albumArtUrl);

      notifications.show({
        title: "Success",
        message: "Album uploaded successfully!",
        color: "green"
      });

      // Reset form
      setAlbumTracks([]);
      setAlbumData({ title: "", description: "", releaseDate: "", genre: "" });
      setAlbumArtUrl("");
      setUploadState("success");

    } catch (error: any) {
      console.error("Error uploading album:", error);
      notifications.show({
        title: "Upload Error",
        message: error.message || "Failed to upload album",
        color: "red"
      });
      setUploadState("error");
    }
  };

  return (
    <>
      {/* Album Metadata Section */}
      <Card withBorder shadow="sm" radius="lg" p={isMobile ? "md" : "xl"} mb="xl">
        <Group align="center" mb="lg">
          <ThemeIcon size={40} radius={20} color="blue" variant="light">
            <IconDisc size={24} />
          </ThemeIcon>
          <Title order={3}>Album Information</Title>
        </Group>

        <Group align="flex-start" gap={isMobile ? "md" : "xl"} wrap={isMobile ? "wrap" : "nowrap"}>
          <AlbumArtUpload
            albumArtUrl={albumArtUrl}
            onArtworkUploaded={setAlbumArtUrl}
            isMobile={isMobile}
          />

          <Stack flex={1} gap="md">
            <TextInput
              label="Album Title"
              placeholder="Enter album title"
              value={albumData.title}
              onChange={(e) => updateAlbumData("title", e.target.value)}
              required
              size={isMobile ? "md" : "lg"}
            />

            <Textarea
              label="Description"
              placeholder="Album description (optional)"
              value={albumData.description}
              onChange={(e) => updateAlbumData("description", e.target.value)}
              minRows={3}
              size={isMobile ? "md" : "lg"}
            />

            <Group grow>
              <TextInput
                label="Genre"
                placeholder="e.g. Rock, Pop, Jazz"
                value={albumData.genre}
                onChange={(e) => updateAlbumData("genre", e.target.value)}
                size={isMobile ? "md" : "lg"}
              />
              <TextInput
                label="Release Date"
                placeholder="YYYY-MM-DD"
                value={albumData.releaseDate}
                onChange={(e) => updateAlbumData("releaseDate", e.target.value)}
                size={isMobile ? "md" : "lg"}
              />
            </Group>
          </Stack>
        </Group>
      </Card>

      <Divider my="xl" />

      {/* Tracks Section */}
      <Title order={3} mb="lg">Album Tracks</Title>

      <Stack>
        {albumTracks.map((track, i) => (
          <Card
            key={track.file.name + i}
            withBorder
            shadow="sm"
            radius="lg"
            p={isMobile ? "xs" : "md"}
            style={{
              backgroundColor: 'var(--mantine-color-body)',
              borderColor: 'var(--mantine-color-blue-2)',
              transition: 'transform 0.2s ease, box-shadow 0.2s ease',
            }}
            className="hover:shadow-md"
          >
            <AlbumMetadataDisplay
              isMobile={isMobile}
              track={track}
              onDelete={() => removeTrack(track)}
              onUpdate={(key: string, value: string) =>
                updateTrackMetadata(track, key, value)
              }
              onTrackNumberUpdate={(trackNumber: number) =>
                updateTrackNumber(track, trackNumber)
              }
            />
          </Card>
        ))}
      </Stack>

      <Space my={isMobile ? 12 : 16} />

      <Paper
        shadow="sm"
        p={isMobile ? "md" : "xl"}
        withBorder
        radius="lg"
        style={{
          borderStyle: 'dashed',
          borderWidth: '2px',
          borderColor: 'var(--mantine-color-blue-4)'
        }}
      >
        <Dropzone
          loading={uploadState === "pending"}
          onDrop={onDrop}
          accept={{
            'audio/*': ['.mp3', '.wav', '.flac', '.m4a', '.aac', '.ogg']
          }}
          style={{
            border: 'none',
            backgroundColor: 'transparent',
            minHeight: isMobile ? '150px' : '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <Stack align="center" justify="center" gap="md">
            <ThemeIcon size={isMobile ? 50 : 70} radius={isMobile ? 25 : 35} color="blue" variant="light">
              <IconUpload size={isMobile ? 30 : 40} />
            </ThemeIcon>
            <Text size={isMobile ? "md" : "lg"} fw={500} ta="center">
              Drop your album tracks here
            </Text>
            <Text size="sm" c="dimmed" ta="center">
              Drag and drop your audio files or click to browse
            </Text>
            <Badge variant="light" color="blue" size={isMobile ? "md" : "lg"}>
              MP3, WAV, FLAC, and more
            </Badge>
          </Stack>
        </Dropzone>
      </Paper>

      {albumTracks.length > 0 && (
        <Affix position={{ bottom: 20, right: 20 }}>
          <Button
            size="lg"
            loading={uploadState === "pending"}
            onClick={handleUpload}
            disabled={!albumData.title.trim() || albumTracks.length === 0}
          >
            Upload Album ({albumTracks.length} tracks)
          </Button>
        </Affix>
      )}
    </>
  );
}
