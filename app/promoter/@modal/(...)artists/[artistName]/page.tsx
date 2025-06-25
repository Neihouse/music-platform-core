import { getArtistByName } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { getArtistTracksWithPlayCounts } from "@/db/queries/tracks";
import { getArtistImagesServer } from "@/lib/image-utils";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { urlToName } from "@/lib/utils";
import ArtistModal from "@/components/ArtistModal";
import ArtistProfileContent from "@/components/ArtistProfileContent";

interface ArtistModalPageProps {
  params: Promise<{ artistName: string }>;
}

const ArtistModalPage = async ({ params }: ArtistModalPageProps) => {
  const { artistName } = await params;
  const decodedArtistName = urlToName(artistName);
  const supabase = await createClient();
  const user = await getUser(supabase);
  const artist = await getArtistByName(supabase, decodedArtistName);

  if (!artist) {
    notFound();
  }

  const userIsArtist = user?.id === artist.user_id;
  
  // Get tracks with play counts instead of using the basic track data
  const tracksWithPlayCounts = artist.id ? await getArtistTracksWithPlayCounts(supabase, artist.id) : [];

  // Get dynamic image URLs using the new combined function
  const { avatarUrl, bannerUrl } = artist.id ? await getArtistImagesServer(supabase, artist.id) : { avatarUrl: null, bannerUrl: null };

  return (
    <ArtistModal>
      <ArtistProfileContent
        artist={artist}
        user={user}
        userIsArtist={userIsArtist}
        tracksWithPlayCounts={tracksWithPlayCounts}
        avatarUrl={avatarUrl}
        bannerUrl={bannerUrl}
      />
    </ArtistModal>
  );
};

export default ArtistModalPage;
