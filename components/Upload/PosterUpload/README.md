# Generic Poster Upload Component

This is a generic, reusable poster upload component that can be used for any entity type that needs poster image uploads.

## Overview

The system consists of:

1. **`PosterUpload`** - A generic, reusable poster upload component
2. **Entity-specific wrappers** - Like `EventPosterUpload`
3. **Configuration system** - To customize storage, titles, and behavior

## Usage

### 1. Direct usage (for existing Event entities)

```tsx
import { EventPosterUpload } from "@/components/Upload";

function EventEditPage({ eventId }: { eventId: string }) {
  return (
    <div>
      <h1>Edit Event</h1>
      <EventPosterUpload
        eventId={eventId}
        onPosterUploaded={(url) => {
          console.log("Event poster uploaded:", url);
          // Optionally refresh page data, show success message, etc.
        }}
      />
    </div>
  );
}
```

### 2. Create mode (no entity ID)

```tsx
// For forms before entity creation
<EventPosterUpload
  onPosterUploaded={(url) => setPreviewUrl(url)}
/>
```

### 3. Using the generic component for custom configurations

```tsx
import { PosterUpload, PosterUploadConfig } from "@/components/Upload";

const customPosterConfig: PosterUploadConfig = {
  storageBucket: "custom-bucket",
  storageFolder: "custom-posters",
  title: "Custom Poster",
  description: "Upload a custom poster image",
  maxFileSize: 15 * 1024 * 1024, // 15MB
};

<PosterUpload
  entityId={customEntityId}
  config={customPosterConfig}
  fetchExistingPoster={fetchCustomPoster}
  updateEntityPoster={updateCustomPoster}
  onPosterUploaded={handlePosterUpload}
/>
```

## Creating a New Entity Poster Upload

To create a poster upload for a new entity type (e.g., Album), follow this pattern:

### 1. Create the wrapper component

```typescript
// /components/Upload/PosterUpload/AlbumPosterUpload.tsx
"use client";

import { createClient } from "@/utils/supabase/client";
import { PosterUpload, PosterUploadConfig } from "./index";

export interface IAlbumPosterUploadProps {
  albumId?: string;
  onPosterUploaded?: (url: string) => void;
}

const albumPosterConfig: PosterUploadConfig = {
  storageBucket: "posters",
  storageFolder: "albums", // or just "" to share with other entities
  title: "Album Cover",
  description: "Upload a cover image for your album",
  maxFileSize: 10 * 1024 * 1024, // 10MB
};

async function fetchAlbumPoster(albumId: string): Promise<string | null> {
  const supabase = createClient();
  
  const { data: album, error } = await supabase
    .from("albums")
    .select("poster_img")
    .eq("id", albumId)
    .single();

  if (error) {
    console.error("Error fetching album poster:", error);
    return null;
  }

  return album?.poster_img || null;
}

async function updateAlbumPoster(albumId: string, filename: string | null): Promise<void> {
  const supabase = createClient();
  
  const { error } = await supabase
    .from("albums")
    .update({ poster_img: filename })
    .eq("id", albumId);

  if (error) {
    throw new Error(`Failed to update album poster: ${error.message}`);
  }
}

export function AlbumPosterUpload({
  albumId,
  onPosterUploaded,
}: IAlbumPosterUploadProps) {
  return (
    <PosterUpload
      entityId={albumId}
      config={albumPosterConfig}
      fetchExistingPoster={fetchAlbumPoster}
      updateEntityPoster={updateAlbumPoster}
      onPosterUploaded={onPosterUploaded}
    />
  );
}
```

### 2. Ensure database schema support

Make sure your entity table has a `poster_img` field:

```sql
-- Example for albums table
ALTER TABLE albums ADD COLUMN poster_img TEXT;
```

### 3. Use the component

```typescript
import { AlbumPosterUpload } from "@/components/Upload/PosterUpload/AlbumPosterUpload";

function AlbumEditPage({ albumId }: { albumId: string }) {
  return (
    <div>
      <h1>Edit Album</h1>
      <AlbumPosterUpload
        albumId={albumId}
        onPosterUploaded={(url) => {
          console.log("Album poster uploaded:", url);
          // Optionally refresh page data, show success message, etc.
        }}
      />
    </div>
  );
}
```

## Configuration Interface

```typescript
interface PosterUploadConfig {
  storageBucket: string;     // e.g., "posters"
  storageFolder: string;     // e.g., "events" or "" for root
  title: string;             // e.g., "Event Poster"
  description: string;       // e.g., "Upload a poster image for your event"
  maxFileSize?: number;      // Max file size in bytes (default: 10MB)
}
```

## Props Interface

### Generic Component Props

```typescript
interface IPosterUploadProps {
  entityId?: string;
  config: PosterUploadConfig;
  fetchExistingPoster?: (entityId: string) => Promise<string | null>;
  updateEntityPoster?: (entityId: string, filename: string | null) => Promise<void>;
  onPosterUploaded?: (url: string) => void;
}
```

### Entity-Specific Props

```typescript
// Event components
interface IEventPosterUploadProps {
  eventId?: string;
  onPosterUploaded?: (url: string) => void;
}
```

## Key Features

1. **Poster-specific UI**: Designed for poster/cover images with appropriate aspect ratios
2. **Large file support**: Default 10MB limit suitable for high-quality poster images
3. **Preview optimization**: Images are displayed with `object-fit: contain` to preserve aspect ratio
4. **Responsive design**: Adapts to mobile, tablet, and desktop viewports
5. **UUID filenames**: Secure, collision-free file naming
6. **Error handling**: Comprehensive error handling and user feedback
7. **Storage management**: Automatic cleanup of old files when new ones are uploaded

## Key Benefits

1. **Reusability**: One generic component serves all entity types
2. **Type Safety**: Proper TypeScript interfaces and error handling
3. **Consistency**: Same UI/UX across all poster uploads
4. **Maintainability**: Core logic is centralized
5. **Flexibility**: Easy to customize per entity type
6. **Separation of Concerns**: UI logic is separate from entity-specific database operations

## Storage Structure

The system uses Supabase storage with this structure:

```
bucket: "posters"
├── event-poster-uuid1.jpg
├── album-poster-uuid2.png
└── ...

or with folders:
bucket: "posters"
├── events/
│   ├── event-poster-uuid1.jpg
│   └── ...
├── albums/
│   ├── album-poster-uuid2.png
│   └── ...
```

## Differences from Banner and Avatar Uploads

| Feature | PosterUpload | BannerUpload | AvatarUpload |
|---------|--------------|--------------|--------------|
| **Aspect Ratio** | 2:3 (poster) | 16:9 (wide) | 1:1 (square) |
| **Preview Style** | `object-fit: contain` | `object-fit: cover` | Circular crop |
| **Typical Size** | Portrait/Tall | Landscape/Wide | Square |
| **File Size Limit** | 10MB default | 5MB default | 2MB default |
| **Use Cases** | Event posters, album covers | Hero images, banners | Profile pictures |
