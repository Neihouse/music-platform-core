"use client";
import { useState } from "react";
import { MetadataInput } from "./MetadataInput";
import { FileUpload } from "../FileUpload";

export interface ITrackUploadProps {}

export function TrackUpload(props: ITrackUploadProps) {
  const [trackMetadata, setTrackMetadata] = useState<{
    title: string;
    id: string;
  }>();

  console.log(trackMetadata);

  return (
    <div>
      <MetadataInput onCreate={(trackMeta) => setTrackMetadata(trackMeta)} />

      {!!trackMetadata && (
        <FileUpload filePath={trackMetadata.id} bucket="tracks" />
      )}
    </div>
  );
}
