import { getArtistByName } from "@/db/queries/artists";
import { getPromoter } from "@/db/queries/promoters";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { urlToName } from "@/lib/utils";
import InviteArtistModal from "@/components/promoter/InviteArtistModal";

interface InviteArtistModalPageProps {
  params: Promise<{ artistName: string }>;
}

const InviteArtistModalPage = async ({ params }: InviteArtistModalPageProps) => {
  const { artistName } = await params;
  const decodedArtistName = urlToName(artistName);
  const supabase = await createClient();
  
  // Get current user and verify they are a promoter
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const promoter = await getPromoter(supabase);
  if (!promoter) {
    redirect("/promoter");
  }

  const artist = await getArtistByName(supabase, decodedArtistName);
  if (!artist) {
    notFound();
  }

  return (
    <InviteArtistModal
      artist={artist}
      promoter={promoter}
    />
  );
};

export default InviteArtistModalPage;
