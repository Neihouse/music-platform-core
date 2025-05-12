import { ArtistForm } from "@/components/onboarding/ArtistForm";
import { getArtist } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { createClient } from "@/utils/supabase/server";
import * as React from "react";

export interface IArtistCreatePageProps { }

export default async function ArtistCreatePage({ }: IArtistCreatePageProps) {
  const supabase = await createClient();
  const user = await getUser(supabase);
  const artist = await getArtist(supabase);

  return (
    <div>
      <ArtistForm artist={artist} />
    </div>
  );
}
