# EventPhotoUpload Component

A React component for uploading and managing photos for events.

## Features

- Upload multiple photos (up to 20 by default)
- Preview photos in a grid layout
- Delete photos individually
- Modal view for larger photo preview
- Mobile-responsive design
- Integrates with Supabase storage and database

## Usage

```tsx
import { EventPhotoUpload } from "@/components/Upload";

function EventDetails({ eventId }: { eventId: string }) {
  const handlePhotosUploaded = (photos: PhotoItem[]) => {
    console.log("Photos updated:", photos);
  };

  return (
    <div>
      <EventPhotoUpload 
        eventId={eventId}
        onPhotosUploaded={handlePhotosUploaded}
      />
    </div>
  );
}
```

## Props

### IEventPhotoUploadProps

| Prop | Type | Description |
|------|------|-------------|
| `eventId` | `string` (optional) | The event ID. If not provided, component works in preview mode |
| `onPhotosUploaded` | `(photos: PhotoItem[]) => void` (optional) | Callback when photos are uploaded or updated |

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
