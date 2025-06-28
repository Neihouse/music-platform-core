# StyledTitle Component

A React component that dynamically loads and applies Google Fonts based on the `selectedFont` field from your database entities (artists, promoters, venues).

## Features

- **Dynamic Font Loading**: Automatically loads Google Fonts based on the `selectedFont` database field
- **Secure Font Loading**: Uses the secure client-side font loader (no API keys exposed)
- **Graceful Fallbacks**: Falls back to system fonts if Google Font loading fails
- **Flexible Styling**: Supports custom CSS classes, inline styles, and HTML elements
- **Loading States**: Optional loading indicator while fonts load
- **TypeScript Support**: Fully typed for better developer experience

## Basic Usage

```tsx
import StyledTitle from '@/components/StyledTitle';

// With artist data
function ArtistProfile({ artist }) {
  return (
    <StyledTitle selectedFont={artist.selectedFont}>
      {artist.name}
    </StyledTitle>
  );
}

// With promoter data
function PromoterHeader({ promoter }) {
  return (
    <StyledTitle 
      selectedFont={promoter.selectedFont}
      as="h2"
    >
      {promoter.name}
    </StyledTitle>
  );
}

// With venue data
function VenueTitle({ venue }) {
  return (
    <StyledTitle selectedFont={venue.selectedFont}>
      {venue.name}
    </StyledTitle>
  );
}
```

## Advanced Usage

```tsx
import StyledTitle from '@/components/StyledTitle';

function CustomTitle({ entity }) {
  return (
    <StyledTitle
      selectedFont={entity.selectedFont}
      as="h3"
      className="my-custom-title"
      style={{ 
        color: '#333', 
        fontSize: '2rem',
        textAlign: 'center' 
      }}
      fallbackFont="Georgia, serif"
      fontWeights={['400', '600', '800']}
      showLoading={true}
    >
      {entity.name}
    </StyledTitle>
  );
}
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `children` | `ReactNode` | **Required** | The text content to display |
| `selectedFont` | `string \| null` | `undefined` | Font family name from database |
| `fontWeights` | `string[]` | `['400', '500', '600', '700']` | Font weights to load |
| `fallbackFont` | `string` | `'Arial, sans-serif'` | Fallback font if loading fails |
| `className` | `string` | `undefined` | Additional CSS class |
| `style` | `React.CSSProperties` | `undefined` | Additional inline styles |
| `as` | `keyof JSX.IntrinsicElements` | `'h1'` | HTML element to render |
| `showLoading` | `boolean` | `false` | Show loading state while font loads |

## Database Integration

The component expects your database entities to have a `selectedFont` field:

```sql
-- Artists table
ALTER TABLE artists ADD COLUMN selectedFont TEXT;

-- Promoters table  
ALTER TABLE promoters ADD COLUMN selectedFont TEXT;

-- Venues table
ALTER TABLE venues ADD COLUMN selectedFont TEXT;
```

Example database values:
- `"Inter"`
- `"Playfair Display"`
- `"Roboto"`
- `"Montserrat"`
- `null` (will use fallback font)

## How It Works

1. **Font Loading**: When `selectedFont` is provided, the component uses the secure `loadFont` function from `@/lib/fonts-client`
2. **CDN URL Generation**: Automatically generates the correct Google Fonts CDN URL
3. **Safe Loading**: Uses browser-safe font loading without exposing any API keys
4. **Fallback Handling**: If font loading fails, gracefully falls back to the specified fallback font
5. **Performance**: Uses `font-display: swap` strategy for optimal loading performance

## Font Loading States

The component tracks three states:

1. **Loading** (`isLoading: true`): Font is being loaded from CDN
2. **Loaded** (`fontLoaded: true`): Font loaded successfully and applied
3. **Failed** (`fontFailed: true`): Font loading failed, using fallback

You can inspect these states using the data attributes:

```html
<h1 
  data-font="Inter"
  data-font-loaded="true"
  data-font-failed="false"
>
  Artist Name
</h1>
```

## Error Handling

- **Invalid font names**: Component gracefully handles non-existent fonts
- **Network errors**: Falls back to system fonts if CDN is unavailable  
- **Console warnings**: Logs helpful messages for debugging font issues
- **No breaking**: Component never breaks, always renders content

## Performance Considerations

- **Efficient Loading**: Only loads fonts when `selectedFont` changes
- **Weight Optimization**: Only loads specified font weights
- **CDN Caching**: Leverages Google Fonts CDN caching
- **Swap Strategy**: Uses optimal `font-display: swap` for performance
- **Transition**: Smooth font transitions prevent jarring changes

## Examples with Real Data

```tsx
// Artist profile page
function ArtistPage({ artist }) {
  return (
    <div>
      <StyledTitle selectedFont={artist.selectedFont}>
        {artist.name}
      </StyledTitle>
      <p>Bio: {artist.bio}</p>
    </div>
  );
}

// Promoter card
function PromoterCard({ promoter }) {
  return (
    <div className="card">
      <StyledTitle 
        selectedFont={promoter.selectedFont}
        as="h3"
        className="card-title"
      >
        {promoter.name}
      </StyledTitle>
    </div>
  );
}

// Event listing with venue
function EventCard({ event, venue }) {
  return (
    <div>
      <h2>{event.name}</h2>
      <StyledTitle 
        selectedFont={venue.selectedFont}
        as="p"
        className="venue-name"
      >
        at {venue.name}
      </StyledTitle>
    </div>
  );
}
```

## Troubleshooting

### Font not loading?
1. Check that `selectedFont` contains a valid Google Fonts family name
2. Verify network connectivity to Google Fonts CDN
3. Check browser console for error messages

### Layout shifting?
1. Set explicit font sizes in your CSS
2. Use consistent line heights
3. Consider using font fallback with similar metrics

### Performance issues?
1. Limit the number of different fonts used per page
2. Reduce the number of font weights loaded
3. Consider preloading critical fonts

## Related Components

- [`FontSelect`](../FontSelect/README.tsx) - For selecting fonts in forms
- Font loading utilities in `@/lib/fonts-client`
- Font security system in `@/lib/fonts-secure`
