import { getArtist } from "@/db/queries/artists";
import { createClient } from "@/utils/supabase/server";
import * as React from "react";

export interface IArtistEditPageProps {
  params: Promise<{ artistName: string }>;
}

export default async function ArtistEditPage({ params }: IArtistEditPageProps) {
  const { artistName } = await params;
  const supabase = await createClient();
  const artist = await getArtist(supabase);

  console.log("artist", artist);
  console.log("artistName", artistName);

  return <div>artist edit page</div>;
}
