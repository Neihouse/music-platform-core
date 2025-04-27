import { createClient } from "@/utils/supabase/client";
import { Button, Group } from "@mantine/core";
import { Dropzone } from "@mantine/dropzone";
import { IconUpload } from "@tabler/icons-react";
import * as React from "react";

export interface IArtistArtUploadProps {
  artistId: string;
}

export function ArtistArtUpload({ artistId }: IArtistArtUploadProps) {
  const [uploadState, setUploadState] = React.useState<
    "initial" | "pending" | "error" | "success"
  >();
  const [imageUrl, setImageUrl] = React.useState<string | null>(null);

  return (
    <div>
      {imageUrl ? (
        <div>
          <img
            src={imageUrl}
            alt="Uploaded image"
            style={{ width: "100%", height: "auto" }}
          />
          <Button onClick={deleteImage}>Delete</Button>
        </div>
      ) : (
        <Dropzone loading={uploadState === "pending"} onDrop={onDrop}>
          <Group align="center" justify="center">
            <IconUpload size={150} />
          </Group>
        </Dropzone>
      )}
    </div>
  );

  async function deleteImage() {
    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("images")
      .remove([artistId]);
    console.log("Image deleted:", data);
    if (error) {
      console.error("Error deleting image:", error);
      return;
    }
  }

  async function onDrop(files: File[]) {
    setUploadState("pending");
    console.log("Files dropped:", files);
    const file = files[0];

    const supabase = await createClient();
    const { data, error } = await supabase.storage
      .from("images")
      .upload(artistId, file);

    console.log("Upload result:", data);
    if (error) {
      console.error("Error uploading file:", error);
      setUploadState("error");
      return;
    }

    const url = supabase.storage.from("images").getPublicUrl(artistId)
      .data.publicUrl;
    setImageUrl(url);

    setUploadState("success");
  }
}
