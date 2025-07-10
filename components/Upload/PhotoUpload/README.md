# EventPhotoUpload Component

A React component for uploading and managing photos for events.

## Features

- Upload multiple photos (up to 20 by default)
- Preview photos in a grid layout
- Delete photos individually
- Modal view for larger photo preview
- Mobile-responsive design
- Integrates with Supabase storage and database

## Components

### EventPhotoUpload

Basic upload component for event photos.

```tsx
import { EventPhotoUpload } from "@/components/Upload";

function EventDetails({ eventId }: { eventId: string }) {
  const handlePhotosUploaded = (photos: PhotoItem[]) => {
    console.log("Photos updated:", photos);
  };

  return (
    <EventPhotoUpload 
      eventId={eventId}
      onPhotosUploaded={handlePhotosUploaded}
    />
  );
}
```

### EventPhotoGallery

Complete gallery component with responsive grid and full-screen modal viewing.

```tsx
import { EventPhotoGallery } from "@/components/Upload";

// Standard usage
function EventPage({ eventId, eventName, isOwner }: Props) {
  return (
    <EventPhotoGallery 
      eventId={eventId}
      eventName={eventName}
      isEventOwner={isOwner}
    />
  );
}

// Fullscreen usage
function PhotoGalleryPage({ eventId, eventName }: Props) {
  return (
    <EventPhotoGallery 
      eventId={eventId}
      eventName={eventName}
      fullscreen
    />
  );
}

// Embedded usage (no container wrapper)
function EmbeddedGallery({ eventId, eventName }: Props) {
  return (
    <EventPhotoGallery 
      eventId={eventId}
      eventName={eventName}
      embedded
    />
  );
}
```

## Props

### IEventPhotoUploadProps

| Prop | Type | Description |
|------|------|-------------|
| `eventId` | `string` (optional) | The event ID. If not provided, component works in preview mode |
| `onPhotosUploaded` | `(photos: PhotoItem[]) => void` (optional) | Callback when photos are uploaded or updated |

### EventPhotoGalleryProps

| Prop | Type | Description |
|------|------|-------------|
| `eventId` | `string` | The event ID |
| `eventName` | `string` | Display name for the event |
| `isEventOwner` | `boolean` (optional) | Whether the user can upload photos |
| `fullscreen` | `boolean` (optional) | Optimizes layout for fullscreen usage |
| `embedded` | `boolean` (optional) | Removes container wrapper for embedded usage |

## Responsive Design

The photo grid automatically adjusts columns based on screen size:

### Standard Mode
- **Mobile (base)**: 2 columns
- **Small screens (xs)**: 2 columns  
- **Tablets (sm)**: 3 columns
- **Desktop (md)**: 4 columns
- **Large desktop (lg)**: 4 columns

### Fullscreen Mode
- **Mobile (base)**: 2 columns
- **Small screens (xs)**: 3 columns
- **Tablets (sm)**: 4 columns
- **Desktop (md)**: 5 columns
- **Large desktop (lg)**: 6 columns
- **Extra large (xl)**: 7 columns

## Features

### Photo Grid
- Responsive grid layout
- Square aspect ratio photos
- Hover effects with scale and shadow
- Click to open full-size modal

### Modal Viewer
- Full-screen photo viewing
- Navigation between photos (left/right arrows)
- Photo counter display
- Keyboard navigation support
- Click outside to close

### Upload Management
- Drag & drop multiple files
- Progress indication
- Error handling
- Success notifications
- File type validation
- Size limits

## Storage Structure

Photos are stored in the `event-photos` bucket with the following structure:

```
bucket: "event-photos"
├── uuid1.jpg
├── uuid2.png
└── ...
```

## Database Integration

The component uses the `event_photos` table with the following structure:

- `id`: string (matches the filename in storage)
- `event`: string (references events.id)
- `artist`: string (optional, references artists.id)
- `user`: string (optional, references the uploader)
- `created_at`: timestamp

## Configuration

The component is configured with these defaults:

- **Storage bucket**: "event-photos"
- **Max file size**: 10MB per photo
- **Max photos**: 20 photos per event
- **Supported formats**: PNG, JPEG, WebP, AVIF
- **Multiple uploads**: Enabled

You can customize these settings by modifying the `eventPhotoConfig` in the component file.
