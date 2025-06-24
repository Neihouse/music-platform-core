"use client";

import { createClient } from "@/utils/supabase/client";
import { Card, Button, Group, Text, Title, Stack } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { IconUpload, IconPhoto, IconX } from "@tabler/icons-react";
import * as React from "react";
import { v4 as uuidv4 } from "uuid";

export interface BannerUploadConfig {
  /** The storage bucket name */
  storageBucket: string;
  /** The storage folder path (e.g., "banners") */
  storageFolder: string;
  /** Display title for the upload section */
  title: string;
  /** Description text for the upload section */
  description: string;
}

export interface IBannerUploadProps {
  /** The entity ID (can be artistId, promoterId, venueId, etc.) */
  entityId?: string;
  /** Configuration for the specific entity type */
  config: BannerUploadConfig;
  /** Function to fetch existing banner filename */
  fetchExistingBanner?: (entityId: string) => Promise<string | null>;
  /** Function to update the entity with new banner filename */
  updateEntityBanner?: (entityId: string, filename: string | null) => Promise<void>;
  /** Callback when banner is uploaded */
  onBannerUploaded?: (url: string) => void;
}

export function BannerUpload({
  entityId,
  config,
  fetchExistingBanner,
  updateEntityBanner,
  onBannerUploaded,
}: IBannerUploadProps) {
  const [uploadState, setUploadState] = React.useState<
    "initial" | "pending" | "error" | "success"
  >("initial");
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);
  const [currentBannerFilename, setCurrentBannerFilename] = React.useState<string | null>(null);

  // Fetch existing banner when component mounts
  React.useEffect(() => {
    async function fetchBanner() {
      if (!entityId || !fetchExistingBanner) return;

      try {
        const bannerFilename = await fetchExistingBanner(entityId);

        if (bannerFilename) {
          const supabase = await createClient();
          const { data: publicUrlData } = supabase.storage
            .from(config.storageBucket)
            .getPublicUrl(`${config.storageFolder}/${bannerFilename}`);

          const url = publicUrlData.publicUrl;
          setImageUrl(url);
          setCurrentBannerFilename(bannerFilename);

          if (onBannerUploaded) {
            onBannerUploaded(url);
          }
        }
      } catch (error) {
        console.error("Error fetching existing banner:", error);
      }
    }

    fetchBanner();
  }, [entityId, onBannerUploaded, config, fetchExistingBanner]);

  return (
    <Card withBorder p="md">
      <Stack gap="md">
        <Title order={4}>{config.title}</Title>
        <Text size="sm" c="dimmed">
          {config.description}
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
                alt="Banner image"
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
    if (!entityId) {
      setImageUrl(null);
      setCurrentBannerFilename(null);
      if (onBannerUploaded) {
        onBannerUploaded("");
      }
      return;
    }

    setUploadState("pending");
    try {
      const supabase = await createClient();
      
      // Delete the file from storage if it exists
      if (currentBannerFilename) {
        const { error: storageError } = await supabase.storage
          .from(config.storageBucket)
          .remove([`${config.storageFolder}/${currentBannerFilename}`]);

        if (storageError) {
          console.error("Error deleting banner file:", storageError);
        }
      }

      // Update the entity to remove the banner filename
      if (updateEntityBanner) {
        await updateEntityBanner(entityId, null);
      }

      setImageUrl(null);
      setCurrentBannerFilename(null);
      if (onBannerUploaded) {
        onBannerUploaded("");
      }
      notifications.show({
        message: "Banner image deleted successfully",
        color: "green",
      });
      setUploadState("initial");
    } catch (error: any) {
      console.error("Error deleting banner image:", error);
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
      // If no entityId is provided, we're in create mode and just want to preview the image
      if (!entityId) {
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

      // Generate a random UUID for the filename
      const filename = uuidv4();

      const supabase = await createClient();

      // Delete old banner file if it exists
      if (currentBannerFilename) {
        await supabase.storage
          .from(config.storageBucket)
          .remove([`${config.storageFolder}/${currentBannerFilename}`]);
      }

      // Upload new banner with UUID filename
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

      // Update the entity with the new banner filename
      if (updateEntityBanner) {
        await updateEntityBanner(entityId, filename);
      }

      const { data: publicUrlData } = supabase.storage
        .from(config.storageBucket)
        .getPublicUrl(`${config.storageFolder}/${filename}`);

      const url = publicUrlData.publicUrl;
      setImageUrl(url);
      setCurrentBannerFilename(filename);

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
