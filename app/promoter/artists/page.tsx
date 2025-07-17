import PromoterArtistsClient from "@/components/promoter/PromoterArtistsClient";
import { getAllArtists, getArtistsByLocality } from "@/db/queries/artists";
import { getArtistsByPromoterLocalities, getPromoter, getPromoterArtists } from "@/db/queries/promoters";
import { getSentRequests } from "@/db/queries/requests";
import { getUser } from "@/db/queries/users";
import { getArtistImagesServer } from "@/lib/images/image-utils";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export default async function PromoterArtistsPage() {
  const supabase = await createClient();

  // Get current user and verify they are a promoter
  const user = await getUser(supabase);
  if (!user) {
    redirect("/login");
  }

  const promoter = await getPromoter(supabase);
  if (!promoter) {
    redirect("/promoter");
  }

  // Get artists in the same locality as the promoter (original logic)
  const localityId = promoter?.promoters_localities?.[0]?.localities?.id;
  const localArtists = await getArtistsByLocality(
    supabase,
    localityId,
    undefined,
    undefined
  );

  // Get all artists as fallback for locality-based search
  const allArtists = localArtists.length === 0 ? await getAllArtists(supabase) : [];
  const artistsToDisplay = localArtists.length > 0 ? localArtists : allArtists;

  // Get artists from shared localities with the promoter (new logic)
  const promoterLocalityArtists = await getArtistsByPromoterLocalities(supabase, promoter.id);

  const localityName = promoter?.promoters_localities?.[0]?.localities?.name;

  // Fetch avatar URLs for locality-based artists
  const localityArtistsWithAvatars = await Promise.all(
    artistsToDisplay.map(async (artist: any) => {
      const { avatarUrl } = artist.id ? await getArtistImagesServer(supabase, artist.id) : { avatarUrl: null };
      return {
        id: artist.id,
        name: artist.name,
        bio: artist.bio,
        avatar_img: artist.avatar_img,
        user_id: artist.user_id,
        avatarUrl,
        localities: artist.localities,
        administrative_areas: artist.administrative_areas,
        countries: artist.countries,
      };
    })
  );

  // Fetch avatar URLs for promoter locality artists
  const promoterLocalityArtistsWithAvatars = await Promise.all(
    promoterLocalityArtists.map(async (artist: any) => {
      const { avatarUrl } = artist.id ? await getArtistImagesServer(supabase, artist.id) : { avatarUrl: null };
      return {
        id: artist.id,
        name: artist.name,
        bio: artist.bio,
        avatar_img: artist.avatar_img,
        user_id: artist.user_id,
        avatarUrl,
        localities: artist.localities,
        administrative_areas: artist.administrative_areas,
        countries: artist.countries,
        storedLocality: artist.storedLocality,
      };
    })
  );

  // Get pending requests sent by this promoter
  const sentRequests = await getSentRequests(supabase, user.id);
  const pendingRequests = sentRequests.filter(request => request.status === "pending");

  // Get artists already in the collective
  const collectiveArtists = await getPromoterArtists(supabase, promoter.id);

  return (
    <PromoterArtistsClient
      localityArtists={localityArtistsWithAvatars}
      promoterLocalityArtists={promoterLocalityArtistsWithAvatars}
      localityName={localityName}
      pendingRequests={pendingRequests}
      collectiveArtists={collectiveArtists}
    />
  );
}
