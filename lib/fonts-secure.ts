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

// Enhanced interface for indexed fonts to improve search performance
interface IndexedFont extends GoogleFont {
  familyLower: string; // Cached lowercase version
  searchableText: string; // Cached searchable text
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
const getCachedAllFonts = cache(async (): Promise<GoogleFont[]> => {
  try {
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    
    if (!apiKey) {
      throw new Error('Google Fonts API key not configured');
    }

    // Fetch all fonts from Google Fonts API
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`,
      {
        // Use Next.js Data Cache with revalidation every day for all fonts
        next: { 
          revalidate: 86400, // 24 hours
          tags: ['google-fonts-all']
        }
      }
    );
    
    if (!response.ok) {
      throw new Error(`Google Fonts API error: ${response.status}`);
    }

    const data = await response.json();
    
    if (!data.items || !Array.isArray(data.items)) {
      throw new Error('Invalid response format from Google Fonts API');
    }

    // Transform the data to our format
    return data.items.map((font: any) => ({
      family: font.family,
      variants: font.variants || [],
      subsets: font.subsets || [],
      category: font.category || 'sans-serif',
      files: font.files || {}
    }));
  } catch (error) {
    console.error('Error fetching all fonts:', error);
    throw error;
  }
});

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
      error: 'Failed to fetch font'
    };
  }
});

// Cached function to get indexed fonts for improved search performance
const getCachedIndexedFonts = cache(async (): Promise<IndexedFont[]> => {
  try {
    const fonts = await getCachedAllFonts();
    
    // Create indexed version with cached lowercase strings
    return fonts.map(font => ({
      ...font,
      familyLower: font.family.toLowerCase(),
      searchableText: `${font.family} ${font.category}`.toLowerCase()
    }));
  } catch (error) {
    console.error('Error indexing fonts:', error);
    throw error;
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
      error: 'Unknown error occurred'
    };
  }
}

// Note: getPopularFonts function - returns popular fonts from Google Fonts API
export async function getPopularFonts(limit: number = 10): Promise<FontsSearchResult> {
  try {
    // Get all fonts from cache (sorted by popularity)
    const allFonts = await getCachedAllFonts();
    
    // Return the first 'limit' fonts (already sorted by popularity)
    const fonts = allFonts.slice(0, Math.min(limit, allFonts.length));

    return {
      success: true,
      fonts
    };
  } catch (error) {
    // Fallback to curated list if API fails
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
  }
}

// Fuzzy search implementation
function fuzzySearch(query: string, fonts: IndexedFont[], limit: number = 20): GoogleFont[] {
  if (!query.trim()) {
    return fonts.slice(0, limit);
  }

  const queryLower = query.toLowerCase();
  const queryWords = queryLower.split(/\s+/).filter(word => word.length > 0);
  
  // Score each font based on how well it matches the query
  const scoredFonts = fonts.map(font => {
    const fontNameLower = font.familyLower; // Use cached lowercase version
    let score = 0;
    
    // Exact match gets highest score
    if (fontNameLower === queryLower) {
      score = 1000;
    }
    // Starts with query gets high score
    else if (fontNameLower.startsWith(queryLower)) {
      score = 500;
    }
    // Contains query gets medium score
    else if (fontNameLower.includes(queryLower)) {
      score = 200;
    }
    // Check individual words
    else {
      let wordMatches = 0;
      let partialMatches = 0;
      
      for (const word of queryWords) {
        if (fontNameLower.includes(word)) {
          if (fontNameLower.startsWith(word)) {
            wordMatches += 3; // Word at start
          } else {
            wordMatches += 1; // Word anywhere
          }
        } else {
          // Check for partial word matches
          for (let i = 0; i < word.length - 1; i++) {
            const partial = word.substring(0, word.length - i);
            if (partial.length >= 2 && fontNameLower.includes(partial)) {
              partialMatches += 1;
              break;
            }
          }
        }
      }
      
      score = wordMatches * 50 + partialMatches * 10;
    }
    
    // Boost score for popular fonts (assuming they're at the beginning of the list)
    const popularityBoost = Math.max(0, 100 - fonts.indexOf(font));
    score += popularityBoost;
    
    return { font, score };
  });
  
  // Sort by score descending and return top results
  return scoredFonts
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.font);
}

// Server action to get fonts by category
export async function getFontsByCategory(category: string, limit: number = 20): Promise<FontsSearchResult> {
  try {
    const allFonts = await getCachedAllFonts();
    
    // Filter fonts by category
    const categoryFonts = allFonts.filter(font => font.category === category);
    
    // Return the first 'limit' fonts
    const fonts = categoryFonts.slice(0, Math.min(limit, categoryFonts.length));

    return {
      success: true,
      fonts
    };
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: 'Failed to fetch fonts by category'
    };
  }
}

// Server action to search fonts by query with fuzzy matching
export async function searchFonts(query: string, limit: number = 20): Promise<FontsSearchResult> {
  try {
    if (!query.trim()) {
      // If no query, return popular fonts
      return await getPopularFonts(limit);
    }

    // Get all indexed fonts from cache
    const allFonts = await getCachedIndexedFonts();
    
    // Perform fuzzy search
    const matchingFonts = fuzzySearch(query, allFonts, limit);
    
    return {
      success: true,
      fonts: matchingFonts
    };
  } catch (error) {
    console.error('Font search error:', error);
    
    // Fallback: try exact match search
    try {
      const exactResult = await getCachedFont(query);
      if (exactResult.success && exactResult.font) {
        return {
          success: true,
          fonts: [exactResult.font]
        };
      }
    } catch (fallbackError) {
      console.error('Fallback search also failed:', fallbackError);
    }
    
    return {
      success: false,
      fonts: [],
      error: 'Search failed'
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
      error: 'Debug search failed'
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
      // Revalidate all font caches
      revalidateTag('google-fonts-all');
    }
    
    return {
      success: true,
      fonts: [],
      error: 'Cache refreshed. Fonts will be refetched on next request.'
    };
  } catch (error) {
    return {
      success: false,
      fonts: [],
      error: 'Failed to refresh font cache'
    };
  }
}
