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

// Cached function to fetch all fonts from Google Fonts API
// Using React cache for proper serverless memoization
const getCachedFonts = cache(async (): Promise<FontsSearchResult> => {
  try {
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        fonts: [],
        error: 'Google Fonts API key not configured'
      };
    }

    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
      {
        // Use Next.js Data Cache with revalidation every hour and cache tags
        next: { 
          revalidate: 3600, // 1 hour
          tags: ['google-fonts']
        }
      }
    );
    
    if (!response.ok) {
      return {
        success: false,
        fonts: [],
        error: `Google Fonts API error: ${response.status}`
      };
    }

    const data = await response.json();
    const fonts = (data.items || []).map((item: any) => ({
      family: item.family,
      variants: item.variants || [],
      subsets: item.subsets || [],
      category: item.category || 'sans-serif',
      files: item.files || {}
    }));

    return {
      success: true,
      fonts
    };
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: error instanceof Error ? error.message : 'Failed to fetch fonts'
    };
  }
});

// Server action to search for a single font
export async function searchFont(fontName: string): Promise<FontSearchResult> {
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

    // Use cached fonts
    const fontsResult = await getCachedFonts();
    
    if (!fontsResult.success) {
      return {
        success: false,
        error: fontsResult.error
      };
    }
      
    // Find exact match (case-insensitive)
    let font = fontsResult.fonts.find(
      (item: any) => item.family.toLowerCase() === fontName.toLowerCase()
    );

    // If no exact match, try partial match
    if (!font) {
      font = fontsResult.fonts.find(
        (item: any) => item.family.toLowerCase().includes(fontName.toLowerCase())
      );
    }

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
      error: error instanceof Error ? error.message : 'Unknown error occurred'
    };
  }
}

// Server action to get popular fonts
export async function getPopularFonts(limit: number = 50): Promise<FontsSearchResult> {
  try {
    const fontsResult = await getCachedFonts();
    
    if (!fontsResult.success) {
      return fontsResult;
    }

    const fonts = fontsResult.fonts.slice(0, limit);

    return {
      success: true,
      fonts
    };
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: error instanceof Error ? error.message : 'Failed to fetch fonts'
    };
  }
}

// Server action to search fonts by query
export async function searchFonts(query: string, limit: number = 20): Promise<FontsSearchResult> {
  try {
    if (!query.trim()) {
      return {
        success: false,
        fonts: [],
        error: 'Search query is required'
      };
    }

    const fontsResult = await getCachedFonts();
    
    if (!fontsResult.success) {
      return fontsResult;
    }

    const searchTerm = query.toLowerCase().trim();

    // Sort by relevance: exact matches first, then starts with, then contains
    const exactMatches = fontsResult.fonts.filter((font: GoogleFont) =>
      font.family.toLowerCase() === searchTerm
    );

    const startsWithMatches = fontsResult.fonts.filter((font: GoogleFont) =>
      font.family.toLowerCase() !== searchTerm && 
      font.family.toLowerCase().startsWith(searchTerm)
    );

    const containsMatches = fontsResult.fonts.filter((font: GoogleFont) =>
      !font.family.toLowerCase().startsWith(searchTerm) &&
      font.family.toLowerCase().includes(searchTerm)
    );

    // Combine results in order of relevance
    const allMatches = [...exactMatches, ...startsWithMatches, ...containsMatches];
    const filteredFonts = allMatches.slice(0, limit);

    return {
      success: true,
      fonts: filteredFonts
    };
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: error instanceof Error ? error.message : 'Search failed'
    };
  }
}

// Debug function to check font availability and get search suggestions
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
    const fontsResult = await getCachedFonts();
    
    if (!fontsResult.success) {
      return {
        success: false,
        found: false,
        partialMatches: [],
        suggestions: [],
        totalFontsAvailable: 0,
        error: fontsResult.error
      };
    }

    const searchTerm = fontName.toLowerCase().trim();
    const allFonts = fontsResult.fonts;

    // Find exact match
    const exactMatch = allFonts.find((font: GoogleFont) =>
      font.family.toLowerCase() === searchTerm
    );

    // Find partial matches
    const partialMatches = allFonts.filter((font: GoogleFont) =>
      font.family.toLowerCase().includes(searchTerm) &&
      font.family.toLowerCase() !== searchTerm
    ).slice(0, 10);

    // Find similar fonts (for suggestions)
    const suggestions = allFonts.filter((font: GoogleFont) => {
      const fontFamily = font.family.toLowerCase();
      // Look for fonts that share words or similar patterns
      const searchWords = searchTerm.split(/\s+/);
      return searchWords.some(word => 
        word.length > 2 && fontFamily.includes(word)
      ) && !fontFamily.includes(searchTerm);
    }).slice(0, 5);

    return {
      success: true,
      found: !!exactMatch,
      exactMatch,
      partialMatches,
      suggestions,
      totalFontsAvailable: allFonts.length
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
export async function refreshFontCache(): Promise<FontsSearchResult> {
  try {
    // Revalidate the cache tag to trigger a fresh fetch
    revalidateTag('google-fonts');
    
    // Return the fresh data
    return await getCachedFonts();
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: error instanceof Error ? error.message : 'Failed to refresh font cache'
    };
  }
}
