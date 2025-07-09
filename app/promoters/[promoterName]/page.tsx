import PromoterProfileContent from "@/components/PromoterProfileContent";
import { getPromoterLocalities } from "@/db/queries/promoter_localities";
import { getPromoterArtists, getPromoterByName, getPromoterEvents, getPromoterPastEvents } from "@/db/queries/promoters";
import { getPromoterPopularTracks } from "@/db/queries/tracks";
import { getUser } from "@/db/queries/users";
import { getArtistImagesServer, getPromoterImagesServer } from "@/lib/images/image-utils";
import { urlToName } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface PromoterPageProps {
  params: Promise<{ promoterName: string }>;
}

export default async function PromoterPage({ params }: PromoterPageProps) {
  try {
    const { promoterName } = await params;
    const supabase = await createClient();

    // Get current user and promoter data
    const [user, promoter] = await Promise.all([
      getUser(supabase),
      getPromoterByName(supabase, urlToName(promoterName))
    ]);

    if (!promoter) {
      notFound();
    }

    // Fetch all related data in parallel
    const [
      upcomingEvents,
      pastEvents,
      artists,
      popularTracks,
      promoterLocalities,
      { avatarUrl, bannerUrl }
    ] = await Promise.all([
      getPromoterEvents(supabase, promoter.id),
      getPromoterPastEvents(supabase, promoter.id),
      getPromoterArtists(supabase, promoter.id),
      getPromoterPopularTracks(supabase, promoter.id),
      getPromoterLocalities(supabase, promoter.id),
      getPromoterImagesServer(supabase, promoter.id)
    ]);

    // Add avatar URLs to artists
    const artistsWithAvatars = await Promise.all(
      artists.map(async (artist: any) => {
        const { avatarUrl, bannerUrl } = await getArtistImagesServer(supabase, artist.id);
        return {
          ...artist,
          avatarUrl,
          bannerUrl,
        };
      })
    );

    return (
      <PromoterProfileContent
        promoter={promoter}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        artists={artistsWithAvatars}
        popularTracks={popularTracks}
        currentUser={user}
        promoterLocalities={promoterLocalities}
        avatarUrl={avatarUrl}
        bannerUrl={bannerUrl}
      />
    );
  } catch (error) {
    console.error("Error loading promoter page:", error);
    notFound();
  }
}


