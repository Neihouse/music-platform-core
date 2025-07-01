import { createClient } from "@/utils/supabase/server";
import { getPromoterByName } from "@/db/queries/promoters";
import { getPromoterImagesServer } from "@/lib/images/image-utils";
import { notFound } from "next/navigation";
import PromoterProfileContent from "@/components/PromoterProfileContent";
import ArtistModal from "@/components/ArtistModal";

interface PromoterModalPageProps {
  params: Promise<{
    promoterName: string;
  }>;
}

export default async function PromoterModalPage({ params }: PromoterModalPageProps) {
  const supabase = await createClient();
  const promoterName = decodeURIComponent((await params).promoterName);

  try {
    const promoter = await getPromoterByName(supabase, promoterName);
    if (!promoter) {
      notFound();
    }

    const { avatarUrl, bannerUrl } = await getPromoterImagesServer(supabase, promoter.id);

    return (
      <ArtistModal>
        <PromoterProfileContent
          promoter={promoter}
          avatarUrl={avatarUrl}
          bannerUrl={bannerUrl}
        />
      </ArtistModal>
    );
  } catch (error) {
    console.error("Error fetching promoter:", error);
    notFound();
  }
}
