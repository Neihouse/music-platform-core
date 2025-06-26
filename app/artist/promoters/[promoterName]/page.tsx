import { getPromoterByName, getPromoterEvents, getPromoterArtists } from "@/db/queries/promoters";
import { getUser } from "@/db/queries/users";
import { getPromoterImagesServer } from "@/lib/images/image-utils";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { urlToName } from "@/lib/utils";
import { PromoterProfileContent } from "@/components/artist/PromoterProfileContent";

interface PromoterPageProps {
  params: Promise<{ promoterName: string }>;
}

const PromoterPage = async ({ params }: PromoterPageProps) => {
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
    <PromoterProfileContent
      promoter={{
        ...promoter,
        avatarUrl,
        bannerUrl,
      }}
    />
  );
};

export default PromoterPage;
