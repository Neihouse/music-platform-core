"use server";

import { updatePromoter } from "@/db/queries/promoters";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { nameToUrl } from "@/lib/utils";

export interface UpdatePromoterData {
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
}

export async function updatePromoterAction(
  promoterId: string,
  data: UpdatePromoterData
) {
  try {
    const supabase = await createClient();
    
    const updatedPromoter = await updatePromoter(supabase, promoterId, {
      name: data.name,
      bio: data.bio || null,
      email: data.email || null,
      phone: data.phone || null,
    });

    // Revalidate the promoter page to show updated data
    revalidatePath(`/promoters/${nameToUrl(updatedPromoter.name)}`);
    
    return { success: true, promoter: updatedPromoter };
  } catch (error: any) {
    console.error("Error updating promoter:", error);
    return { 
      success: false, 
      error: error?.message || "Failed to update promoter" 
    };
  }
}
