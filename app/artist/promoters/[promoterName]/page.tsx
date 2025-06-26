import { getPromoterByName } from "@/db/queries/promoters";
import { getUser } from "@/db/queries/users";
import { getPromoterImagesServer } from "@/lib/images/image-utils";
import { createClient } from "@/utils/supabase/server";
import { notFound } from "next/navigation";
import { urlToName } from "@/lib/utils";
import { PromoterProfileContent } from "@/components/artist/PromoterProfileContent";

interface PromoterNamePageProps {
  params: Promise<{ promoterName: string }>;
}

export default async function PromoterPage({ params }: PromoterNamePageProps) {
  try {
    const { promoterName } = await params;
    const decodedPromoterName = urlToName(promoterName);
    const supabase = await createClient();
    
    // Get user and promoter data in parallel
    const [user, promoter] = await Promise.all([
      getUser(supabase),
      getPromoterByName(supabase, decodedPromoterName)
    ]);

    if (!promoter) {
      notFound();
    }

    // Get dynamic image URLs
    const { avatarUrl, bannerUrl } = promoter.id 
      ? await getPromoterImagesServer(supabase, promoter.id) 
      : { avatarUrl: null, bannerUrl: null };

    return (
      <PromoterProfileContent
        promoter={{
          ...promoter,
          avatarUrl,
          bannerUrl,
        }}
      />
    );
  } catch (error) {
    console.error('Error loading promoter page:', error);
    notFound();
  }
}
