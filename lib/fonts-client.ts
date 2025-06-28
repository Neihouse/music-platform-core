/**
 * Client-side Font Loading Utilities
 * 
 * These utilities handle loading fonts in the browser without exposing API keys.
 * They work with the secure server actions for font discovery.
 */

'use client';

export interface ClientFontLoadResult {
  success: boolean;
  error?: string;
}

/**
 * Load a font dynamically in the browser using CDN
 * This is safe - it only loads CSS, no API keys involved
 */
export async function loadFont(
  fontFamily: string,
  options: {
    weights?: string[];
    subsets?: string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  } = {}
): Promise<ClientFontLoadResult> {
  try {
    const {
      weights = ['400'],
      subsets = ['latin'],
      display = 'swap'
    } = options;

    // Check if font is already loaded
    const fontId = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
    const existingLink = document.querySelector(`link[data-font-id="${fontId}"]`);
    
    if (existingLink) {
      return { success: true };
    }

    // Generate CDN URL with proper encoding
    // Google Fonts API expects specific encoding - don't double-encode
    const familyParam = `${fontFamily}:wght@${weights.join(';')}`;
    
    const params = new URLSearchParams();
    params.append('family', familyParam);
    params.append('subset', subsets.join(','));
    params.append('display', display);

    const cdnUrl = `https://fonts.googleapis.com/css2?${params.toString()}`;

    // Create and load the font
    return new Promise((resolve) => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = cdnUrl;
      link.setAttribute('data-font-id', fontId);
      link.crossOrigin = 'anonymous'; // Add CORS support
      
      link.onload = () => resolve({ success: true });
      link.onerror = () => resolve({ 
        success: false, 
        error: `Failed to load font: ${fontFamily}` 
      });
      
      document.head.appendChild(link);
    });
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

/**
 * Check if a font family is already loaded
 */
export function isFontLoaded(fontFamily: string): boolean {
  const fontId = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  return !!document.querySelector(`link[data-font-id="${fontId}"]`);
}

/**
 * Preload multiple fonts
 */
export async function preloadFonts(
  fonts: Array<{
    family: string;
    weights?: string[];
  }>
): Promise<ClientFontLoadResult[]> {
  const loadPromises = fonts.map(font => 
    loadFont(font.family, { weights: font.weights })
  );
  
  return Promise.all(loadPromises);
}

/**
 * Remove a loaded font from the document
 */
export function unloadFont(fontFamily: string): boolean {
  const fontId = `font-${fontFamily.replace(/\s+/g, '-').toLowerCase()}`;
  const link = document.querySelector(`link[data-font-id="${fontId}"]`);
  
  if (link) {
    link.remove();
    return true;
  }
  
  return false;
}
