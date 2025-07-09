import { TimeBasedLineupPlanner } from "@/components/events/TimeBasedLineupPlanner";
import { getEventByHash } from "@/db/queries/events";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";

interface LineupPlannerPageProps {
  params: Promise<{
    eventHash: string;
  }>;
}

export default async function LineupPlannerPage({ params }: LineupPlannerPageProps) {
  try {
    const eventHash = (await params).eventHash;
    const supabase = await createClient();
    const event = await getEventByHash(supabase, eventHash);

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
