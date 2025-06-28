/**
 * Secure Font Loading System
 * 
 * This system provides secure font operations without exposing API keys to the frontend.
 * All Google Fonts API calls are handled server-side via server actions.
 * 
 * Caching Strategy:
 * - Uses React cache() function for per-request memoization
 * - Uses Next.js Data Cache with 1-hour revalidation for persistent caching
 * - Cache tags allow for manual invalidation via revalidateTag
 * - Works properly in serverless environments
 */

'use server';

import { cache } from 'react';
import { revalidateTag } from 'next/cache';

// Core types
export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting';
  files: Record<string, string>;
}

export interface FontSearchResult {
  success: boolean;
  font?: GoogleFont;
  cdnUrl?: string;
  error?: string;
}

export interface FontsSearchResult {
  success: boolean;
  fonts: GoogleFont[];
  error?: string;
}

// Cached function to fetch individual font by name from Google Fonts API
// Using React cache for proper serverless memoization
const getCachedFont = cache(async (fontName: string): Promise<FontSearchResult> => {
  try {
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        error: 'Google Fonts API key not configured'
      };
    }

    if (!fontName.trim()) {
      return {
        success: false,
        error: 'Font name is required'
      };
    }

    // Use a much smaller, individual font query instead of fetching all fonts
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&family=${encodeURIComponent(fontName)}`,
      {
        // Use Next.js Data Cache with revalidation every day for individual fonts
        next: { 
          revalidate: 86400, // 24 hours
          tags: [`google-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`]
        }
      }
    );
    
    if (!response.ok) {
      return {
        success: false,
        error: `Google Fonts API error: ${response.status}`
      };
    }

    const data = await response.json();
    const font = data.items?.[0];

    if (!font) {
      return {
        success: false,
        error: `Font "${fontName}" not found in Google Fonts`
      };
    }

    // Generate CDN URL
    const cdnUrl = await generateFontCDNUrl(font.family, {
      weights: font.variants.filter((v: string) => !v.includes('italic')).slice(0, 4),
      display: 'swap'
    });

    return {
      success: true,
      font: {
        family: font.family,
        variants: font.variants || [],
        subsets: font.subsets || [],
        category: font.category || 'sans-serif',
        files: font.files || {}
      },
      cdnUrl
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to fetch font'
    };
  }
});



// Server action to search for a single font
export async function searchFont(fontName: string): Promise<FontSearchResult> {
  try {
    if (!fontName.trim()) {
      return {
        success: false,
        error: 'Font name is required'
      };
    }

    // Use cached individual font lookup instead of fetching all fonts
    return await getCachedFont(fontName);
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Note: getPopularFonts function - returns 10 random fonts from a curated list
export async function getPopularFonts(limit: number = 10): Promise<FontsSearchResult> {
  try {
    // Curated list of popular fonts
    const popularFontNames = [
      'Inter', 'Roboto', 'Open Sans', 'Lato', 'Montserrat', 
      'Poppins', 'Playfair Display', 'Source Sans Pro', 'Nunito', 'Raleway',
      'Merriweather', 'Oswald', 'Ubuntu', 'PT Sans', 'Libre Baskerville',
      'Fira Sans', 'Work Sans', 'Crimson Text', 'DM Sans', 'Space Grotesk',
      'JetBrains Mono', 'Inconsolata', 'Roboto Mono', 'Source Code Pro', 'IBM Plex Mono'
    ];

    // Shuffle array and take the requested number of fonts (default 10)
    const shuffled = [...popularFontNames].sort(() => 0.5 - Math.random());
    const selectedFonts = shuffled.slice(0, Math.min(limit, popularFontNames.length));

    // Fetch all selected fonts
    const fontPromises = selectedFonts.map(fontName => getCachedFont(fontName));
    const results = await Promise.all(fontPromises);

    // Filter successful results and extract fonts
    const fonts: GoogleFont[] = results
      .filter(result => result.success && result.font)
      .map(result => result.font!)
      .slice(0, 10); // Ensure we only return 10 fonts max

    return {
      success: true,
      fonts
    };
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: error instanceof Error ? error.message : 'Failed to fetch popular fonts'
    };
  }
}

// Server action to search fonts by query - only does exact font name lookup
export async function searchFonts(query: string, limit: number = 20): Promise<FontsSearchResult> {
  try {
    if (!query.trim()) {
      return {
        success: false,
        fonts: [],
        error: 'Search query is required'
      };
    }

    // Only try exact match for the font name
    const result = await getCachedFont(query);
    
    if (result.success && result.font) {
      return {
        success: true,
        fonts: [result.font]
      };
    } else {
      return {
        success: false,
        fonts: [],
        error: result.error || `Font "${query}" not found`
      };
    }
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: error instanceof Error ? error.message : 'Search failed'
    };
  }
}

// Debug function to check font availability - simplified to only check exact match
export async function debugFontSearch(fontName: string): Promise<{
  success: boolean;
  found: boolean;
  exactMatch?: GoogleFont;
  partialMatches: GoogleFont[];
  suggestions: GoogleFont[];
  totalFontsAvailable: number;
  error?: string;
}> {
  try {
    // Try exact match only
    const exactResult = await getCachedFont(fontName);
    const exactMatch = exactResult.success ? exactResult.font : undefined;

    return {
      success: true,
      found: !!exactMatch,
      exactMatch,
      partialMatches: [], // No partial matches - would require full font list
      suggestions: [], // No suggestions - would require full font list
      totalFontsAvailable: 0 // Unknown - we don't fetch all fonts
    };
  } catch (error) {
    return {
      success: false,
      found: false,
      partialMatches: [],
      suggestions: [],
      totalFontsAvailable: 0,
      error: error instanceof Error ? error.message : 'Debug search failed'
    };
  }
}

// Utility function to generate CDN URLs (no API key needed)
export async function generateFontCDNUrl(
  fontFamily: string,
  options: {
    weights?: string[];
    subsets?: string[];
    display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  } = {}
): Promise<string> {
  const {
    weights = ['400'],
    subsets = ['latin'],
    display = 'swap'
  } = options;

  const encodedFamily = encodeURIComponent(fontFamily);
  const weightString = weights.join(';');
  
  const params = new URLSearchParams();
  params.append('family', `${encodedFamily}:wght@${weightString}`);
  params.append('subset', subsets.join(','));
  params.append('display', display);

  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}

// Function to manually refresh the font cache using revalidateTag
export async function refreshFontCache(fontName?: string): Promise<FontsSearchResult> {
  try {
    if (fontName) {
      // Revalidate specific font cache
      revalidateTag(`google-font-${fontName.toLowerCase().replace(/\s+/g, '-')}`);
    } else {
      // Revalidate all font caches (though this won't be very useful now)
      revalidateTag('google-fonts');
    }
    
    return {
      success: true,
      fonts: [],
      error: 'Cache refreshed. Specific fonts will be refetched on next request.'
    };
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: error instanceof Error ? error.message : 'Failed to refresh font cache'
    };
  }
}
