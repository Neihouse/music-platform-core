"use client";
import { createClient } from "@/utils/supabase/client";
import { Dropzone, FileWithPath } from "@mantine/dropzone";
import { notifications } from "@mantine/notifications";
import { useState } from "react";

export interface IFileUploadProps {
  bucket: string;
  filePath: string;
}

export function FileUpload({ bucket, filePath }: IFileUploadProps) {
  const [uploadState, setUploadState] = useState<
    "initial" | "pending" | "error" | "success"
  >();
  // TODO: enable user to clear error. may need to use a different solution
  // than `notifications`

  return <Dropzone loading={uploadState === "pending"} onDrop={onDrop} />;

  async function onDrop(files: FileWithPath[]) {
    /**
     *  TODO: switch to Resumable Uploads in order to support
     *  upload progress
     *
     *  https://supabase.com/docs/guides/storage/uploads/resumable-uploads
     */

    if (files.length > 2) {
      throw new Error("Support for multiple files not yet implemented");
    }
    try {
      setUploadState("pending");

      const { error, data } = await createClient()
        .storage.from(bucket)
        .upload(filePath, files[0]);

      if (error) {
        console.log("full supabase error: ", error);

        throw new Error(error.message);
      }

      setUploadState("success");
      notifications.show({
        message: "Sucessfully uploaded track",
        color: "green",
      });
    } catch (error) {
      handleError(error as string);
    }
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
