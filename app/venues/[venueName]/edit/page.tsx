import { notFound, redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { getVenueByName } from "@/db/queries/venues";
import { VenueEditForm } from "@/components/VenueEdit";

interface VenueEditPageProps {
  params: Promise<{
    venueName: string;
  }>;
}

export default async function VenueEditPage({ params }: VenueEditPageProps) {
  const { venueName } = await params;
  const decodedVenueName = decodeURIComponent(venueName);
  
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

    // Check if current user is the venue owner
    if (!userData?.user || userData.user.id !== venue.user_id) {
      redirect(`/venues/${encodeURIComponent(venue.name)}`);
    }

    return (
      <VenueEditForm venue={venue} />
    );
  } catch (error) {
    console.error("Error loading venue for editing:", error);
    notFound();
  }
}



