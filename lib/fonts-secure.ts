/**
 * Secure Font Loading System
 * 
 * This system provides secure font operations without exposing API keys to the frontend.
 * All Google Fonts API calls are handled server-side via server actions.
 */

'use server';

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

    // Search for the specific font family
    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&family=${encodeURIComponent(fontName)}`
    );

    if (!response.ok) {
      return {
        success: false,
        error: `Google Fonts API error: ${response.status} ${response.statusText}`
      };
    }

    const data = await response.json();
    
    // Find exact match (case-insensitive)
    const font = data.items?.find(
      (item: any) => item.family.toLowerCase() === fontName.toLowerCase()
    );

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
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    
    if (!apiKey) {
      return {
        success: false,
        fonts: [],
        error: 'Google Fonts API key not configured'
      };
    }

    const response = await fetch(
      `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
    );
    
    if (!response.ok) {
      return {
        success: false,
        fonts: [],
        error: `Google Fonts API error: ${response.status}`
      };
    }

    const data = await response.json();
    const fonts = (data.items || []).slice(0, limit).map((item: any) => ({
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
}

// Server action to search fonts by query
export async function searchFonts(query: string, limit: number = 20): Promise<FontsSearchResult> {
  try {
    const popularResult = await getPopularFonts(200); // Get more for filtering
    
    if (!popularResult.success) {
      return popularResult;
    }

    // Filter fonts by query
    const filteredFonts = popularResult.fonts.filter(font =>
      font.family.toLowerCase().includes(query.toLowerCase())
    ).slice(0, limit);

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

  const encodedFamily = fontFamily.replace(/\s+/g, '+');
  const weightString = weights.join(';');
  
  const params = new URLSearchParams();
  params.append('family', `${encodedFamily}:wght@${weightString}`);
  params.append('subset', subsets.join(','));
  params.append('display', display);

  return `https://fonts.googleapis.com/css2?${params.toString()}`;
}
