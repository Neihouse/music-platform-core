import { TrackUpload } from "@/components/track-upload";
import * as React from "react";

export interface IUploadTrackPageProps {}

export default function UploadTrackPage({}: IUploadTrackPageProps) {
  return (
    <div>
      <TrackUpload />
    </div>
  );
}
