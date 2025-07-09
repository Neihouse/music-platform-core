import { VenueEditForm } from "@/components/VenueEdit/VenueEditForm";
import { getUser } from "@/db/queries/users";
import { getVenueByName } from "@/db/queries/venues";
import { nameToUrl, urlToName } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";

interface VenueEditPageProps {
  params: Promise<{
    venueName: string;
  }>;
}

export default async function VenueEditPage({ params }: VenueEditPageProps) {
  const { venueName } = await params;
  const decodedVenueName = urlToName(venueName);

  const supabase = await createClient();

  try {
    // Get current user and venue details
    const [user, venue] = await Promise.all([
      getUser(supabase),
      getVenueByName(supabase, decodedVenueName)
    ]);

    if (!venue) {
      notFound();
    }

    // Check if current user is the venue owner
    if (!user || user.id !== venue.user_id) {
      redirect(`/venues/${nameToUrl(venue.name)}`);
    }

    return (
      <VenueEditForm venue={venue} />
    );
  } catch (error) {
    console.error("Error loading venue for editing:", error);
    notFound();
  }
}



