import React, { useRef, useState } from "react";
import { Button, Group, Image, Text, Stack, Loader } from "@mantine/core";
import { Dropzone, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { IconPhoto, IconTrash } from "@tabler/icons-react";

export interface ImageUploadProps {
  initialUrl?: string;
  onUpload?: (file: File) => Promise<string>; // returns uploaded image URL
  onDelete?: (url: string) => Promise<void> | void;
  onDrop: (files: FileWithPath[]) => void; // optional, if you want to handle drop manually
  label?: string;
  maxSizeMB?: number;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  initialUrl = "",
  onUpload,
  onDelete,
  onDrop,
  label = "Drag image here or click to select",
  maxSizeMB = 5,
}) => {
  const [imageUrl, setImageUrl] = useState<string>(initialUrl);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileRef = useRef<File | null>(null);

  const handleDrop = async (files: FileWithPath[]) => {
    setError(null);
    const file = files[0];
    if (!file) return;
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File too large (max ${maxSizeMB}MB)`);
      return;
    }
    setLoading(true);
    try {
      if (onUpload) {
        const url = await onUpload(file);
        setImageUrl(url);
        fileRef.current = file;
      } else {
        onDrop(files);
        setImageUrl(URL.createObjectURL(file));
      }
    } catch (e: any) {
      setError(e?.message || "Upload failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!imageUrl) return;
    setLoading(true);
    try {
      await onDelete?.(imageUrl);
      setImageUrl("");
      fileRef.current = null;
    } catch (e: any) {
      setError(e?.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Stack gap="xs" align="center">
      {imageUrl ? (
        <>
          <Image src={imageUrl} alt="Uploaded image" w={220} h={220} fit="contain" radius="md" />
          <Button
            leftSection={<IconTrash size={16} />}
            color="red"
            variant="light"
            onClick={handleDelete}
            loading={loading}
            size="xs"
          >
            Delete
          </Button>
        </>
      ) : (
        <Dropzone
          onDrop={handleDrop}
          accept={IMAGE_MIME_TYPE}
          maxSize={maxSizeMB * 1024 * 1024}
          loading={loading}
          multiple={false}
        >
          <Group justify="center" align="center" mih={140}>
            {loading ? (
              <Loader />
            ) : (
              <>
                <IconPhoto size={48} />
                <Stack gap={0}>
                  <Text size="sm">{label}</Text>
                  <Text size="xs" c="dimmed">Max {maxSizeMB}MB</Text>
                </Stack>
              </>
            )}
          </Group>
        </Dropzone>
      )}
      {error && <Text c="red" size="xs">{error}</Text>}
    </Stack>
  );
};

export default ImageUpload;
