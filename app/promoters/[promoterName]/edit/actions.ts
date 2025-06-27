"use server";

import { updatePromoter } from "@/db/queries/promoters";
import { getPromoterLocalities, updatePromoterLocalities } from "@/db/queries/promoter_localities";
import { createClient } from "@/utils/supabase/server";
import { revalidatePath } from "next/cache";
import { nameToUrl } from "@/lib/utils";

export interface UpdatePromoterData {
  name: string;
  bio?: string;
  email?: string;
  phone?: string;
  fontFamily?: string;
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
      selectedFont: data.fontFamily || null,
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

export async function getPromoterLocalitiesAction(promoterId: string) {
  try {
    const supabase = await createClient();
    const localities = await getPromoterLocalities(supabase, promoterId);
    
    return { success: true, data: localities };
  } catch (error: any) {
    console.error("Error fetching promoter localities:", error);
    return { success: false, error: error.message };
  }
}

export async function updatePromoterLocalitiesAction(
  promoterId: string,
  localityIds: string[]
) {
  try {
    const supabase = await createClient();
    await updatePromoterLocalities(supabase, promoterId, localityIds);
    
    return { success: true };
  } catch (error: any) {
    console.error("Error updating promoter localities:", error);
    return { success: false, error: error.message };
  }
}
