# StyledTitle Component

A portable, decoupled React component that extends Mantine's `Title` component with dynamic Google Fonts loading capabilities.

## Features

- 🎨 **Dynamic Font Loading**: Automatically fetches and loads Google Fonts
- 🔄 **Smooth Transitions**: Graceful transition from fallback to custom fonts
- 🛡️ **Error Handling**: Falls back to system fonts if Google Font fails to load
- 🧩 **Extends Title**: Inherits all Mantine Title component props
- 📱 **Responsive**: Works seamlessly across all device sizes
- 🎯 **TypeScript**: Full type safety and IntelliSense support
- 🧹 **Memory Safe**: Proper cleanup to prevent memory leaks

## Installation

The component uses the existing Google Fonts utilities in your project. Make sure you have:

```bash
npm install @mantine/core @tabler/icons-react
```

## Basic Usage

```tsx
import { StyledTitle } from '@/components/StyledTitle';

function MyComponent() {
  return (
    <StyledTitle 
      title="Welcome to Music Platform" 
      fontName="Playfair Display"
      order={1}
    />
  );
}
```

## Advanced Usage

```tsx
import { StyledTitle } from '@/components/StyledTitle';

function AdvancedExample() {
  return (
    <StyledTitle 
      title="Custom Styled Header"
      fontName="Inter"
      fontWeights={['400', '600', '700']}
      fontDisplay="swap"
      fallbackFont="system-ui, sans-serif"
      transitionDuration={500}
      order={2}
      size="h2"
      c="blue"
      ta="center"
    />
  );
}
```

## Props

### StyledTitle Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | *required* | The text content to display |
| `fontName` | `string` | *required* | The Google Font family name |
| `fontWeights` | `string[]` | `['400', '600', '700']` | Font weights to load |
| `fontDisplay` | `'auto' \| 'block' \| 'swap' \| 'fallback' \| 'optional'` | `'swap'` | Font display strategy |
| `fallbackFont` | `string` | `'sans-serif'` | Fallback font stack |
| `transitionDuration` | `number` | `300` | Loading transition duration (ms) |

### Inherited Props

All [Mantine Title props](https://mantine.dev/core/title/) are supported:

- `order` - Heading level (1-6)
- `size` - Title size
- `c` - Text color
- `ta` - Text alignment
- `fw` - Font weight
- `tt` - Text transform
- `style` - Custom styles
- And more...

## Examples

### Different Font Styles

```tsx
// Elegant serif for headers
<StyledTitle 
  title="Elegant Header"
  fontName="Playfair Display"
  order={1}
  c="dark"
/>

// Modern sans-serif for content
<StyledTitle 
  title="Clean Modern Text"
  fontName="Inter"
  order={3}
  c="gray"
/>

// Playful script for special occasions
<StyledTitle 
  title="Artistic Touch"
  fontName="Dancing Script"
  order={2}
  c="violet"
/>

// Bold display for impact
<StyledTitle 
  title="MAKE AN IMPACT"
  fontName="Bebas Neue"
  order={1}
  tt="uppercase"
  c="red"
/>
```

### Loading States

The component automatically handles loading states:

1. **Initial State**: Shows content with fallback font at 90% opacity
2. **Loading**: Font is being fetched from Google Fonts
3. **Loaded**: Transitions to custom font at 100% opacity
4. **Error**: Falls back to system font if loading fails

### Custom Font Weights

```tsx
<StyledTitle 
  title="Custom Weight Loading"
  fontName="Roboto"
  fontWeights={['300', '400', '500', '700', '900']}
  order={2}
/>
```

### Performance Options

```tsx
<StyledTitle 
  title="Optimized Loading"
  fontName="Open Sans"
  fontDisplay="optional" // Won't block rendering
  transitionDuration={150} // Faster transition
  order={3}
/>
```

## Font Display Strategies

- `swap` (default): Shows fallback immediately, swaps when custom font loads
- `block`: Hides text briefly while font loads, then shows with custom font
- `fallback`: Shows fallback immediately, swaps if font loads quickly
- `optional`: Only uses custom font if it loads very quickly
- `auto`: Browser decides the strategy

## Browser Support

- ✅ All modern browsers
- ✅ Progressive enhancement
- ✅ Graceful degradation

## Performance Considerations

- Fonts are cached after first load
- Multiple components using the same font share the loaded resource
- Automatic cleanup prevents memory leaks
- Efficient font loading using Google Fonts CDN

## Troubleshooting

### Font Not Loading

1. Check the font name spelling (case-sensitive)
2. Verify the font exists in Google Fonts catalog
3. Check browser developer tools for network errors
4. Ensure font weights are available for the chosen font

### Slow Loading

1. Reduce the number of font weights
2. Use `fontDisplay="optional"` for non-critical text
3. Preload important fonts in your HTML `<head>`

### TypeScript Errors

The component is fully typed. If you see TypeScript errors:

1. Ensure you're using the correct prop names
2. Check that font names are strings
3. Verify font weights are string arrays

## Demo

See `StyledTitleDemo.tsx` for a comprehensive interactive demo showing all features and use cases.

## Related

- [Google Fonts Utils](/lib/google-fonts.ts) - Core font loading utilities
- [Mantine Title](https://mantine.dev/core/title/) - Base component
- [FontSelect Component](/components/FontSelect/) - Font picker component
