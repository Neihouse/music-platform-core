import { getPromoterByName } from "@/db/queries/promoters";
import { getUser } from "@/db/queries/users";
import { getPromoterImagesServer } from "@/lib/images/image-utils";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { urlToName } from "@/lib/utils";
import PromoterProfileContent from "@/components/PromoterProfileContent";
import ArtistModal from "@/components/ArtistModal";

interface PromoterModalPageProps {
  params: Promise<{ promoterName: string }>;
}

const PromoterModalPage = async ({ params }: PromoterModalPageProps) => {
  const { promoterName } = await params;
  const decodedPromoterName = urlToName(promoterName);
  const supabase = await createClient();
  const user = await getUser(supabase);
  const promoter = await getPromoterByName(supabase, decodedPromoterName);

  if (!promoter) {
    notFound();
  }

  // Get dynamic image URLs
  const { avatarUrl, bannerUrl } = promoter.id ? await getPromoterImagesServer(supabase, promoter.id) : { avatarUrl: null, bannerUrl: null };

  return (
    <ArtistModal>
      <PromoterProfileContent
        promoter={promoter}
        currentUser={user}
        avatarUrl={avatarUrl}
        bannerUrl={bannerUrl}
      />
    </ArtistModal>
  );
};

export default PromoterModalPage;
