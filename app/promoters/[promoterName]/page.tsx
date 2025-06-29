import { getPromoterByName, getPromoterEvents, getPromoterArtists, getPromoterPastEvents } from "@/db/queries/promoters";
import { getPromoterPopularTracks } from "@/db/queries/tracks";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { PromoterDetailView } from "@/components/PromoterDetail/PromoterDetailView";
import { urlToName } from "@/lib/utils";
import { getPromoterImagesServer } from "@/lib/images/image-utils";
import { getPromoterLocalities } from "@/db/queries/promoter_localities";

interface PromoterPageProps {
  params: Promise<{ promoterName: string }>;
}

export default async function PromoterPage({ params }: PromoterPageProps) {
  try {
    const { promoterName } = await params;
    const supabase = await createClient();
    
    // Get current user and promoter data
    const [{ data: { user } }, promoter] = await Promise.all([
      supabase.auth.getUser(),
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

    return (
      <PromoterDetailView
        promoter={promoter}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        artists={artists}
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


