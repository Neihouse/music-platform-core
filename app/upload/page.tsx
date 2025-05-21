"use client";
import { TrackUpload } from "@/components/Upload";
import * as React from "react";

export interface IUploadTrackPageProps { }

export default function UploadTrackPage({ }: IUploadTrackPageProps) {
  return (
    <div>
      <TrackUpload />
    </div>
  );
}
