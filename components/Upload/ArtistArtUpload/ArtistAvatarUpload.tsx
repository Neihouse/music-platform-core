"use client";

import { createClient } from "@/utils/supabase/client";
import { Card, Button, Group, Text, Title, Stack, Avatar } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconUser, IconX } from "@tabler/icons-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

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
  const [currentAvatarFilename, setCurrentAvatarFilename] = React.useState<string | null>(null);

  // Fetch existing avatar when component mounts
  React.useEffect(() => {
    async function fetchExistingAvatar() {
      if (!artistId) return;

      try {
        const supabase = await createClient();

        // Get avatar filename from artist table
        const { data: artist, error: artistError } = await supabase
          .from("artists")
          .select("avatar_img")
          .eq("id", artistId)
          .single();

        if (artistError) {
          console.error("Error fetching artist data:", artistError);
          return;
        }

        // If artist has an avatar filename, get the public URL
        if (artist?.avatar_img) {
          const { data: publicUrlData } = supabase.storage
            .from("avatars")
            .getPublicUrl(artist.avatar_img);

          const url = publicUrlData.publicUrl;
          setImageUrl(url);
          setCurrentAvatarFilename(artist.avatar_img);

          if (onAvatarUploaded) {
            onAvatarUploaded(url);
          }
        }
      } catch (error) {
        console.error("Error fetching existing avatar:", error);
      }
    }

    fetchExistingAvatar();
  }, [artistId, onAvatarUploaded]);

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
                  top: -10,
                  right: -10,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
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
      setCurrentAvatarFilename(null);
      if (onAvatarUploaded) {
        onAvatarUploaded("");
      }
      return;
    }

    setUploadState("pending");
    try {
      const supabase = await createClient();
      
      // Delete the file from storage if it exists
      if (currentAvatarFilename) {
        const { error: storageError } = await supabase.storage
          .from("avatars")
          .remove([currentAvatarFilename]);

        if (storageError) {
          console.error("Error deleting avatar file:", storageError);
        }
      }

      // Update the artist table to remove the avatar filename
      const { error: dbError } = await supabase
        .from("artists")
        .update({ avatar_img: null })
        .eq("id", artistId);

      if (dbError) {
        console.error("Error updating artist avatar:", dbError);
        notifications.show({
          title: "Error",
          message: `Failed to update avatar: ${dbError.message}`,
          color: "red",
        });
        setUploadState("error");
        return;
      }

      setImageUrl(null);
      setCurrentAvatarFilename(null);
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

      // Generate a random UUID for the filename
      const filename = uuidv4();
 

      const supabase = await createClient();

      // Delete old avatar file if it exists
      if (currentAvatarFilename) {
        await supabase.storage
          .from("avatars")
          .remove([currentAvatarFilename]);
      }

      // Upload new avatar with UUID filename
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(filename, file, {
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

      // Update the artist table with the new avatar filename
      const { error: dbError } = await supabase
        .from("artists")
        .update({ avatar_img: filename })
        .eq("id", artistId);

      if (dbError) {
        console.error("Error updating artist avatar:", dbError);
        notifications.show({
          title: "Database Error",
          message: dbError.message,
          color: "red",
        });
        setUploadState("error");
        return;
      }

      const { data: publicUrlData } = supabase.storage
        .from("avatars")
        .getPublicUrl(filename);

      const url = publicUrlData.publicUrl;
      setImageUrl(url);
      setCurrentAvatarFilename(filename);

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
