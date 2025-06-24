# Generic Banner Upload Component

This document describes the decoupled banner upload system that allows uploading banner images for different entity types (Artists, Promoters, Venues, etc.) with entity-specific configuration.

## Overview

The system consists of:

1. **`BannerUpload`** - A generic, reusable banner upload component
2. **Entity-specific wrappers** - Like `PromoterBannerUpload`, `ArtistBannerUpload`
3. **Configuration system** - To customize storage, titles, and behavior

## Core Components

### `BannerUpload` (Generic Component)

Located at: `/components/Upload/BannerUpload/index.tsx`

This is the main generic component that handles:
- File drag & drop
- Image upload to Supabase storage
- Image deletion
- UI for upload/preview/delete states
- Error handling and notifications

#### Props

```typescript
interface IBannerUploadProps {
  entityId?: string;
  config: BannerUploadConfig;
  fetchExistingBanner?: (entityId: string) => Promise<string | null>;
  updateEntityBanner?: (entityId: string, filename: string | null) => Promise<void>;
  onBannerUploaded?: (url: string) => void;
}

interface BannerUploadConfig {
  storageBucket: string;     // e.g., "images"
  storageFolder: string;     // e.g., "banners"
  title: string;             // e.g., "Banner Image"
  description: string;       // e.g., "Upload a banner image for your profile"
}
```

### Entity-Specific Wrappers

#### `PromoterBannerUpload`

Located at: `/components/Upload/PromoterBannerUpload/index.tsx`

A wrapper specifically for promoter banner uploads that:
- Provides promoter-specific configuration
- Implements `fetchPromoterBanner()` function
- Implements `updatePromoterBanner()` function
- Works with the `promoters` table `banner_img` field

```typescript
// Usage
<PromoterBannerUpload
  promoterId="some-promoter-id"
  onBannerUploaded={(url) => console.log("Uploaded:", url)}
/>
```

#### `ArtistBannerUpload` (Updated)

Located at: `/components/Upload/ArtistArtUpload/ArtistBannerUpload.tsx`

Previously a standalone component, now refactored to use the generic `BannerUpload` internally.

```typescript
// Usage (unchanged from before)
<ArtistBannerUpload
  artistId="some-artist-id"
  onBannerUploaded={(url) => console.log("Uploaded:", url)}
/>
```

## Creating a New Entity Banner Upload

To create a banner upload for a new entity type (e.g., Venue), follow this pattern:

### 1. Create the wrapper component

```typescript
// /components/Upload/VenueBannerUpload/index.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { BannerUpload, BannerUploadConfig } from "../BannerUpload";

export interface IVenueBannerUploadProps {
  venueId?: string;
  onBannerUploaded?: (url: string) => void;
}

const venueBannerConfig: BannerUploadConfig = {
  storageBucket: "images",
  storageFolder: "venue-banners", // or just "banners" to share with other entities
  title: "Venue Banner",
  description: "Upload a banner image for your venue",
};

async function fetchVenueBanner(venueId: string): Promise<string | null> {
  const supabase = await createClient();
  
  const { data: venue, error } = await supabase
    .from("venues")
    .select("banner_img")
    .eq("id", venueId)
    .single();

  if (error) {
    console.error("Error fetching venue banner:", error);
    return null;
  }

  return venue?.banner_img || null;
}

async function updateVenueBanner(venueId: string, filename: string | null): Promise<void> {
  const supabase = await createClient();
  
  const { error } = await supabase
    .from("venues")
    .update({ banner_img: filename })
    .eq("id", venueId);

  if (error) {
    throw new Error(`Failed to update venue banner: ${error.message}`);
  }
}

export function VenueBannerUpload({
  venueId,
  onBannerUploaded,
}: IVenueBannerUploadProps) {
  return (
    <BannerUpload
      entityId={venueId}
      config={venueBannerConfig}
      fetchExistingBanner={fetchVenueBanner}
      updateEntityBanner={updateVenueBanner}
      onBannerUploaded={onBannerUploaded}
    />
  );
}
```

### 2. Ensure database schema support

Make sure your entity table has a `banner_img` field:

```sql
-- Example for venues table
ALTER TABLE venues ADD COLUMN banner_img TEXT;
```

### 3. Use the component

```typescript
import { VenueBannerUpload } from "@/components/Upload/VenueBannerUpload";

function VenueEditPage({ venueId }: { venueId: string }) {
  return (
    <div>
      <h1>Edit Venue</h1>
      <VenueBannerUpload
        venueId={venueId}
        onBannerUploaded={(url) => {
          console.log("Venue banner uploaded:", url);
          // Optionally refresh page data, show success message, etc.
        }}
      />
    </div>
  );
}
```

## Direct Usage of Generic Component

You can also use the generic `BannerUpload` component directly without creating a wrapper:

```typescript
import { BannerUpload, BannerUploadConfig } from "@/components/Upload/BannerUpload";

const customConfig: BannerUploadConfig = {
  storageBucket: "images",
  storageFolder: "custom-banners",
  title: "Custom Banner",
  description: "Upload your custom banner",
};

function CustomEntityEdit({ entityId }: { entityId: string }) {
  return (
    <BannerUpload
      entityId={entityId}
      config={customConfig}
      fetchExistingBanner={async (id) => {
        // Your custom fetch logic
        return "existing-filename.jpg";
      }}
      updateEntityBanner={async (id, filename) => {
        // Your custom update logic
        console.log("Update", id, "with", filename);
      }}
      onBannerUploaded={(url) => console.log("Uploaded:", url)}
    />
  );
}
```

## Key Benefits

1. **Reusability**: One generic component serves all entity types
2. **Type Safety**: Proper TypeScript interfaces and error handling
3. **Consistency**: Same UI/UX across all banner uploads
4. **Maintainability**: Core logic is centralized
5. **Flexibility**: Easy to customize per entity type
6. **Separation of Concerns**: UI logic is separate from entity-specific database operations

## Storage Structure

The system uses Supabase storage with this structure:

```
bucket: "images"
├── banners/
│   ├── artist-banner-uuid1.jpg
│   ├── promoter-banner-uuid2.png
│   └── ...
└── venue-banners/  (if using separate folder)
    ├── venue-banner-uuid1.jpg
    └── ...
```

## Database Schema Requirements

Each entity that supports banner uploads should have:

```sql
-- Example for any entity table
CREATE TABLE your_entities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- ... other fields ...
  banner_img TEXT, -- Stores the filename (UUID) of the banner image
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

The `banner_img` field stores just the filename (UUID), not the full URL. The component constructs the full URL using Supabase storage's `getPublicUrl()` method.
