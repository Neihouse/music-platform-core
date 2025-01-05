"use client";

import { TrackEditor } from "@/components/track/TrackEditor";

export default function UploadPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Upload Track</h1>
      <TrackEditor />
    </div>
  );
}
