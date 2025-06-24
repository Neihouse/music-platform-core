import { notFound } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getVenueByName } from "@/db/queries/venues";
import { VenueDetailView } from "@/components/VenueDetail/VenueDetailView";
import { urlToName } from "@/lib/utils";
import {
  getVenueEvents,
  getVenuePromoters,
  getVenueGallery,
} from "./actions";

interface VenuePageProps {
  params: Promise<{
    venueName: string;
  }>;
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { venueName } = await params;
  const decodedVenueName = urlToName(venueName);
  
  const supabase = await createClient();
  
  try {
    // Get current user and venue details
    const [{ data: userData }, venue] = await Promise.all([
      supabase.auth.getUser(),
      getVenueByName(supabase, decodedVenueName)
    ]);
    
    if (!venue) {
      notFound();
    }

    // Get related data in parallel
    const [upcomingEvents, pastEvents, promoters, gallery] = await Promise.all([
      getVenueEvents(venue.id, "upcoming"),
      getVenueEvents(venue.id, "past"),
      getVenuePromoters(venue.id),
      getVenueGallery(venue.id),
    ]);

    // Check if current user is the venue owner
    const isOwner = userData?.user?.id === venue.user_id;

    return (
      <VenueDetailView
        venue={venue}
        upcomingEvents={upcomingEvents}
        pastEvents={pastEvents}
        promoters={promoters}
        gallery={gallery}
        isOwner={isOwner}
      />
    );
  } catch (error) {
    console.error("Error loading venue:", error);
    notFound();
  }
}
