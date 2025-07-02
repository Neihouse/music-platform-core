"use client";

import { getAvatarUrl } from "@/lib/images/image-utils-client";
import { createClient } from "@/utils/supabase/client";
import { Card, Button, Group, Text, Title, Stack, Avatar } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useMediaQuery } from "@mantine/hooks";
import { IconUpload, IconUser, IconX } from "@tabler/icons-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

export interface AvatarUploadConfig {
  /** The storage bucket name */
  storageBucket: string;
  /** The storage folder path (e.g., "avatars") */
  storageFolder: string;
  /** Display title for the upload section */
  title: string;
  /** Description text for the upload section */
  description: string;
  /** Avatar size in pixels */
  avatarSize?: number;
  /** Max file size in bytes */
  maxFileSize?: number;
}

export interface IAvatarUploadProps {
  /** The entity ID (can be artistId, promoterId, venueId, etc.) */
  entityId?: string;
  /** Configuration for the specific entity type */
  config: AvatarUploadConfig;
  /** Function to fetch existing avatar filename */
  fetchExistingAvatar?: (entityId: string) => Promise<string | null>;
  /** Function to update the entity with new avatar filename */
  updateEntityAvatar?: (entityId: string, filename: string | null) => Promise<void>;
  /** Callback when avatar is uploaded */
  onAvatarUploaded?: (url: string) => void;
}

export function AvatarUpload({
  entityId,
  config,
  fetchExistingAvatar,
  updateEntityAvatar,
  onAvatarUploaded,
}: IAvatarUploadProps) {
  const [uploadState, setUploadState] = React.useState<
    "initial" | "pending" | "error" | "success"
  >("initial");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [currentAvatarFilename, setCurrentAvatarFilename] = React.useState<string | null>(null);

  // Mobile responsive hooks
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  const avatarSize = config.avatarSize || (isSmallMobile ? 100 : isMobile ? 120 : 150);
  const maxFileSize = config.maxFileSize || 2 * 1024 * 1024; // 2MB default

  // Fetch existing avatar when component mounts
  React.useEffect(() => {
    async function fetchAvatar() {
      if (!entityId || !fetchExistingAvatar) return;

      try {
        const avatarFilename = await fetchExistingAvatar(entityId);

        if (avatarFilename) {
          const url = await getAvatarUrl(avatarFilename)
          setImageUrl(url);
          setCurrentAvatarFilename(avatarFilename);

          if (onAvatarUploaded) {
            onAvatarUploaded(url);
          }
        }
      } catch (error) {
      console.error("Error fetching existing avatar:", error);
      }
    }

    fetchAvatar();
  }, [entityId, onAvatarUploaded, config, fetchExistingAvatar]);

  return (
    <Card withBorder p={isSmallMobile ? "sm" : "md"}>
      <Stack gap={isSmallMobile ? "sm" : "md"}>
        <Title order={4} size={isSmallMobile ? "1rem" : undefined}>
          {config.title}
        </Title>
        <Text size={isSmallMobile ? "xs" : "sm"} c="dimmed">
          {config.description}
        </Text>
        <Group justify="center" mt="xs">
          {imageUrl ? (
            <div style={{ position: "relative", textAlign: "center" }}>
              <Avatar
                src={imageUrl}
                alt="Avatar image"
                size={avatarSize}
                radius={avatarSize / 2}
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
                size={isSmallMobile ? "xs" : "sm"}
              >
                <IconX size={isSmallMobile ? 12 : 16} />
              </Button>
            </div>
          ) : (
            <Dropzone
              loading={uploadState === "pending"}
              onDrop={onDrop}
              accept={["image/png", "image/jpeg", "image/webp"]}
              maxSize={maxFileSize}
              maxFiles={1}
              style={{
                width: `${avatarSize}px`,
                height: `${avatarSize}px`,
                borderRadius: `${avatarSize / 2}px`,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                minHeight: "auto",
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
                  <IconUpload size={isSmallMobile ? 24 : 40} stroke={1.5} />
                </Dropzone.Accept>
                <Dropzone.Reject>
                  <IconX size={isSmallMobile ? 24 : 40} stroke={1.5} />
                </Dropzone.Reject>
                <Dropzone.Idle>
                  <IconUser size={isSmallMobile ? 24 : 40} stroke={1.5} />
                </Dropzone.Idle>
              </Group>
            </Dropzone>
          )}
        </Group>
        <Text size="xs" c="dimmed" ta="center">
          Square image recommended, max {Math.round(maxFileSize / (1024 * 1024))}MB
        </Text>
      </Stack>
    </Card>
  );

  async function deleteImage() {
    if (!entityId) {
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
          .from(config.storageBucket)
          .remove([`${config.storageFolder}/${currentAvatarFilename}`]);

        if (storageError) {
          console.error("Error deleting avatar file:", storageError);
        }
      }

      // Update the entity to remove the avatar filename
      if (updateEntityAvatar) {
        await updateEntityAvatar(entityId, null);
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
      console.error("Error deleting avatar image:", error);
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
      // If no entityId is provided, we're in create mode and just want to preview the image
      if (!entityId) {
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
          .from(config.storageBucket)
          .remove([`${config.storageFolder}/${currentAvatarFilename}`]);
      }

      // Upload new avatar with UUID filename
      const { data, error } = await supabase.storage
        .from(config.storageBucket)
        .upload(`${config.storageFolder}/${filename}`, file, {
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

      // Update the entity with the new avatar filename
      if (updateEntityAvatar) {
        await updateEntityAvatar(entityId, filename);
      }

      const { data: publicUrlData } = supabase.storage
        .from(config.storageBucket)
        .getPublicUrl(`${config.storageFolder}/${filename}`);

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
