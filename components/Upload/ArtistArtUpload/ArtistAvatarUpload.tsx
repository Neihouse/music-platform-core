"use client";

import { createClient } from "@/utils/supabase/client";
import { Card, Button, Group, Text, Title, Stack, Avatar } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconUser, IconX } from "@tabler/icons-react";
import * as React from "react";

export interface IArtistAvatarUploadProps {
  artistId?: string;
  onAvatarUploaded?: (url: string) => void;
}

export function ArtistAvatarUpload({
  artistId,
  onAvatarUploaded,
}: IArtistAvatarUploadProps) {
  const [uploadState, setUploadState] = React.useState<
    "initial" | "pending" | "error" | "success"
  >("initial");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  return (
    <Card withBorder p="md">
      <Stack gap="md">
        <Title order={4}>Profile Picture</Title>
        <Text size="sm" c="dimmed">
          Upload a profile picture for your artist account
        </Text>
        <Group justify="center" mt="xs">
          {imageUrl ? (
            <div style={{ position: "relative", textAlign: "center" }}>
              <Avatar
                src={imageUrl}
                alt="Artist avatar"
                size={150}
                radius={100}
                style={{ margin: "0 auto" }}
              />
              <Button
                onClick={deleteImage}
                color="red"
                variant="light"
                style={{
                  position: "absolute",
                  bottom: -10,
                  right: -10,
                }}
                radius="xl"
                size="sm"
              >
                <IconX size={16} />
              </Button>
            </div>
          ) : (
            <Dropzone
              loading={uploadState === "pending"}
              onDrop={onDrop}
              accept={["image/png", "image/jpeg", "image/webp"]}
              maxSize={2 * 1024 * 1024}
              maxFiles={1}
              style={{
                width: "150px",
                height: "150px",
                borderRadius: "100px",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Group
                justify="center"
                align="center"
                style={{
                  height: "100%",
                  width: "100%",
                  position: "absolute",
                  top: 0,
                  left: 0,
                }}
              >
                <Dropzone.Accept>
                  <IconUpload size={40} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={40} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconUser size={40} stroke={1.5} />
                </Dropzone.Idle>
              </Group>
            </Dropzone>
          )}
        </Group>
        <Text size="xs" c="dimmed" ta="center">
          Square image recommended, max 2MB
        </Text>
      </Stack>
    </Card>
  );

  async function deleteImage() {
    if (!artistId) {
      setImageUrl(null);
      if (onAvatarUploaded) {
        onAvatarUploaded("");
      }
      return;
    }

    setUploadState("pending");
    try {
      const supabase = await createClient();
      const { error } = await supabase.storage
        .from("artist-avatars")
        .remove([artistId]);

      if (error) {
        console.error("Error deleting image:", error);
        notifications.show({
          title: "Error",
          message: `Failed to delete avatar image: ${error.message}`,
          color: "red",
        });
        setUploadState("error");
        return;
      }

      setImageUrl(null);
      if (onAvatarUploaded) {
        onAvatarUploaded("");
      }
      notifications.show({
        message: "Avatar image deleted successfully",
        color: "green",
      });
      setUploadState("initial");
    } catch (error: any) {
      console.error("Error deleting image:", error);
      notifications.show({
        title: "Error",
        message: `Failed to delete avatar image: ${error.message || error}`,
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
      // If no artistId is provided, we're in create mode and just want to preview the image
      if (!artistId) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const url = e.target?.result as string;
          setImageUrl(url);
          if (onAvatarUploaded) {
            onAvatarUploaded(url);
          }
        };
        reader.readAsDataURL(file);
        setUploadState("success");
        return;
      }

      // If artistId is provided, upload to Supabase
      const supabase = await createClient();
      const { data, error } = await supabase.storage
        .from("artist-avatars")
        .upload(artistId, file, {
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
        .from("artist-avatars")
        .getPublicUrl(artistId);

      const url = publicUrlData.publicUrl;
      setImageUrl(url);

      if (onAvatarUploaded) {
        onAvatarUploaded(url);
      }

      notifications.show({
        message: "Avatar image uploaded successfully",
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
