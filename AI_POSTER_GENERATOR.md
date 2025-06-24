# AI Poster Generator for Events

The AI Poster Generator allows event organizers to automatically create professional event posters using artificial intelligence. The system supports multiple AI services and provides customizable design options.

## Features

- **Multiple AI Services**: Support for OpenAI DALL-E, Stability AI, and Midjourney
- **Design Styles**: Modern, Vintage, Minimalist, and Bold styles
- **Color Schemes**: Vibrant, Monochrome, Pastel, and Dark color options
- **Custom Prompts**: Add specific instructions for poster generation
- **High Resolution**: Generates print-ready posters (800x1200px minimum)
- **Download Support**: Direct download of generated posters

## Setup

### Environment Variables

Add the following environment variables to your `.env.local` file:

```bash
# Choose your AI service (openai, stability, midjourney, or placeholder)
AI_POSTER_SERVICE=openai

# API Keys (add the ones you need)
OPENAI_API_KEY=your_openai_api_key_here
STABILITY_API_KEY=your_stability_ai_key_here

# Optional: Custom settings
POSTER_DEFAULT_STYLE=modern
POSTER_DEFAULT_COLOR=vibrant
```

### Supported AI Services

#### OpenAI DALL-E 3
- **Pros**: High quality, good at following prompts, reliable
- **Cons**: Costs per generation, rate limits
- **Setup**: Get API key from OpenAI platform
- **Cost**: ~$0.04 per image

#### Stability AI
- **Pros**: Good customization options, relatively affordable
- **Cons**: Requires technical setup, varying quality
- **Setup**: Get API key from Stability AI
- **Cost**: ~$0.01-0.05 per image

#### Midjourney
- **Pros**: Excellent artistic quality
- **Cons**: Requires Discord bot setup, more complex integration
- **Setup**: Custom Discord bot integration required
- **Cost**: Subscription-based

## Usage

### Basic Usage

1. Navigate to any event detail page
2. Scroll to the "AI Poster Generator" section
3. Select your preferred style and color scheme
4. Click "Generate Poster"
5. Download the generated poster

### Advanced Usage

#### Custom Prompts

Use custom prompts to add specific requirements:

```
Include neon lights, cyberpunk theme, featuring electronic music elements
```

```
Watercolor style, outdoor festival vibe, include trees and mountains
```

```
Art deco style, gold and black colors, elegant and sophisticated
```

#### Style Guidelines

- **Modern**: Clean, contemporary design with geometric elements
- **Vintage**: Retro typography with distressed textures
- **Minimalist**: Simple, elegant design with lots of white space
- **Bold**: High contrast, strong typography, eye-catching

#### Color Scheme Tips

- **Vibrant**: Best for energetic events, festivals, concerts
- **Monochrome**: Professional, elegant, timeless
- **Pastel**: Soft, approachable, good for acoustic or indie events
- **Dark**: Dramatic, good for electronic music, nighttime events

## API Reference

### Server Action: `generateEventPoster`

```typescript
import { generateEventPoster } from '@/app/events/[eventName]/poster-actions';

const result = await generateEventPoster({
  eventName: "Summer Music Festival",
  date: "2024-07-15",
  venue: "Central Park",
  artists: ["Artist One", "Artist Two"],
  style: "modern",
  colorScheme: "vibrant",
  customPrompt: "Include festival vibes with outdoor elements"
});
```

### Parameters

- `eventName` (required): Name of the event
- `date` (optional): Event date
- `venue` (optional): Venue name or address
- `artists` (optional): Array of artist names
- `style` (optional): Design style (modern, vintage, minimalist, bold)
- `colorScheme` (optional): Color scheme (vibrant, monochrome, pastel, dark)
- `customPrompt` (optional): Additional instructions

### Response

```typescript
{
  success: boolean;
  posterUrl?: string;
  prompt?: string;
  error?: string;
  metadata?: {
    style: string;
    colorScheme: string;
    generatedAt: string;
  };
}
```

## Component Usage

### PosterGenerator Component

```tsx
import { PosterGenerator } from '@/components/events/PosterGenerator';

<PosterGenerator event={event} />
```

The component automatically handles:
- Style and color scheme selection
- Custom prompt input
- Generation progress
- Error handling
- Download functionality

## Troubleshooting

### Common Issues

1. **"Failed to generate poster"**
   - Check API key configuration
   - Verify AI service is available
   - Check rate limits

2. **Poor poster quality**
   - Try different style combinations
   - Add more specific custom prompts
   - Use higher quality AI service

3. **Generation timeout**
   - AI services can be slow (30-60 seconds)
   - Check network connectivity
   - Try again with simpler prompts

### Development Mode

For development, the system falls back to placeholder images when AI services aren't configured. Set `AI_POSTER_SERVICE=placeholder` to use this mode.

## Best Practices

1. **Prompt Writing**
   - Be specific about visual elements
   - Include mood and atmosphere descriptions
   - Mention specific colors or themes

2. **Style Selection**
   - Match style to event type
   - Consider target audience
   - Test different combinations

3. **Performance**
   - Generate posters during off-peak hours
   - Cache successful generations
   - Provide fallback options

## Future Enhancements

- [ ] Poster template system
- [ ] Batch generation for multiple events
- [ ] A/B testing for different styles
- [ ] Integration with social media platforms
- [ ] Custom branding options
- [ ] Historical poster gallery

## Support

For issues or questions about the AI poster generator, check:
- Environment variable configuration
- AI service documentation
- Component error messages
- Browser console for debugging information
