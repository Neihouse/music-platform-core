import { getPromoterByName } from "@/db/queries/promoters";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";
import { urlToName } from "@/lib/utils";
import { PromoterEditForm } from "@/components/PromoterDetail/PromoterEditForm";

interface PromoterEditPageProps {
  params: Promise<{ promoterName: string }>;
}

export default async function PromoterEditPage({ params }: PromoterEditPageProps) {
  try {
    const { promoterName } = await params;
    const supabase = await createClient();
    
    // Get current user and promoter data
    const [{ data: { user } }, promoter] = await Promise.all([
      supabase.auth.getUser(),
      getPromoterByName(supabase, urlToName(promoterName))
    ]);
    
    if (!promoter) {
      notFound();
    }

    // Check if user owns this promoter
    if (!user || user.id !== promoter.user_id) {
      redirect(`/promoters/${promoterName}`);
    }

    return <PromoterEditForm promoter={promoter} />;
  } catch (error) {
    console.error("Error loading promoter edit page:", error);
    notFound();
  }
}
