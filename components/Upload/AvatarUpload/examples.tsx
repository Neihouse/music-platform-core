/**
 * Example usage of the decoupled AvatarUpload component for different entities
 */

import * as React from "react";
import { AvatarUpload, AvatarUploadConfig } from "@/components/Upload/AvatarUpload";
import { ArtistAvatarUpload } from "@/components/Upload/ArtistArtUpload/ArtistAvatarUpload";
import { createClient } from "@/utils/supabase/client";

// Example 1: Using the direct ArtistAvatarUpload wrapper
export function ArtistProfileEdit({ artistId }: { artistId: string }) {
  return (
    <div>
      <h2>Edit Artist Profile</h2>
      <ArtistAvatarUpload
        artistId={artistId}
        onAvatarUploaded={(url) => {
          console.log("Artist avatar uploaded:", url);
        }}
      />
    </div>
  );
}

// Example 2: Using the generic AvatarUpload for a custom entity (e.g., Promoter)
const promoterAvatarConfig: AvatarUploadConfig = {
  storageBucket: "avatars",
  storageFolder: "",
  title: "Profile Picture",
  description: "Upload a profile picture for your promoter account",
  avatarSize: 120,
  maxFileSize: 1 * 1024 * 1024, // 1MB
};

// These functions would work if the promoter table had an avatar_img field
async function fetchPromoterAvatar(promoterId: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data: promoter, error } = await supabase
    .from("promoters")
    .select("avatar_img")
    .eq("id", promoterId)
    .single();

  if (error) {
    console.error("Error fetching promoter avatar:", error);
    return null;
  }

  return promoter?.avatar_img || null;
}

async function updatePromoterAvatar(promoterId: string, filename: string | null): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("promoters")
    .update({ avatar_img: filename })
    .eq("id", promoterId);

  if (error) {
    throw new Error(`Failed to update promoter avatar: ${error.message}`);
  }
}

export function PromoterProfileEdit({ promoterId }: { promoterId: string }) {
  return (
    <div>
      <h2>Edit Promoter Profile</h2>
      <AvatarUpload
        entityId={promoterId}
        config={promoterAvatarConfig}
        fetchExistingAvatar={fetchPromoterAvatar}
        updateEntityAvatar={updatePromoterAvatar}
        onAvatarUploaded={(url) => {
          console.log("Promoter avatar uploaded:", url);
        }}
      />
    </div>
  );
}

// Example 3: Using the generic AvatarUpload for venues
// Note: This example assumes the venue table has an avatar_img field (not currently in schema)
const venueAvatarConfig: AvatarUploadConfig = {
  storageBucket: "avatars",
  storageFolder: "",
  title: "Venue Logo",
  description: "Upload a logo or profile picture for your venue",
  avatarSize: 150,
  maxFileSize: 3 * 1024 * 1024, // 3MB
};

// These functions would work if the venue table had an avatar_img field
async function fetchVenueAvatar(venueId: string): Promise<string | null> {
  // const supabase = await createClient();
  // 
  // const { data: venue, error } = await supabase
  //   .from("venues")
  //   .select("avatar_img")
  //   .eq("id", venueId)
  //   .single();
  //
  // if (error) {
  //   console.error("Error fetching venue avatar:", error);
  //   return null;
  // }
  //
  // return venue?.avatar_img || null;
  
  console.log("Fetching venue avatar for:", venueId);
  return null; // Placeholder implementation
}

async function updateVenueAvatar(venueId: string, filename: string | null): Promise<void> {
  // const supabase = await createClient();
  // 
  // const { error } = await supabase
  //   .from("venues")
  //   .update({ avatar_img: filename })
  //   .eq("id", venueId);
  //
  // if (error) {
  //   throw new Error(`Failed to update venue avatar: ${error.message}`);
  // }
  
  console.log("Updating venue avatar for:", venueId, "with filename:", filename);
  // Placeholder implementation
}

export function VenueProfileEdit({ venueId }: { venueId: string }) {
  return (
    <div>
      <h2>Edit Venue Profile</h2>
      <AvatarUpload
        entityId={venueId}
        config={venueAvatarConfig}
        fetchExistingAvatar={fetchVenueAvatar}
        updateEntityAvatar={updateVenueAvatar}
        onAvatarUploaded={(url) => {
          console.log("Venue avatar uploaded:", url);
        }}
      />
    </div>
  );
}

// Example 4: Create mode (no entityId) - for forms before entity is created
export function ArtistCreateForm() {
  const [avatarUrl, setAvatarUrl] = React.useState("");

  const handleSubmit = async (formData: any) => {
    // When creating the artist, you can include the avatarUrl
    // The component will handle the temporary preview
    console.log("Creating artist with avatar:", avatarUrl);
  };

  return (
    <form onSubmit={handleSubmit}>
      <h2>Create Artist Profile</h2>
      
      {/* Other form fields */}
      <input type="text" placeholder="Artist Name" />
      
      {/* Avatar upload without entityId - shows preview only */}
      <ArtistAvatarUpload
        onAvatarUploaded={setAvatarUrl}
      />
      
      <button type="submit">Create Artist</button>
    </form>
  );
}

// Example 5: Different avatar sizes
const smallAvatarConfig: AvatarUploadConfig = {
  storageBucket: "avatars",
  storageFolder: "",
  title: "Thumbnail",
  description: "Upload a small thumbnail image",
  avatarSize: 80,
  maxFileSize: 512 * 1024, // 512KB
};

const largeAvatarConfig: AvatarUploadConfig = {
  storageBucket: "avatars",
  storageFolder: "",
  title: "High Resolution Profile Picture",
  description: "Upload a high resolution profile picture",
  avatarSize: 250,
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

export function CustomSizedAvatars() {
  return (
    <div style={{ display: "flex", gap: "1rem" }}>
      <AvatarUpload
        config={smallAvatarConfig}
        onAvatarUploaded={(url) => console.log("Small avatar:", url)}
      />
      
      <AvatarUpload
        config={largeAvatarConfig}
        onAvatarUploaded={(url) => console.log("Large avatar:", url)}
      />
    </div>
  );
}
