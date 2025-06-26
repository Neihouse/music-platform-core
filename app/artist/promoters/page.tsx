import { createClient } from "@/utils/supabase/server";
import { getArtist, getPromotersByArtistLocalities } from "@/db/queries/artists";
import { getPromotersByLocality, getAllPromoters } from "@/db/queries/promoters";
import { getPromoterImagesServer } from "@/lib/images/image-utils";
import { redirect } from "next/navigation";
import ArtistPromotersClient from "@/components/artist/ArtistPromotersClient";

export default async function ArtistPromotersPage() {
  const supabase = await createClient();
  
  // Get current user and verify they are an artist
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const artist = await getArtist(supabase);
  if (!artist) {
    redirect("/artist");
  }

  // Get promoters in the same locality as the artist (original logic)
  const localityId = artist?.storedLocality?.locality?.id;
  const localPromoters = localityId ? await getPromotersByLocality(
    supabase, 
    localityId, 
    undefined, 
    undefined
  ) : [];

  // Get all promoters as fallback for locality-based search
  const allPromoters = localPromoters.length === 0 ? await getAllPromoters(supabase) : [];
  const promotersToDisplay = localPromoters.length > 0 ? localPromoters : allPromoters;

  // Get promoters from shared localities with the artist (new logic)
  const artistLocalityPromoters = await getPromotersByArtistLocalities(supabase, artist.id);

  const localityName = artist?.storedLocality?.locality?.name;

  // Fetch avatar URLs for locality-based promoters
  const localityPromotersWithAvatars = await Promise.all(
    promotersToDisplay.map(async (promoter: any) => {
      const { avatarUrl } = promoter.id ? await getPromoterImagesServer(supabase, promoter.id) : { avatarUrl: null };
      return {
        id: promoter.id,
        name: promoter.name,
        bio: promoter.bio,
        avatar_img: promoter.avatar_img,
        avatarUrl,
        localities: promoter.promoters_localities?.[0]?.localities,
        administrative_areas: promoter.administrative_areas,
        countries: promoter.countries,
      };
    })
  );

  // Fetch avatar URLs for artist locality promoters
  const artistLocalityPromotersWithAvatars = await Promise.all(
    artistLocalityPromoters.map(async (promoter: any) => {
      const { avatarUrl } = promoter.id ? await getPromoterImagesServer(supabase, promoter.id) : { avatarUrl: null };
      return {
        id: promoter.id,
        name: promoter.name,
        bio: promoter.bio,
        avatar_img: promoter.avatar_img,
        avatarUrl,
        localities: promoter.localities,
        administrative_areas: promoter.administrative_areas,
        countries: promoter.countries,
        storedLocality: promoter.storedLocality,
      };
    })
  );

  return (
    <ArtistPromotersClient
      localityPromoters={localityPromotersWithAvatars}
      artistLocalityPromoters={artistLocalityPromotersWithAvatars}
      localityName={localityName}
    />
  );
}
