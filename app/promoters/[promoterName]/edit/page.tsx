import { PromoterEditForm } from "@/components/PromoterDetail/PromoterEditForm";
import { getPromoterByName } from "@/db/queries/promoters";
import { getUser } from "@/db/queries/users";
import { urlToName } from "@/lib/utils";
import { createClient } from "@/utils/supabase/server";
import { notFound, redirect } from "next/navigation";

interface PromoterEditPageProps {
  params: Promise<{ promoterName: string }>;
}

export default async function PromoterEditPage({ params }: PromoterEditPageProps) {
  try {
    const { promoterName } = await params;
    const supabase = await createClient();

    // Get current user and promoter data
    const [user, promoter] = await Promise.all([
      getUser(supabase),
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
