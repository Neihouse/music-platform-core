import { getPromoterByName, getPromoterEvents, getPromoterArtists } from "@/db/queries/promoters";
import { getPromoterPopularTracks } from "@/db/queries/tracks";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { PromoterDetailView } from "@/components/PromoterDetail/PromoterDetailView";
import { urlToName } from "@/lib/utils";

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
      promoterLocalities
    ] = await Promise.all([
      getPromoterEvents(supabase, promoter.id),
      getPromoterPastEvents(supabase, promoter.id),
      getPromoterArtists(supabase, promoter.id),
      getPromoterPopularTracks(supabase, promoter.id),
      getPromoterLocalities(supabase, promoter.id)
    ]);

    // Get image URLs
    const avatarUrl = promoter.avatar_img 
      ? supabase.storage.from("images").getPublicUrl(`avatars/${promoter.avatar_img}`).data.publicUrl 
      : null;
    const bannerUrl = promoter.banner_img 
      ? supabase.storage.from("images").getPublicUrl(`banners/${promoter.banner_img}`).data.publicUrl 
      : null;

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

// Helper function to get past events
async function getPromoterPastEvents(supabase: any, promoterId: string) {
  const { data: eventPromotions, error } = await supabase
    .from("events_promoters")
    .select(`
      events (
        *,
        venues (
          id,
          name,
          address
        )
      )
    `)
    .eq("promoter", promoterId);

  if (error) {
    console.error("Error fetching past events:", error);
    return [];
  }

  // Extract events from the junction table results and filter for past events
  const events = eventPromotions
    ?.map((ep: any) => ep.events)
    .filter(Boolean)
    .filter((event: any) => event.date && new Date(event.date) < new Date())
    .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
    .slice(0, 6) || [];

  return events;
}

// Helper function to get promoter localities
async function getPromoterLocalities(supabase: any, promoterId: string) {
  const { data, error } = await supabase
    .from("promoters_localities")
    .select(`
      *,
      localities (
        *,
        administrative_areas (
          *,
          countries (*)
        )
      )
    `)
    .eq("promoter_id", promoterId);

  if (error) {
    console.error("Error fetching promoter localities:", error);
    return [];
  }

  return data || [];
}
