import { getArtistByName, getArtistLocalities, getArtistPromoters, getArtistEvents } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { getArtistTracksWithPlayCounts } from "@/db/queries/tracks";
import { getArtistImagesServer, getPromoterImagesServer } from "@/lib/images/image-utils";
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

  // Get artist's localities
  const artistLocalities = artist.id ? await getArtistLocalities(supabase, artist.id) : [];

  // Get artist promoters/collectives
  const promoters = artist.id ? await getArtistPromoters(supabase, artist.id) : [];

  // Get promoter images for each promoter
  const promotersWithImages = await Promise.all(
    promoters.map(async (promoter) => {
      const { avatarUrl, bannerUrl } = await getPromoterImagesServer(supabase, promoter.id);
      return {
        ...promoter,
        avatarUrl,
        bannerUrl,
      };
    })
  );

  // Get artist events
  const events = artist.id ? await getArtistEvents(supabase, artist.id) : [];
  
  // Create StoredLocality from the first locality (if available)
  const storedLocality = artistLocalities.length > 0 && artistLocalities[0].localities ? {
    locality: {
      id: artistLocalities[0].localities.id,
      name: artistLocalities[0].localities.name,
      administrative_area_id: artistLocalities[0].localities.administrative_area_id,
      country_id: artistLocalities[0].localities.country_id,
      created_at: artistLocalities[0].localities.created_at,
    },
    administrativeArea: {
      id: artistLocalities[0].localities.administrative_areas.id,
      name: artistLocalities[0].localities.administrative_areas.name,
      country_id: artistLocalities[0].localities.administrative_areas.country_id,
      created_at: artistLocalities[0].localities.administrative_areas.created_at,
    },
    country: {
      id: artistLocalities[0].localities.administrative_areas.countries.id,
      name: artistLocalities[0].localities.administrative_areas.countries.name,
      created_at: artistLocalities[0].localities.administrative_areas.countries.created_at,
    }
  } : undefined;

  // Check if the current user can edit this artist profile
  const canEdit = user?.id === artist.user_id;

  return (
    <ArtistProfileContent
      artist={artist}
      canEdit={canEdit}
      tracksWithPlayCounts={tracksWithPlayCounts}
      avatarUrl={avatarUrl}
      bannerUrl={bannerUrl}
      storedLocality={storedLocality}
      promoters={promotersWithImages}
      events={events}
    />
  );
}
