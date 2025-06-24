/**
 * Example usage of the decoupled BannerUpload component for different entities
 */

import { BannerUpload, BannerUploadConfig } from "@/components/Upload/BannerUpload";
import { PromoterBannerUpload } from "@/components/Upload/PromoterBannerUpload";
import { ArtistBannerUpload } from "@/components/Upload/ArtistArtUpload/ArtistBannerUpload";
import { createClient } from "@/utils/supabase/client";

// Example 1: Using the direct PromoterBannerUpload wrapper
export function PromoterProfileEdit({ promoterId }: { promoterId: string }) {
  return (
    <div>
      <h2>Edit Promoter Profile</h2>
      <PromoterBannerUpload
        promoterId={promoterId}
        onBannerUploaded={(url) => {
          console.log("Promoter banner uploaded:", url);
        }}
      />
    </div>
  );
}

// Example 2: Using the generic BannerUpload for a custom entity (e.g., Venue)
// Note: This assumes the venue table has a banner_img field (not currently in schema)
const venueBannerConfig: BannerUploadConfig = {
  storageBucket: "images",
  storageFolder: "venue-banners",
  title: "Venue Banner",
  description: "Upload a banner image for your venue",
};

// These functions would work if the venue table had a banner_img field
async function fetchVenueBanner(venueId: string): Promise<string | null> {
  // const supabase = await createClient();
  // 
  // const { data: venue, error } = await supabase
  //   .from("venues")
  //   .select("banner_img")
  //   .eq("id", venueId)
  //   .single();
  //
  // if (error) {
  //   console.error("Error fetching venue banner:", error);
  //   return null;
  // }
  //
  // return venue?.banner_img || null;
  
  // Placeholder implementation
  console.log("Fetching banner for venue:", venueId);
  return null;
}

async function updateVenueBanner(venueId: string, filename: string | null): Promise<void> {
  // const supabase = await createClient();
  // 
  // const { error } = await supabase
  //   .from("venues")
  //   .update({ banner_img: filename })
  //   .eq("id", venueId);
  //
  // if (error) {
  //   throw new Error(`Failed to update venue banner: ${error.message}`);
  // }
  
  // Placeholder implementation
  console.log("Updating banner for venue:", venueId, "with filename:", filename);
}

export function VenueProfileEdit({ venueId }: { venueId: string }) {
  return (
    <div>
      <h2>Edit Venue Profile</h2>
      <BannerUpload
        entityId={venueId}
        config={venueBannerConfig}
        fetchExistingBanner={fetchVenueBanner}
        updateEntityBanner={updateVenueBanner}
        onBannerUploaded={(url) => {
          console.log("Venue banner uploaded:", url);
        }}
      />
    </div>
  );
}

// Example 3: Using the existing ArtistBannerUpload (which now uses the generic component internally)
export function ArtistProfileEdit({ artistId }: { artistId: string }) {
  return (
    <div>
      <h2>Edit Artist Profile</h2>
      <ArtistBannerUpload
        artistId={artistId}
        onBannerUploaded={(url) => {
          console.log("Artist banner uploaded:", url);
        }}
      />
    </div>
  );
}
