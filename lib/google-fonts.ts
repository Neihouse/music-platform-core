/**
 * Google Fonts API Utilities
 * 
 * Functions for interacting with the Google Fonts API to search fonts
 * and generate CDN URLs for loading fonts in the browser.
 */

import { GoogleFont, GoogleFontsResponse } from '@/components/FontSelect';

export interface FontCDNOptions {
  weights?: string[]; // Font weights to include (e.g., ['400', '500', '700'])
  subsets?: string[]; // Font subsets to include (e.g., ['latin', 'latin-ext'])
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional'; // Font display strategy
  format?: 'css' | 'css2'; // CSS API version to use
}

export interface FontSearchResult {
  font: GoogleFont | null;
  cdnUrl: string | null;
  error?: string;
}

/**
 * Search for a specific font by name using the Google Fonts API
 * and return the font data along with its CDN URL.
 * 
 * @param fontName - The name of the font to search for (case-insensitive)
 * @param apiKey - Google Fonts API key
 * @param options - Options for generating the CDN URL
 * @returns Promise with font data and CDN URL
 */
export async function searchFont(
  fontName: string,
  apiKey: string,
  options: FontCDNOptions = {}
): Promise<FontSearchResult> {
  try {
    if (!fontName.trim()) {
      return { font: null, cdnUrl: null, error: 'Font name is required' };
    }

    if (!apiKey) {
      return { font: null, cdnUrl: null, error: 'API key is required' };
    }

    // Search for the specific font family
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&family=${encodeURIComponent(fontName)}`
    );

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    const data: GoogleFontsResponse = await response.json();
    
    // Find exact match (case-insensitive)
    const font = data.items?.find(
      item => item.family.toLowerCase() === fontName.toLowerCase()
    );

    if (!font) {
      return { 
        font: null, 
        cdnUrl: null, 
        error: `Font "${fontName}" not found in Google Fonts` 
      };
    }

    // Generate CDN URL
    const cdnUrl = generateFontCDNUrl(font.family, {
      weights: options.weights || ['400'], // Default to regular weight
      subsets: options.subsets || ['latin'], // Default to latin subset
      display: options.display || 'swap', // Default to swap for better performance
      format: options.format || 'css2', // Default to CSS2 API
    });

    return { font, cdnUrl };
  } catch (error) {
    return { 
      font: null, 
      cdnUrl: null, 
      error: error instanceof Error ? error.message : 'Unknown error occurred' 
    };
  }
}

/**
 * Generate a Google Fonts CDN URL for loading a font
 * 
 * @param fontFamily - The font family name
 * @param options - Options for the CDN URL
 * @returns The complete CDN URL
 */
export function generateFontCDNUrl(
  fontFamily: string,
  options: FontCDNOptions = {}
): string {
  const {
    weights = ['400'],
    subsets = ['latin'],
    display = 'swap',
    format = 'css2'
  } = options;

  // Encode the font family name
  const encodedFamily = fontFamily.replace(/\s+/g, '+');
  
  // Build the base URL
  const baseUrl = format === 'css2' 
    ? 'https://fonts.googleapis.com/css2'
    : 'https://fonts.googleapis.com/css';

  // Build query parameters
  const params = new URLSearchParams();
  
  if (format === 'css2') {
    // CSS2 format: family=Family+Name:wght@400;700
    const weightString = weights.join(';');
    params.append('family', `${encodedFamily}:wght@${weightString}`);
  } else {
    // CSS format: family=Family+Name:400,700
    const weightString = weights.join(',');
    params.append('family', `${encodedFamily}:${weightString}`);
  }

  // Add subsets if specified
  if (subsets.length > 0) {
    params.append('subset', subsets.join(','));
  }

  // Add display strategy
  params.append('display', display);

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Search for multiple fonts and return their CDN URLs
 * 
 * @param fontNames - Array of font names to search for
 * @param apiKey - Google Fonts API key  
 * @param options - Options for generating CDN URLs
 * @returns Promise with results for each font
 */
export async function searchMultipleFonts(
  fontNames: string[],
  apiKey: string,
  options: FontCDNOptions = {}
): Promise<FontSearchResult[]> {
  if (!Array.isArray(fontNames) || fontNames.length === 0) {
    return [];
  }

  // Execute searches in parallel for better performance
  const searchPromises = fontNames.map(fontName => 
    searchFont(fontName, apiKey, options)
  );

  return Promise.all(searchPromises);
}

/**
 * Generate a combined CDN URL for multiple fonts
 * This is more efficient than loading multiple separate URLs
 * 
 * @param fontConfigs - Array of font configurations
 * @param options - Global options for the CDN URL
 * @returns Combined CDN URL
 */
export function generateMultiFontCDNUrl(
  fontConfigs: Array<{
    family: string;
    weights?: string[];
  }>,
  options: Omit<FontCDNOptions, 'weights'> = {}
): string {
  const {
    subsets = ['latin'],
    display = 'swap',
    format = 'css2'
  } = options;

  if (fontConfigs.length === 0) {
    throw new Error('At least one font configuration is required');
  }

  const baseUrl = format === 'css2' 
    ? 'https://fonts.googleapis.com/css2'
    : 'https://fonts.googleapis.com/css';

  const params = new URLSearchParams();

  // Add each font family
  fontConfigs.forEach(config => {
    const encodedFamily = config.family.replace(/\s+/g, '+');
    const weights = config.weights || ['400'];
    
    if (format === 'css2') {
      const weightString = weights.join(';');
      params.append('family', `${encodedFamily}:wght@${weightString}`);
    } else {
      const weightString = weights.join(',');
      params.append('family', `${encodedFamily}:${weightString}`);
    }
  });

  // Add subsets if specified
  if (subsets.length > 0) {
    params.append('subset', subsets.join(','));
  }

  // Add display strategy
  params.append('display', display);

  return `${baseUrl}?${params.toString()}`;
}

/**
 * Load a font dynamically in the browser
 * 
 * @param fontFamily - The font family name
 * @param options - Options for the font loading
 * @returns Promise that resolves when the font is loaded
 */
export function loadFontDynamically(
  fontFamily: string,
  options: FontCDNOptions = {}
): Promise<void> {
  return new Promise((resolve, reject) => {
    // Check if font is already loaded
    const existingLink = document.querySelector(
      `link[href*="${fontFamily.replace(/\s+/g, '+')}"]`
    );
    
    if (existingLink) {
      resolve();
      return;
    }

    // Create and append the link element
    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = generateFontCDNUrl(fontFamily, options);
    
    link.onload = () => resolve();
    link.onerror = () => reject(new Error(`Failed to load font: ${fontFamily}`));
    
    document.head.appendChild(link);
  });
}

/**
 * Check if a font is available in Google Fonts (without API key)
 * This uses a simpler approach by attempting to load the font
 * 
 * @param fontFamily - The font family name to check
 * @returns Promise that resolves to true if font exists
 */
export async function isFontAvailable(fontFamily: string): Promise<boolean> {
  try {
    await loadFontDynamically(fontFamily, { weights: ['400'] });
    return true;
  } catch {
    return false;
  }
}
