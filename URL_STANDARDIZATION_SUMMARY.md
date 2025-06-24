# Dynamic Route URL Standardization Summary

This document summarizes the changes made to standardize URL handling across all dynamic routes using the `urlToName` and `nameToUrl` utility functions with **lowercase normalization**.

## 🔧 **Updated Utility Functions**

Located in `/lib/utils.ts`:

```typescript
/**
 * Convert a name to a URL-safe format by replacing spaces with hyphens,
 * converting to lowercase, and encoding special characters
 */
export function nameToUrl(name: string): string {
  return encodeURIComponent(name.trim().toLowerCase().replace(/\s+/g, '-'));
}

/**
 * Convert a URL-safe name back to the original format by replacing hyphens with spaces
 * and decoding special characters. Note: This will not restore original capitalization.
 */
export function urlToName(urlName: string): string {
  return decodeURIComponent(urlName).replace(/-/g, ' ');
}
```

### 🆕 **Key Changes**
- **`nameToUrl`**: Now includes `.toLowerCase()` to ensure all URLs are lowercase
- **Documentation**: Updated to clarify that original capitalization is not preserved
- **Database Compatibility**: Works with case-insensitive queries (`ilike`)

## 🗄️ **Updated Database Queries**

### Events Query Fix
- **File**: `/db/queries/events.ts`
- **Change**: Updated `getEventByName` to use `ilike` instead of `eq` for case-insensitive matching
- **Before**: `.eq("name", eventName)`
- **After**: `.ilike("name", eventName)`

### Existing Case-Insensitive Queries ✅
- **Artists**: Already using `.ilike("name", artistName)`
- **Venues**: Already using `.ilike("name", \`%${venueName}%\`)`

## ✅ **Updated Dynamic Route Pages**

### Artists Routes
- **`/app/artists/[artistName]/page.tsx`**
  - Added `urlToName` import and usage to decode URL parameter
  - Updated to use `urlToName(artistName)` when calling `getArtistByName`
  - Updated edit button link to use `nameToUrl(name)` (now lowercase)

- **`/app/artists/[artistName]/edit/page.tsx`**
  - Added `urlToName` import
  - Updated to use URL parameter instead of `getArtist()`
  - Now properly decodes `artistName` with `urlToName`

### Venues Routes
- **`/app/venues/[venueName]/page.tsx`**
  - Replaced `decodeURIComponent` with `urlToName` for consistency
  - Added proper import

- **`/app/venues/[venueName]/edit/page.tsx`**
  - Replaced `decodeURIComponent` with `urlToName` 
  - Updated redirect to use `nameToUrl` (now lowercase)
  - Added proper imports

### Events Routes
- **`/app/events/[eventName]/page.tsx`** ✅ Already implemented
- **`/app/events/[eventName]/lineup/page.tsx`** ✅ Already implemented

## ✅ **Updated Component Links**

### Artist Links
- **`/components/SearchBar.tsx`**
  - Added `nameToUrl` import
  - Updated artist search result links to use `nameToUrl(artist.name)` (now lowercase)

- **`/components/onboarding/ArtistForm.tsx`**
  - Added `nameToUrl` import
  - Updated redirect after form submission to use `nameToUrl` (now lowercase)

- **`/app/profile/page.tsx`**
  - Added `nameToUrl` import
  - Updated artist profile link to use `nameToUrl(userEntities.artist.name)` (now lowercase)

### Venue Links
- **`/app/profile/page.tsx`**
  - Updated venue profile link to use `nameToUrl(userEntities.venue.name)` (now lowercase)

- **`/app/venues/page.tsx`**
  - Added `nameToUrl` import
  - Updated venue list links to use `nameToUrl(venue.name)` (now lowercase)

- **`/components/VenueEdit/VenueEditForm.tsx`**
  - Added `nameToUrl` import
  - Updated redirect after form submission (now lowercase)
  - Updated navigation links (2 instances, now lowercase)

- **`/components/VenueDetail/VenueDetailView.tsx`**
  - Added `nameToUrl` import
  - Updated edit button link to use `nameToUrl(venue.name)` (now lowercase)

## 📋 **Function Usage Patterns**

### URL Parameter Decoding (in dynamic route pages)
```typescript
// Before
const { artistName } = await params;
const artist = await getArtistByName(supabase, artistName);

// After
const { artistName } = await params;
const decodedArtistName = urlToName(artistName);
const artist = await getArtistByName(supabase, decodedArtistName);
```

### Link Generation (in components)
```typescript
// Before
href={`/artists/${encodeURIComponent(artist.name.toLowerCase())}`}
href={`/venues/${decodeURIComponent(venue.name)}`}

// After (all URLs now lowercase)
href={`/artists/${nameToUrl(artist.name)}`}  // "John Doe" → "john-doe"
href={`/venues/${nameToUrl(venue.name)}`}    // "Madison Square Garden" → "madison-square-garden"
```

## 🔄 **URL Transformation Examples**

| Original Name | URL (nameToUrl) | Decoded (urlToName) |
|---------------|-----------------|---------------------|
| "John Doe" | "john-doe" | "john doe" |
| "Madison Square Garden" | "madison-square-garden" | "madison square garden" |
| "The O2 Arena" | "the-o2-arena" | "the o2 arena" |
| "DJ Snake & Friends" | "dj-snake-%26-friends" | "dj snake & friends" |

## ✅ **Consistency Achieved**

1. **URL Format**: All dynamic routes now use lowercase URLs (spaces → hyphens, URL encoded, lowercase)
2. **Function Usage**: Consistent use of `nameToUrl` for encoding and `urlToName` for decoding
3. **Import Patterns**: All files import utilities from `/lib/utils`
4. **Database Compatibility**: All queries now use case-insensitive matching
5. **SEO Friendly**: Lowercase URLs are better for SEO and consistency

## 🧪 **Testing Checklist**

To verify the changes:
- [ ] Artist pages load correctly with mixed-case names (URLs are lowercase)
- [ ] Venue pages load correctly with mixed-case names (URLs are lowercase)
- [ ] Event pages load correctly with mixed-case names (URLs are lowercase)
- [ ] Edit links work properly with lowercase URLs
- [ ] Profile page links navigate correctly with lowercase URLs
- [ ] Search results link to correct pages with lowercase URLs
- [ ] Form submissions redirect to correct lowercase URLs
- [ ] Special characters in names are handled properly
- [ ] Case-insensitive database queries work correctly

## 📝 **Files Modified**

### Utility Functions (1 file)
- `/lib/utils.ts` - Updated `nameToUrl` to include `.toLowerCase()`

### Database Queries (1 file)
- `/db/queries/events.ts` - Updated to use case-insensitive query

### Dynamic Route Pages (4 files)
- `/app/artists/[artistName]/page.tsx`
- `/app/artists/[artistName]/edit/page.tsx`
- `/app/venues/[venueName]/page.tsx`
- `/app/venues/[venueName]/edit/page.tsx`

### Component Files (6 files)
- `/components/SearchBar.tsx`
- `/components/onboarding/ArtistForm.tsx`
- `/app/profile/page.tsx`
- `/app/venues/page.tsx`
- `/components/VenueEdit/VenueEditForm.tsx`
- `/components/VenueDetail/VenueDetailView.tsx`

### Total: 12 files updated ✅

All dynamic routes and their associated links now use **lowercase, standardized URLs** with consistent `urlToName`/`nameToUrl` functions, ensuring optimal SEO and user experience.
