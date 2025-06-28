# Migration Guide: Replacing Manual Font Loading with StyledTitle

This guide shows how to replace existing manual font loading implementations with the new `StyledTitle` component.

## Before: Manual Font Loading

The existing approach in `ArtistProfileContent.tsx` manually loads fonts:

```tsx
// ❌ Old approach - manual font loading
useEffect(() => {
  const selectedFont = (artist as any).selectedFont;
  if (selectedFont) {
    const fontName = selectedFont.replace(/ /g, '+');
    
    // Check if font is already loaded
    const existingLink = document.querySelector(`link[href*="${fontName}"]`);
    if (!existingLink) {
      const fontLink = document.createElement('link');
      fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
      fontLink.rel = 'stylesheet';
      document.head.appendChild(fontLink);
    }
  }
}, [artist]);

// Then manually apply the font in style
<h1 style={{ 
  fontFamily: artist.selectedFont ? `"${artist.selectedFont}", sans-serif` : 'sans-serif' 
}}>
  {artist.name}
</h1>
```

## After: Using StyledTitle

Replace the manual implementation with the `StyledTitle` component:

```tsx
// ✅ New approach - using StyledTitle
import StyledTitle from '@/components/StyledTitle';

// Remove the useEffect for font loading - StyledTitle handles it

// Simply use the component
<StyledTitle selectedFont={artist.selectedFont}>
  {artist.name}
</StyledTitle>
```

## Complete Migration Example

### Before (ArtistProfileContent.tsx)

```tsx
import React, { useEffect } from 'react';

const ArtistProfileContent = ({ artist, avatarUrl, bannerUrl }) => {
  const { name, bio, external_links } = artist;

  // Manual font loading
  useEffect(() => {
    const selectedFont = (artist as any).selectedFont;
    if (selectedFont) {
      const fontName = selectedFont.replace(/ /g, '+');
      
      const existingLink = document.querySelector(`link[href*="${fontName}"]`);
      if (!existingLink) {
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
    }
  }, [artist]);

  return (
    <div>
      {/* Manual font application */}
      <h1 style={{
        fontFamily: artist.selectedFont ? `"${artist.selectedFont}", sans-serif` : 'sans-serif'
      }}>
        {name}
      </h1>
      <p>{bio}</p>
    </div>
  );
};
```

### After (Using StyledTitle)

```tsx
import React from 'react';
import StyledTitle from '@/components/StyledTitle';

const ArtistProfileContent = ({ artist, avatarUrl, bannerUrl }) => {
  const { name, bio, external_links } = artist;

  // No manual font loading needed!

  return (
    <div>
      {/* StyledTitle handles everything */}
      <StyledTitle selectedFont={artist.selectedFont}>
        {name}
      </StyledTitle>
      <p>{bio}</p>
    </div>
  );
};
```

## Benefits of Migration

1. **Less Code**: Remove manual font loading logic
2. **Better Error Handling**: StyledTitle handles font loading failures
3. **Consistent API**: Same pattern across all entities (artists, promoters, venues)
4. **Performance**: Optimized font loading with proper caching
5. **Type Safety**: Full TypeScript support
6. **Accessibility**: Better font loading strategies

## Step-by-Step Migration

1. **Import StyledTitle**:
   ```tsx
   import StyledTitle from '@/components/StyledTitle';
   ```

2. **Remove manual font loading**:
   - Delete `useEffect` for font loading
   - Remove manual `link` element creation
   - Remove manual font family style application

3. **Replace title elements**:
   ```tsx
   // Replace this:
   <h1 style={{ fontFamily: `"${entity.selectedFont}", sans-serif` }}>
     {entity.name}
   </h1>
   
   // With this:
   <StyledTitle selectedFont={entity.selectedFont}>
     {entity.name}
   </StyledTitle>
   ```

4. **Test the migration**:
   - Verify fonts load correctly
   - Check fallback behavior
   - Test with null/undefined selectedFont values

## Common Migration Patterns

### Artist Names
```tsx
// Before
<h1 style={{ fontFamily: artist.selectedFont ? `"${artist.selectedFont}", sans-serif` : 'sans-serif' }}>
  {artist.name}
</h1>

// After
<StyledTitle selectedFont={artist.selectedFont}>
  {artist.name}
</StyledTitle>
```

### Promoter Names
```tsx
// Before
<h2 style={{ fontFamily: promoter.selectedFont ? `"${promoter.selectedFont}", sans-serif` : 'sans-serif' }}>
  {promoter.name}
</h2>

// After
<StyledTitle selectedFont={promoter.selectedFont} as="h2">
  {promoter.name}
</StyledTitle>
```

### Venue Names
```tsx
// Before
<h3 style={{ fontFamily: venue.selectedFont ? `"${venue.selectedFont}", sans-serif` : 'sans-serif' }}>
  {venue.name}
</h3>

// After
<StyledTitle selectedFont={venue.selectedFont} as="h3">
  {venue.name}
</StyledTitle>
```

## Files to Update

Look for these patterns in your codebase:

1. **Manual font loading** in `useEffect`
2. **Dynamic fontFamily** in style objects
3. **Font URL generation** for Google Fonts
4. **Link element creation** for fonts

Common files that might need updates:
- `components/ArtistProfileContent.tsx` ✅
- `components/artist/ArtistPromotersClient.tsx`
- `components/promoter/PromoterProfileContent.tsx`
- `components/VenueDetail/VenueProfileContent.tsx`
- Any other components displaying entity names with custom fonts
