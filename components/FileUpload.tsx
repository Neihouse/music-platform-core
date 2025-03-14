"use client";
import { createClient } from "@/utils/supabase/client";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useState } from "react";
import { IAudioMetadata, parseBuffer } from "music-metadata";
import { Affix, Anchor, Button, Group, Space, Stack } from "@mantine/core";
import { MetadataDisplay } from "./track-upload/MetadataDisplay";
import { IconUpload } from "@tabler/icons-react";
import { createTrack } from "@/db/queries/tracks";

export interface IFileUploadProps {
  bucket: string;
}

export interface FileWithMetadata {
  metadata: IAudioMetadata;
  file: FileWithPath;
}

export function FileUpload({ bucket }: IFileUploadProps) {
  const [uploadState, setUploadState] = useState<
    "initial" | "pending" | "error" | "success"
  >();
  const [filesWithMetadata, setFilesWithMetadata] = useState<
    FileWithMetadata[]
  >([]);
  console.log(filesWithMetadata);

  return (
    <>
      <Stack>
        {filesWithMetadata.map((fM, i) => (
          <MetadataDisplay
            onDelete={() =>
              setFilesWithMetadata(filesWithMetadata.filter((f) => f !== fM))
            }
            key={fM.file.name + i}
            fileWithMetadata={fM}
            onUpdate={(key: string, value: string) =>
              updateFileMetadata(fM, key, value)
            }
          />
        ))}
      </Stack>
      <Space my={8} />
      <Dropzone loading={uploadState === "pending"} onDrop={onDrop}>
        <Group align="center" justify="center">
          <IconUpload size={150} />
        </Group>
      </Dropzone>
      <Affix
        hidden={!filesWithMetadata.length}
        position={{ bottom: 100, right: 80 }}
      >
        <Button
          disabled={uploadState === "pending"}
          onClick={() => uploadFiles(filesWithMetadata)}
        >
          Upload
        </Button>
      </Affix>
    </>
  );

  async function onDrop(files: FileWithPath[]) {
    try {
      setUploadState("pending");

      const newFilesWithMetadata = await Promise.all(
        files.map(async (file) => {
          const metadata = await parseBuffer(await file.bytes());
          return { file, metadata };
        })
      );

      setFilesWithMetadata((prev) => [...prev, ...newFilesWithMetadata]);
      setUploadState("initial");
    } catch (error) {
      handleError(error as string);
    }
  }

  async function uploadFiles(filesWithMetadata: FileWithMetadata[]) {
    setUploadState("pending");
    try {
      for await (const file of filesWithMetadata) {
        const {
          metadata: { common },
          file: { size, name },
        } = file;
        const title = common.title || name;

        common.title = title;

        const track = await createTrack(file.metadata, size);

        if (!track?.data?.id) throw new Error("No ID to upload to");

        const { error } = await createClient()
          .storage.from(bucket)
          .upload(track?.data?.id, file.file);

        if (error) {
          throw new Error(error.message);
        }
      }
    } catch (error: any) {
      handleError(error);
    }

    setUploadState("success");
    notifications.show({
      message: "Sucessfully uploaded track",
      color: "green",
    });

    setFilesWithMetadata([]);
  }

  function updateFileMetadata(
    file: FileWithMetadata,
    key: string,
    value: string
  ) {
    try {
      const selectedFile = filesWithMetadata.find((f) => f === file);

      if (!selectedFile) {
        throw new Error("No file found");
      }

      if (key === "title") {
        selectedFile.metadata.common.title = value;
      }

      setFilesWithMetadata((filesWithMetadata) => [
        ...filesWithMetadata.filter((f) => f.file.name !== file.file.name),
        selectedFile,
      ]);
    } catch (error: any) {
      handleError(error.message || error);
    }
  }

  function handleError(error: string) {
    setUploadState("error");
    notifications.show({
      title: "Upload Error",
      message: error,
      color: "red",
    });
  }
}
