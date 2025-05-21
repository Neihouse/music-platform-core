import { TrackUpload } from "@/components/Upload/TrackUpload";
import { getArtist } from "@/db/queries/artists";
import { createClient } from "@/utils/supabase/server";
import * as React from "react";

export interface IUploadTrackPageProps { }

export default async function UploadTrackPage({ }: IUploadTrackPageProps) {
  const supabase = await createClient();
  const artist = await getArtist(supabase);

  return (
    <div>
      <TrackUpload />
    </div>
  );
}
