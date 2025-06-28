/**
 * Google Fonts Utilities - Usage Examples
 * 
 * This file demonstrates how to use the secure Google Fonts utilities
 * in various scenarios within your application.
 */

import { 
  searchFonts, 
  getPopularFonts,
  searchFont,
  generateFontCDNUrl 
} from './fonts-secure';
import { loadFont } from './fonts-client';

// Example usage functions

/**
 * Search for fonts using secure server actions
 */
export async function searchFontsExample() {
  const result = await searchFonts('Inter', 10);

  if (!result.success) {
    console.error('Font search failed:', result.error);
    return null;
  }

  console.log('Fonts found:', result.fonts.map(f => f.family));
  
  return result.fonts;
}

/**
 * Get a specific font using secure server actions
 */
export async function getSingleFontExample() {
  const result = await searchFont('Roboto');

  if (!result.success || !result.font) {
    console.error('Font not found:', result.error);
    return null;
  }

  console.log('Font found:', result.font.family);
  console.log('Variants:', result.font.variants);
  
  return result.font;
}

/**
 * Generate CDN URL without API call (when you know the font exists)
 */
export function generateCDNUrlExample() {
  const cdnUrl = generateFontCDNUrl('Roboto', {
    weights: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap'
  });

  console.log('CDN URL:', cdnUrl);
  return cdnUrl;
}
/**
 * Get popular fonts using secure server actions
 */
export async function getPopularFontsExample() {
  const result = await getPopularFonts(20);

  if (!result.success) {
    console.error('Failed to get popular fonts:', result.error);
    return [];
  }

  console.log('Popular fonts:', result.fonts.map(f => f.family));
  return result.fonts;
}

/**
 * Dynamically load a font in the browser (client-side)
 */
export async function loadFontExample() {
  try {
    const result = await loadFont('Poppins', {
      weights: ['400', '600'],
      display: 'swap'
    });
    
    if (result.success) {
      console.log('Poppins font loaded successfully!');
      
      // Now you can use the font
      const element = document.createElement('div');
      element.style.fontFamily = '"Poppins", sans-serif';
      element.textContent = 'This text uses Poppins font!';
      
      return true;
    } else {
      console.error('Failed to load font:', result.error);
      return false;
    }
  } catch (error) {
    console.error('Failed to load font:', error);
    return false;
  }
}

/**
 * React component example using the secure utilities
 * Note: This would need to be in a .tsx file to work properly
 */
/*
export function SecureFontLoaderComponent({ fontFamily, children }: { 
  fontFamily: string; 
  children: React.ReactNode; 
}) {
  const [fontLoaded, setFontLoaded] = React.useState(false);
  
  React.useEffect(() => {
    loadFont(fontFamily, {
      weights: ['400', '500', '600'],
      display: 'swap'
    })
    .then((result) => {
      if (result.success) {
        setFontLoaded(true);
      }
    })
    .catch(console.error);
  }, [fontFamily]);

  return (
    <div 
      style={{ 
        fontFamily: fontLoaded ? `"${fontFamily}", sans-serif` : 'inherit',
        opacity: fontLoaded ? 1 : 0.7,
        transition: 'opacity 0.3s ease'
      }}
    >
      {children}
    </div>
  );
}
*/

/**
 * Server action usage example (for server components)
 */
export async function serverComponentFontExample() {
  // This would be called in a server component
  const popularFonts = await getPopularFonts(10);
  
  if (popularFonts.success) {
    return popularFonts.fonts.map(font => ({
      name: font.family,
      category: font.category,
      variants: font.variants.length
    }));
  }
  
  return [];
}
