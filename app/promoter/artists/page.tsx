import { createClient } from "@/utils/supabase/server";
import { getPromoter, getArtistsByPromoterLocalities } from "@/db/queries/promoters";
import { getArtistsByLocality, getAllArtists } from "@/db/queries/artists";
import { getArtistImagesServer } from "@/lib/images/image-utils";
import { redirect } from "next/navigation";
import PromoterArtistsClient from "@/components/promoter/PromoterArtistsClient";

export default async function PromoterArtistsPage() {
  const supabase = await createClient();
  
  // Get current user and verify they are a promoter
  const { data: { user } } = await supabase.auth.getUser();
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

  return (
    <PromoterArtistsClient
      localityArtists={localityArtistsWithAvatars}
      promoterLocalityArtists={promoterLocalityArtistsWithAvatars}
      localityName={localityName}
    />
  );
}
