"use server";
import { TypedClient } from "@/utils/supabase/global.types";
import { getUser } from "./users";

export async function getUserEntities(supabase: TypedClient) {
  const user = await getUser(supabase);
  if (!user) {
    throw new Error("User not authenticated");
  }

  // TODO: Create a Supabase View to get all user entities in one query
  const [artistResult, promoterResult, venueResult, fanResult] =
    await Promise.allSettled([
      // Get artist if exists, returns null if not found
      supabase
        .from("artists")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),

      // Get promoter if exists
      supabase
        .from("promoters")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),

      // Get venue if exists
      supabase
        .from("venues")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),

      // Get fan if exists
      supabase
        .from("fans")
        .select("*")
        .eq("user_id", user.id)
        .maybeSingle(),
    ]);

  // Extract data or set to null if rejected
  const artist =
    artistResult.status === "fulfilled" ? artistResult.value.data : null;
  const promoter =
    promoterResult.status === "fulfilled" ? promoterResult.value.data : null;
  const venue =
    venueResult.status === "fulfilled" ? venueResult.value.data : null;
  const fan = fanResult.status === "fulfilled" ? fanResult.value.data : null;

  return {
    artist,
    promoter,
    venue,
    fan,
    // Always consider the user a fan even if the fans table entry doesn't exist
    isFan: true,
  };
}
