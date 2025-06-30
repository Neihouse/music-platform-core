# Modular ProfileContent System

This document describes the refactored ProfileContent system that extracts common functionality from `ArtistProfileContent` and `PromoterProfileContent` into a reusable, modular component.

## Overview

The system consists of three main parts:

1. **ProfileContent** - The main reusable component
2. **ProfileContentHelpers** - Data transformation utilities
3. **Updated profile components** - Simplified implementations using the new system

## Components

### ProfileContent

`/components/shared/ProfileContent.tsx`

A generic, reusable profile component that handles:
- Hero section with banner image
- Profile header with avatar, name, bio, and location
- Font loading for custom typography
- Scroll progress tracking
- Tabbed content organization
- Consistent styling and layout

**Key Features:**
- Supports multiple profile types (artist, promoter, venue, fan)
- Automatic edit URL generation
- Font loading management
- Responsive design with consistent spacing

### ProfileContentHelpers

`/components/shared/ProfileContentHelpers.tsx`

Utility functions for transforming data:
- `transformArtistData()` - Converts artist data to ProfileContent format
- `transformPromoterData()` - Converts promoter data to ProfileContent format  
- `transformPromoterLocalities()` - Converts promoter locality data to StoredLocality format

### Updated Profile Components

Both `ArtistProfileContent` and `PromoterProfileContent` are now significantly simplified:
- Reduced from ~170-280 lines to ~60 lines each
- No duplicate code for font loading, scroll handling, or layout
- Focus on data transformation and configuration
- Consistent behavior across profile types

## Usage

### Basic Implementation

```tsx
import { ProfileContent, transformArtistData } from "@/components/shared";

const { entity, tabs } = transformArtistData(artist, tracks, promoters, events);

return (
  <ProfileContent
    entity={entity}
    profileType="artist"
    avatarUrl={avatarUrl}
    bannerUrl={bannerUrl}
    location={storedLocality}
    canEdit={canEdit}
    tabs={tabs}
    defaultActiveTab="music"
  />
);
```

### Custom Tabs

```tsx
const customTabs: ProfileTab[] = [
  {
    key: "overview",
    label: "Overview",
    content: <CustomOverviewComponent />
  },
  {
    key: "details",
    label: "Details",
    content: <CustomDetailsComponent />
  }
];

return (
  <ProfileContent
    entity={entity}
    profileType="venue"
    tabs={customTabs}
    // ... other props
  />
);
```

## Benefits

1. **Code Reuse** - Common profile functionality is shared
2. **Consistency** - All profiles have the same behavior and styling
3. **Maintainability** - Changes to profile behavior only need to be made in one place
4. **Extensibility** - Easy to add new profile types (venue, fan, etc.)
5. **Testing** - Simpler to test individual components in isolation

## Migration Notes

The refactored components maintain the same public API, so existing usage should continue to work without changes. The internal implementation is now much cleaner and more maintainable.

## Future Enhancements

- Add support for additional profile types (venue, fan)
- Implement profile comparison functionality
- Add more sophisticated tab management
- Enhanced accessibility features
- Performance optimizations for large datasets
