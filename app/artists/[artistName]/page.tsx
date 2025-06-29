import { getArtistByName } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { getArtistTracksWithPlayCounts } from "@/db/queries/tracks";
import { getArtistImagesServer } from "@/lib/images/image-utils";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { urlToName } from "@/lib/utils";
import ArtistProfileContent from "@/components/ArtistProfileContent";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) {
  const { artistName } = await params;
  const decodedArtistName = urlToName(artistName);
  const supabase = await createClient();
  const user = await getUser(supabase);
  const artist = await getArtistByName(supabase, decodedArtistName);

  if (!artist) {
    notFound();
  }
  
  // Get tracks with play counts instead of using the basic track data
  const tracksWithPlayCounts = artist.id ? await getArtistTracksWithPlayCounts(supabase, artist.id) : [];

  // Get dynamic image URLs using the new combined function
  const { avatarUrl, bannerUrl } = artist.id ? await getArtistImagesServer(supabase, artist.id) : { avatarUrl: null, bannerUrl: null };

  // Check if the current user can edit this artist profile
  const canEdit = user?.id === artist.user_id;

  return (
    <ArtistProfileContent
      artist={artist}
      canEdit={canEdit}
      tracksWithPlayCounts={tracksWithPlayCounts}
      avatarUrl={avatarUrl}
      bannerUrl={bannerUrl}
      storedLocality={undefined}
    />
  );
}
