# Generic Avatar Upload Component

This document describes the decoupled avatar upload system that allows uploading avatar images for different entity types (Artists, Promoters, Venues, etc.) with entity-specific configuration.

## Overview

The system consists of:

1. **`AvatarUpload`** - A generic, reusable avatar upload component
2. **Entity-specific wrappers** - Like `ArtistAvatarUpload`, `PromoterAvatarUpload`
3. **Configuration system** - To customize storage, titles, and behavior

## Core Components

### `AvatarUpload` (Generic Component)

Located at: `/components/Upload/AvatarUpload/index.tsx`

This is the main generic component that handles:
- File drag & drop with circular dropzone
- Image upload to Supabase storage
- Image deletion
- Circular avatar preview
- Error handling and notifications
- Configurable avatar size and file size limits

#### Props

```typescript
interface IAvatarUploadProps {
  entityId?: string;
  config: AvatarUploadConfig;
  fetchExistingAvatar?: (entityId: string) => Promise<string | null>;
  updateEntityAvatar?: (entityId: string, filename: string | null) => Promise<void>;
  onAvatarUploaded?: (url: string) => void;
}

interface AvatarUploadConfig {
  storageBucket: string;     // e.g., "images"
  storageFolder: string;     // e.g., "avatars"
  title: string;             // e.g., "Profile Picture"
  description: string;       // e.g., "Upload a profile picture for your account"
  avatarSize?: number;       // Size in pixels (default: 150)
  maxFileSize?: number;      // Max file size in bytes (default: 2MB)
}
```

### Entity-Specific Wrappers

#### `ArtistAvatarUpload`

Located at: `/components/Upload/ArtistArtUpload/ArtistAvatarUpload.tsx`

This wrapper provides:
- Pre-configured settings for artist avatars
- Database integration with the `artists` table
- Storage configuration for the "avatars" bucket

```typescript
interface IArtistAvatarUploadProps {
  artistId?: string;
  onAvatarUploaded?: (url: string) => void;
}
```

## Usage Examples

### Using the ArtistAvatarUpload wrapper (recommended)

```tsx
import { ArtistAvatarUpload } from "@/components/Upload/ArtistArtUpload/ArtistAvatarUpload";

function ArtistProfile({ artistId }: { artistId: string }) {
  return (
    <ArtistAvatarUpload
      artistId={artistId}
      onAvatarUploaded={(url) => {
        console.log("Artist avatar uploaded:", url);
      }}
    />
  );
}
```

### Using the generic AvatarUpload for custom entities

```tsx
import { AvatarUpload, AvatarUploadConfig } from "@/components/Upload/AvatarUpload";

const promoterAvatarConfig: AvatarUploadConfig = {
  storageBucket: "images",
  storageFolder: "promoter-avatars",
  title: "Profile Picture",
  description: "Upload a profile picture for your promoter account",
  avatarSize: 120,
  maxFileSize: 1 * 1024 * 1024, // 1MB
};

async function fetchPromoterAvatar(promoterId: string): Promise<string | null> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("promoters")
    .select("avatar_img")
    .eq("id", promoterId)
    .single();
  
  return data?.avatar_img || null;
}

async function updatePromoterAvatar(promoterId: string, filename: string | null): Promise<void> {
  const supabase = await createClient();
  await supabase
    .from("promoters")
    .update({ avatar_img: filename })
    .eq("id", promoterId);
}

function PromoterProfile({ promoterId }: { promoterId: string }) {
  return (
    <AvatarUpload
      entityId={promoterId}
      config={promoterAvatarConfig}
      fetchExistingAvatar={fetchPromoterAvatar}
      updateEntityAvatar={updatePromoterAvatar}
      onAvatarUploaded={(url) => {
        console.log("Promoter avatar uploaded:", url);
      }}
    />
  );
}
```

### Create Mode (no entityId)

```tsx
function ArtistCreateForm() {
  const [avatarUrl, setAvatarUrl] = useState("");

  return (
    <form>
      {/* Other form fields */}
      <ArtistAvatarUpload
        onAvatarUploaded={setAvatarUrl}
      />
    </form>
  );
}
```

## Features

### Storage Management
- Automatic file cleanup when replacing avatars
- UUID-based filenames to prevent conflicts
- Configurable storage buckets and folders

### UI/UX
- Circular dropzone matching avatar preview
- Drag and drop support
- Visual feedback for different states (accept/reject/idle)
- Delete button overlay on uploaded avatars
- Configurable avatar size

### Error Handling
- File type validation (PNG, JPEG, WebP)
- File size validation
- Storage error handling
- Database error handling
- User-friendly error notifications

### Responsive Design
- Works on mobile and desktop
- Touch-friendly interface
- Accessible controls

## Configuration Options

### Avatar Size
Control the size of both the dropzone and preview:
```typescript
const config: AvatarUploadConfig = {
  // ...other config
  avatarSize: 200, // 200px diameter
};
```

### File Size Limit
Set maximum file size:
```typescript
const config: AvatarUploadConfig = {
  // ...other config
  maxFileSize: 5 * 1024 * 1024, // 5MB
};
```

### Storage Configuration
Customize where files are stored:
```typescript
const config: AvatarUploadConfig = {
  storageBucket: "user-content",
  storageFolder: "profile-pictures",
  // ...other config
};
```

## Database Integration

The component expects entity tables to have an avatar field (typically `avatar_img`) that stores the filename of the uploaded image.

Example database schema:
```sql
-- For artists
ALTER TABLE artists ADD COLUMN avatar_img TEXT;

-- For promoters
ALTER TABLE promoters ADD COLUMN avatar_img TEXT;

-- For venues
ALTER TABLE venues ADD COLUMN avatar_img TEXT;
```

## Storage Buckets

Ensure the configured storage buckets exist in Supabase and have appropriate policies:

```sql
-- Allow authenticated users to upload to avatars bucket
CREATE POLICY "Users can upload avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);

-- Allow public access to view avatars
CREATE POLICY "Public can view avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'avatars');

-- Allow users to delete their own avatars
CREATE POLICY "Users can delete their avatars" ON storage.objects
FOR DELETE USING (
  bucket_id = 'avatars' AND 
  auth.role() = 'authenticated'
);
```
