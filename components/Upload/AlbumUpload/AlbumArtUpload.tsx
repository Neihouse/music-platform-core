"use client";
import { createClient } from "@/utils/supabase/client";
import { Card, Button, Group, Text, Stack, Image, Box } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import * as React from "react";

export interface IAlbumArtUploadProps {
  albumArtUrl: string;
  onArtworkUploaded: (url: string) => void;
  albumId?: string;
  isMobile?: boolean;
}

export function AlbumArtUpload({
  albumArtUrl,
  onArtworkUploaded,
  albumId,
  isMobile = false
}: IAlbumArtUploadProps) {
  const [uploadState, setUploadState] = React.useState<
    "initial" | "pending" | "error" | "success"
  >("initial");

  const imageSize = isMobile ? 150 : 200;
  const cardWidth = imageSize + 32;

  return (
    <Box w={cardWidth} style={{ flexShrink: 0 }}>
      <Stack align="center" gap="sm">
        <Text size="sm" fw={500} ta="center">Album Artwork</Text>

        {albumArtUrl ? (
          <Card
            withBorder
            shadow="sm"
            radius="md"
            p="sm"
            w={cardWidth}
          >
            <Stack align="center" gap="sm">
              <Image
                src={albumArtUrl}
                alt="Album artwork"
                w={imageSize}
                h={imageSize}
                radius="md"
                fit="cover"
              />
              <Button
                variant="light"
                color="red"
                size="xs"
                onClick={deleteImage}
                fullWidth
                loading={uploadState === "pending"}
              >
                Remove
              </Button>
            </Stack>
          </Card>
        ) : (
          <Card
            withBorder
            shadow="sm"
            radius="md"
            p="sm"
            w={cardWidth}
          >
            <Stack align="center" gap="sm">
              <Dropzone
                onDrop={onDrop}
                accept={{
                  'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.webp']
                }}
                loading={uploadState === "pending"}
                w={imageSize}
                h={imageSize}
                style={{
                  border: '2px dashed var(--mantine-color-gray-4)',
                  borderRadius: 'var(--mantine-radius-md)',
                  backgroundColor: 'var(--mantine-color-gray-0)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  transition: 'border-color 0.2s ease'
                }}
              >
                <Stack align="center" gap="xs" style={{ pointerEvents: 'none' }}>
                  <Dropzone.Accept>
                    <IconUpload size={40} stroke={1.5} />
                  </Dropzone.Accept>
                  <Dropzone.Reject>
                    <IconX size={40} stroke={1.5} />
                  </Dropzone.Reject>
                  <Dropzone.Idle>
                    <IconPhoto size={40} stroke={1.5} />
                  </Dropzone.Idle>

                  <Text size="xs" ta="center" c="dimmed">
                    Drop artwork here
                  </Text>
                </Stack>
              </Dropzone>
            </Stack>
          </Card>
        )}

        <Text size="xs" c="dimmed" ta="center" style={{ lineHeight: 1.3 }}>
          Square image recommended, max 5MB
        </Text>
      </Stack>
    </Box>
  );

  async function deleteImage() {
    if (!albumId) {
      onArtworkUploaded("");
      return;
    }

    setUploadState("pending");
    try {
      const supabase = await createClient();
      const { error } = await supabase.storage
        .from("album-artwork")
        .remove([albumId]);

      if (error) {
        console.error("Error deleting image:", error);
        notifications.show({
          title: "Error",
          message: `Failed to delete album artwork: ${error.message}`,
          color: "red",
        });
        setUploadState("error");
        return;
      }

      onArtworkUploaded("");
      notifications.show({
        message: "Album artwork deleted successfully",
        color: "green",
      });
      setUploadState("initial");
    } catch (error: any) {
      console.error("Error deleting image:", error);
      notifications.show({
        title: "Error",
        message: `Failed to delete album artwork: ${error.message || error}`,
        color: "red",
      });
      setUploadState("error");
    }
  }

  async function onDrop(files: FileWithPath[]) {
    if (files.length === 0) return;

    setUploadState("pending");
    const file = files[0];

    try {
      // If no albumId is provided, we're in create mode and just want to preview the image
      if (!albumId) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          onArtworkUploaded(url);
        };
        reader.readAsDataURL(file);
        setUploadState("success");
        return;
      }

      // If albumId is provided, upload to Supabase
      const supabase = await createClient();
      const { data, error } = await supabase.storage
        .from("album-artwork")
        .upload(albumId, file, {
          upsert: true,
          cacheControl: "3600",
          contentType: file.type,
        });

      if (error) {
        console.error("Error uploading file:", error);
        notifications.show({
          title: "Upload Error",
          message: error.message,
          color: "red",
        });
        setUploadState("error");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("album-artwork")
        .getPublicUrl(albumId);

      const url = publicUrlData.publicUrl;
      onArtworkUploaded(url);

      notifications.show({
        message: "Album artwork uploaded successfully",
        color: "green",
      });

      setUploadState("success");
    } catch (error: any) {
      console.error("Error uploading file:", error);
      notifications.show({
        title: "Upload Error",
        message: error.message || String(error),
        color: "red",
      });
      setUploadState("error");
    }
  }
}
