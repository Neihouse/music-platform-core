"use client";

import { createClient } from "@/utils/supabase/client";
import { Button, Card, Group, Stack, Text, Title } from "@mantine/core";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { IconPhoto, IconUpload, IconX } from "@tabler/icons-react";
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

  // Mobile responsive hooks
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  // Fetch existing banner when component mounts
  React.useEffect(() => {
    async function fetchBanner() {
      if (!entityId || !fetchExistingBanner) return;

      try {
        const bannerFilename = await fetchExistingBanner(entityId);

        if (bannerFilename) {
          // Check if the file exists in storage before getting the URL
          const supabase = await createClient();
          const { data, error } = await supabase.storage
            .from(config.storageBucket)
            .list(config.storageFolder, {
              search: bannerFilename
            });

          if (error) {
            console.error("Error checking file existence:", error);
            return;
          }

          // Check if the file was found in the storage bucket
          const fileExists = data && data.some(file => file.name === bannerFilename);

          if (fileExists) {
            const { data: publicUrlData } = supabase.storage
              .from(config.storageBucket)
              .getPublicUrl(`${config.storageFolder}/${bannerFilename}`);

            const url = publicUrlData.publicUrl;
            setImageUrl(url);
            setCurrentBannerFilename(bannerFilename);

            if (onBannerUploaded) {
              onBannerUploaded(url);
            }
          } else {
            console.warn(`Banner file ${bannerFilename} not found in storage`);
            // Optionally, you could clear the banner filename from the database here
            // if (updateEntityBanner) {
            //   await updateEntityBanner(entityId, null);
            // }
          }
        }
      } catch (error) {
        console.error("Error fetching existing banner:", error);
      }
    }

    fetchBanner();
  }, [entityId, onBannerUploaded, config, fetchExistingBanner]);

  return (
    <Card withBorder p={isSmallMobile ? "sm" : "md"}>
      <Stack gap={isSmallMobile ? "sm" : "md"}>
        <Title order={4} size={isSmallMobile ? "1rem" : undefined}>
          {config.title}
        </Title>
        <Text size={isSmallMobile ? "xs" : "sm"} c="dimmed">
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
                  height: isSmallMobile ? "120px" : isMobile ? "160px" : "200px",
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
                  top: 8,
                  right: 8,
                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(4px)",
                  border: "1px solid rgba(0, 0, 0, 0.1)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.15)",
                }}
                radius="md"
                size={isSmallMobile ? "xs" : "sm"}
              >
                <IconX size={isSmallMobile ? 12 : 16} />
              </Button>
            </div>
          </div>
        ) : (
          <Dropzone
            loading={uploadState === "pending"}
            onDrop={onDrop}
            accept={["image/png", "image/jpeg", "image/webp"]}
            maxSize={5 * 1024 * 1024} // 5MB
            maxFiles={1}
            style={{
              minHeight: isSmallMobile ? "120px" : isMobile ? "160px" : "200px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <Group justify="center" align="center" gap={isSmallMobile ? "xs" : "sm"}>
              <Dropzone.Accept>
                <IconUpload size={isSmallMobile ? 24 : 40} stroke={1.5} />
              </Dropzone.Accept>
              <Dropzone.Reject>
                <IconX size={isSmallMobile ? 24 : 40} stroke={1.5} />
              </Dropzone.Reject>
              <Dropzone.Idle>
                <Stack align="center" gap={isSmallMobile ? "xs" : "sm"}>
                  <IconPhoto size={isSmallMobile ? 24 : 40} stroke={1.5} />
                  <Text size={isSmallMobile ? "xs" : "sm"} ta="center">
                    {isSmallMobile ? "Upload banner" : "Drag banner image here or click to select"}
                  </Text>
                  <Text size="xs" c="dimmed" ta="center">
                    Wide image recommended (16:9 ratio), max 5MB
                  </Text>
                </Stack>
              </Dropzone.Idle>
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

      console.log("Uploading new banner with filename:", filename);
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
