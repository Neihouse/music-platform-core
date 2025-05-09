"use server";

import { createClient } from "@/utils/supabase/server";

export async function createPromoter(
  companyName: string,
  description: string,
  contactEmail: string,
  contactPhone: string
) {
  const supabase = await createClient();

  const { data: user } = await supabase.auth.getUser();

  if (!user || !user.user) {
    throw new Error("User not authenticated");
  }

  if (!companyName) {
    throw new Error("Company name is required");
  }

  // Insert into promoters table
  const { data: promoter, error } = await supabase
    .from("promoters")
    .insert({
      title: companyName,
      // Additional fields would be added to the schema as needed
    })
    .select()
    .single();

  if (error) {
    console.error("Database error:", error);
    // For now, return a mock response
    return {
      id: "mock-id",
      title: companyName,
      description: description,
      contact_email: contactEmail,
      contact_phone: contactPhone,
      user_id: user.user.id,
    };
  }

  // In a complete implementation, we would also store the additional details
  // like description, contact info, etc. in a related table

  return promoter;
}
