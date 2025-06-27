/**
 * Google Fonts Utilities - Usage Examples
 * 
 * This file demonstrates how to use the Google Fonts utilities
 * in various scenarios within your application.
 */

import { 
  searchFont, 
  generateFontCDNUrl, 
  searchMultipleFonts,
  generateMultiFontCDNUrl,
  loadFontDynamically,
  isFontAvailable 
} from './google-fonts';

// Example usage functions

/**
 * Search for a single font and get its CDN URL
 */
export async function searchSingleFontExample() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY || '';
  
  const result = await searchFont('Inter', apiKey, {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin', 'latin-ext'],
    display: 'swap'
  });

  if (result.error) {
    console.error('Font search failed:', result.error);
    return null;
  }

  console.log('Font found:', result.font?.family);
  console.log('CDN URL:', result.cdnUrl);
  
  return result;
}

/**
 * Generate CDN URL without API call (when you know the font exists)
 */
export function generateCDNUrlExample() {
  const cdnUrl = generateFontCDNUrl('Roboto', {
    weights: ['300', '400', '500', '700'],
    subsets: ['latin'],
    display: 'swap',
    format: 'css2'
  });

  console.log('Generated CDN URL:', cdnUrl);
  return cdnUrl;
}

/**
 * Search for multiple fonts at once
 */
export async function searchMultipleFontsExample() {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_FONTS_API_KEY || '';
  const fontNames = ['Inter', 'Roboto', 'Open Sans', 'Playfair Display'];

  const results = await searchMultipleFonts(fontNames, apiKey, {
    weights: ['400', '600', '700'],
    display: 'swap'
  });

  results.forEach((result, index) => {
    if (result.error) {
      console.error(`${fontNames[index]} failed:`, result.error);
    } else {
      console.log(`${fontNames[index]}:`, result.cdnUrl);
    }
  });

  return results;
}

/**
 * Generate a combined CDN URL for multiple fonts
 */
export function generateMultiFontCDNExample() {
  const fontConfigs = [
    { family: 'Inter', weights: ['400', '500', '600'] },
    { family: 'Playfair Display', weights: ['400', '700'] },
    { family: 'JetBrains Mono', weights: ['400', '500'] }
  ];

  const combinedUrl = generateMultiFontCDNUrl(fontConfigs, {
    subsets: ['latin'],
    display: 'swap'
  });

  console.log('Combined CDN URL:', combinedUrl);
  return combinedUrl;
}

/**
 * Dynamically load a font in the browser
 */
export async function loadFontExample() {
  try {
    await loadFontDynamically('Poppins', {
      weights: ['400', '600'],
      display: 'swap'
    });
    
    console.log('Poppins font loaded successfully!');
    
    // Now you can use the font
    const element = document.createElement('div');
    element.style.fontFamily = '"Poppins", sans-serif';
    element.textContent = 'This text uses Poppins font!';
    
    return true;
  } catch (error) {
    console.error('Failed to load font:', error);
    return false;
  }
}

/**
 * Check if a font is available
 */
export async function checkFontAvailabilityExample() {
  const isAvailable = await isFontAvailable('Montserrat');
  
  if (isAvailable) {
    console.log('Montserrat is available and loaded!');
  } else {
    console.log('Montserrat is not available');
  }
  
  return isAvailable;
}

/**
 * React component example using the utilities
 * Note: This would need to be in a .tsx file to work properly
 */
/*
export function FontLoaderComponent({ fontFamily, children }: { 
  fontFamily: string; 
  children: React.ReactNode; 
}) {
  const [fontLoaded, setFontLoaded] = React.useState(false);
  
  React.useEffect(() => {
    loadFontDynamically(fontFamily, {
      weights: ['400', '500', '600'],
      display: 'swap'
    })
    .then(() => setFontLoaded(true))
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
 * Next.js API route example
 */
export async function fontSearchAPIExample(fontName: string) {
  const apiKey = process.env.GOOGLE_FONTS_API_KEY; // Server-side env var
  
  if (!apiKey) {
    return { error: 'Google Fonts API key not configured' };
  }

  const result = await searchFont(fontName, apiKey, {
    weights: ['400', '500', '600', '700'],
    subsets: ['latin'],
    display: 'swap'
  });

  return {
    success: !result.error,
    font: result.font,
    cdnUrl: result.cdnUrl,
    error: result.error
  };
}
