# Upload Component Architecture

This document provides an overview of the decoupled upload system architecture used for both banner and avatar uploads across different entity types.

## Architecture Overview

The upload system follows a decoupled, configurable architecture that consists of:

1. **Generic Upload Components** - Reusable components that handle the core upload logic
2. **Entity-Specific Wrappers** - Pre-configured components for specific entities
3. **Configuration System** - To customize storage, UI, and behavior per entity type

## Core Components

### Generic Components

| Component | Purpose | Location |
|-----------|---------|----------|
| `BannerUpload` | Generic banner image upload | `/components/Upload/BannerUpload/index.tsx` |
| `AvatarUpload` | Generic avatar/profile picture upload | `/components/Upload/AvatarUpload/index.tsx` |

### Entity-Specific Wrappers

| Entity | Banner Component | Avatar Component | Location |
|--------|------------------|------------------|----------|
| **Artist** | `ArtistBannerUpload` | `ArtistAvatarUpload` | `/components/Upload/ArtistArtUpload/` |
| **Promoter** | `PromoterBannerUpload` | `PromoterAvatarUpload` | `/components/Upload/PromoterBannerUpload/` |
| **Venue** | *(Example only)* | *(Not implemented)* | `/components/Upload/AvatarUpload/examples.tsx` |

## Configuration Interfaces

### BannerUploadConfig
```typescript
interface BannerUploadConfig {
  storageBucket: string;     // e.g., "images"
  storageFolder: string;     // e.g., "banners"
  title: string;             // e.g., "Banner Image"
  description: string;       // e.g., "Upload a banner image for your profile"
}
```

### AvatarUploadConfig
```typescript
interface AvatarUploadConfig {
  storageBucket: string;     // e.g., "images"
  storageFolder: string;     // e.g., "avatars"
  title: string;             // e.g., "Profile Picture"
  description: string;       // e.g., "Upload a profile picture for your account"
  avatarSize?: number;       // Size in pixels (default: 150)
  maxFileSize?: number;      // Max file size in bytes (default: 2MB)
}
```

## Component Props

### Generic Component Props

Both `BannerUpload` and `AvatarUpload` accept these common props:

```typescript
interface IGenericUploadProps {
  entityId?: string;
  config: UploadConfig;
  fetchExistingImage?: (entityId: string) => Promise<string | null>;
  updateEntityImage?: (entityId: string, filename: string | null) => Promise<void>;
  onImageUploaded?: (url: string) => void;
}
```

### Entity-Specific Props

Entity-specific wrappers have simplified props:

```typescript
// Artist components
interface IArtistUploadProps {
  artistId?: string;
  onImageUploaded?: (url: string) => void;
}

// Promoter components  
interface IPromoterUploadProps {
  promoterId?: string;
  onImageUploaded?: (url: string) => void;
}
```

## Usage Patterns

### 1. Using Entity-Specific Wrappers (Recommended)

```tsx
// Artist avatar upload
<ArtistAvatarUpload
  artistId={artistId}
  onAvatarUploaded={(url) => console.log("Avatar uploaded:", url)}
/>

// Artist banner upload
<ArtistBannerUpload
  artistId={artistId}
  onBannerUploaded={(url) => console.log("Banner uploaded:", url)}
/>
```

### 2. Using Generic Components with Custom Configuration

```tsx
const customConfig: AvatarUploadConfig = {
  storageBucket: "custom-bucket",
  storageFolder: "custom-avatars",
  title: "Custom Avatar",
  description: "Upload your custom avatar",
  avatarSize: 200,
  maxFileSize: 5 * 1024 * 1024,
};

<AvatarUpload
  entityId={entityId}
  config={customConfig}
  fetchExistingAvatar={fetchFunction}
  updateEntityAvatar={updateFunction}
  onAvatarUploaded={(url) => console.log("Custom avatar uploaded:", url)}
/>
```

### 3. Create Mode (No Entity ID)

```tsx
// For forms before entity creation
<ArtistAvatarUpload
  onAvatarUploaded={(url) => setPreviewUrl(url)}
/>
```

## Key Differences: Banner vs Avatar

| Feature | BannerUpload | AvatarUpload |
|---------|--------------|--------------|
| **Shape** | Rectangular | Circular |
| **Preview** | Full-width image | Circular avatar |
| **Dropzone** | Rectangular | Circular |
| **Default Size** | 100% width × 200px height | 150px diameter |
| **File Size Limit** | 5MB default | 2MB default |
| **Typical Use** | Hero images, covers | Profile pictures, logos |

## Storage Structure

### Banner Storage
```
{bucket}/
  banners/
    {uuid-filename}
  artist-banners/
    {uuid-filename}
  promoter-banners/
    {uuid-filename}
```

### Avatar Storage
```
avatars/
  {uuid-filename}
  
{bucket}/
  promoter-avatars/
    {uuid-filename}
  venue-avatars/
    {uuid-filename}
```

## Database Schema Requirements

### Artists Table
```sql
-- Required fields for both banner and avatar
ALTER TABLE artists ADD COLUMN banner_img TEXT;
ALTER TABLE artists ADD COLUMN avatar_img TEXT;
```

### Promoters Table
```sql
-- Required fields for both banner and avatar
ALTER TABLE promoters ADD COLUMN banner_img TEXT;
ALTER TABLE promoters ADD COLUMN avatar_img TEXT;
```

### Venues Table
```sql
-- Optional fields (examples only)
ALTER TABLE venues ADD COLUMN banner_img TEXT;
ALTER TABLE venues ADD COLUMN avatar_img TEXT;
```

## File Organization

```
components/Upload/
├── BannerUpload/
│   ├── index.tsx          # Generic banner upload component
│   ├── README.md          # Banner-specific documentation
│   └── examples.tsx       # Usage examples
├── AvatarUpload/
│   ├── index.tsx          # Generic avatar upload component
│   ├── README.md          # Avatar-specific documentation
│   └── examples.tsx       # Usage examples
├── ArtistArtUpload/
│   ├── index.tsx          # Artist art upload (legacy)
│   ├── ArtistBannerUpload.tsx  # Artist banner wrapper
│   └── ArtistAvatarUpload.tsx  # Artist avatar wrapper
├── PromoterBannerUpload/
│   └── index.tsx          # Promoter banner wrapper
└── PromoterAvatarUpload/
    └── index.tsx          # Promoter avatar wrapper
```

## Benefits of This Architecture

1. **Reusability** - Generic components can be used for any entity type
2. **Consistency** - All upload components follow the same patterns
3. **Flexibility** - Easy to customize for different requirements
4. **Maintainability** - Changes to core upload logic only need to be made once
5. **Type Safety** - Full TypeScript support with proper interfaces
6. **Separation of Concerns** - UI logic separated from entity-specific business logic

## Adding New Entity Types

To add uploads for a new entity type:

1. Create entity-specific wrapper components
2. Implement fetch and update functions for the entity
3. Configure storage bucket and folder paths
4. Update database schema if needed

Example for a new "Event" entity:

```typescript
// EventAvatarUpload.tsx
const eventAvatarConfig: AvatarUploadConfig = {
  storageBucket: "images",
  storageFolder: "event-avatars",
  title: "Event Logo",
  description: "Upload a logo for your event",
};

export function EventAvatarUpload({ eventId, onAvatarUploaded }) {
  return (
    <AvatarUpload
      entityId={eventId}
      config={eventAvatarConfig}
      fetchExistingAvatar={fetchEventAvatar}
      updateEntityAvatar={updateEventAvatar}
      onAvatarUploaded={onAvatarUploaded}
    />
  );
}
```
