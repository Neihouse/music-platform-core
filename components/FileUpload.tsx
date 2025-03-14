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
  // TODO: enable user to clear error. may need to use a different solution
  // than `notifications`

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
        <Button onClick={() => uploadFiles(filesWithMetadata)}>Upload</Button>
      </Affix>
    </>
  );

  async function onDrop(files: FileWithPath[]) {
    /**
     *  TODO: switch to Resumable Uploads in order to support
     *  upload progress
     *
     *  https://supabase.com/docs/guides/storage/uploads/resumable-uploads
     */

    try {
      setUploadState("pending");

      for await (const file of files) {
        const metadata = await parseBuffer(await file.bytes());

        setFilesWithMetadata((filesWithMetadata) => [
          ...filesWithMetadata,
          {
            metadata,
            file,
          },
        ]);
      }
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
          metadata: { common, format },
          file: { size, name },
        } = file;
        const title = common.title || name;

        common.title = title;

        const track = await createTrack(file.metadata, file.file.size);

        if (!track?.data?.id) throw new Error("No ID to upload to");

        const { error, data } = await createClient()
          .storage.from(bucket)
          .upload(track?.data?.id, file.file);

        if (error) {
          console.log("full supabase error: ", error);

          throw new Error(error.message);
        }
      }
    } catch (error: any) {
      setUploadState("error");
      notifications.show({
        message: `${error.message}`,
        color: "red",
      });
    }
    setUploadState("success");
    notifications.show({
      message: "Sucessfully uploaded track",
      color: "green",
    });

    setFilesWithMetadata([]);
  }

  function handleError(error: string) {
    console.log("UPLOAD ERROR: ", error);

    setUploadState("error");
    notifications.show({
      title: "Upload Error",
      message: error,
      color: "red",
    });
  }
}
