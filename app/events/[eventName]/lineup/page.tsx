import { TimeBasedLineupPlanner } from "@/components/events/TimeBasedLineupPlanner";
import { getEventByName } from "@/db/queries/events";
import { createClient } from "@/utils/supabase/server";
import { urlToName } from "@/lib/utils";
import { notFound } from "next/navigation";

interface LineupPlannerPageProps {
  params: Promise<{
    eventName: string;
  }>;
}

export default async function LineupPlannerPage({ params }: LineupPlannerPageProps) {
  try {
    const eventName = urlToName((await params).eventName);
    const event = await getEventByName(eventName);
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
      <TimeBasedLineupPlanner 
        event={event} 
        availableArtists={artists || []} 
        availableVenues={venues || []}
      />
    );
  } catch (error) {
    notFound();
  }
}
