"use client";

import { createClient } from "@/utils/supabase/client";
import { Card, Button, Group, Text, Title, Stack } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import * as React from "react";

export interface IArtistBannerUploadProps {
  artistId?: string;
  onBannerUploaded?: (url: string) => void;
}

export function ArtistBannerUpload({
  artistId,
  onBannerUploaded,
}: IArtistBannerUploadProps) {
  const [uploadState, setUploadState] = React.useState<
    "initial" | "pending" | "error" | "success"
  >("initial");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  return (
    <Card withBorder p="md">
      <Stack gap="md">
        <Title order={4}>Banner Image</Title>
        <Text size="sm" c="dimmed">
          Upload a banner image for your artist profile
        </Text>
        {imageUrl ? (
          <div>
            <div
              style={{
                position: "relative",
                width: "100%",
                marginBottom: "0.5rem",
              }}
            >
              <img
                src={imageUrl}
                alt="Artist banner"
                style={{
                  width: "100%",
                  height: "200px",
                  objectFit: "cover",
                  borderRadius: "8px",
                }}
              />
              <Button
                onClick={deleteImage}
                color="red"
                variant="light"
                style={{
                  position: "absolute",
                  top: "8px",
                  right: "8px",
                }}
                radius="xl"
                size="sm"
              >
                <IconX size={16} />
              </Button>
            </div>
            <Text size="sm" c="dimmed">
              Your banner image has been uploaded
            </Text>
          </div>
        ) : (
          <Dropzone
            loading={uploadState === "pending"}
            onDrop={onDrop}
            accept={["image/png", "image/jpeg", "image/webp"]}
            maxSize={5 * 1024 * 1024}
            maxFiles={1}
          >
            <Group
              justify="center"
              align="center"
              style={{ minHeight: "120px" }}
            >
              <Dropzone.Accept>
                <IconUpload size={50} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={50} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <IconPhoto size={50} stroke={1.5} />
              </Dropzone.Idle>

              <Stack align="center">
                <Text size="xl" inline>
                  Drag banner image here or click to select
                </Text>
                <Text size="sm" c="dimmed" inline>
                  Attach one image file, size should not exceed 5mb
                </Text>
              </Stack>
            </Group>
          </Dropzone>
        )}
      </Stack>
    </Card>
  );

  async function deleteImage() {
    if (!artistId) {
      setImageUrl(null);
      if (onBannerUploaded) {
        onBannerUploaded("");
      }
      return;
    }

    setUploadState("pending");
    try {
      const supabase = await createClient();
      const { error } = await supabase.storage
        .from("artist-banners")
        .remove([artistId]);

      if (error) {
        console.error("Error deleting image:", error);
        notifications.show({
          title: "Error",
          message: `Failed to delete banner image: ${error.message}`,
          color: "red",
        });
        setUploadState("error");
        return;
      }

      setImageUrl(null);
      if (onBannerUploaded) {
        onBannerUploaded("");
      }
      notifications.show({
        message: "Banner image deleted successfully",
        color: "green",
      });
      setUploadState("initial");
    } catch (error: any) {
      console.error("Error deleting image:", error);
      notifications.show({
        title: "Error",
        message: `Failed to delete banner image: ${error.message || error}`,
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
          if (onBannerUploaded) {
            onBannerUploaded(url);
          }
        };
        reader.readAsDataURL(file);
        setUploadState("success");
        return;
      }

      // If artistId is provided, upload to Supabase
      const supabase = await createClient();
      const { data, error } = await supabase.storage
        .from("artist-banners")
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
        .from("artist-banners")
        .getPublicUrl(artistId);

      const url = publicUrlData.publicUrl;
      setImageUrl(url);

      if (onBannerUploaded) {
        onBannerUploaded(url);
      }

      notifications.show({
        message: "Banner image uploaded successfully",
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
