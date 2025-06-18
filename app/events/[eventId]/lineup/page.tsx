import { EventLineupPlanner } from "@/components/events/EventLineupPlanner";
import { getEventById } from "@/db/queries/events";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface LineupPlannerPageProps {
  params: Promise<{
    eventId: string;
  }>;
}

export default async function LineupPlannerPage({ params }: LineupPlannerPageProps) {
  try {
    const event = await getEventById((await params).eventId);
    const supabase = await createClient();
    
    // Fetch available artists for the lineup
    const { data: artists } = await supabase
      .from("artists")
      .select("id, name, avatar_img")
      .order("name");

    // Fetch available venues
    const { data: venues } = await supabase
      .from("venues")
      .select("id, name, address, capacity")
      .order("name");

    return (
      <EventLineupPlanner 
        event={event} 
        availableArtists={artists || []} 
        availableVenues={venues || []}
      />
    );
  } catch (error) {
    notFound();
  }
}
