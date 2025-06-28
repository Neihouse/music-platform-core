"use server";

import { searchFont, searchMultipleFonts } from '@/lib/google-fonts';

export interface FontSearchResult {
  font: any | null;
  cdnUrl: string | null;
  error?: string;
}

export interface FontSearchOptions {
  weights?: string[];
  subsets?: string[];
  display?: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
  format?: 'css' | 'css2';
}

/**
 * Server action to search for a single font
 */
export async function searchFontAction(
  fontName: string,
  options: FontSearchOptions = {}
): Promise<FontSearchResult> {
  try {
    // Get the API key from server-side environment variables (not exposed to browser)
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    
    if (!apiKey) {
      return {
        font: null,
        cdnUrl: null,
        error: 'Google Fonts API key not configured'
      };
    }

    if (!fontName?.trim()) {
      return {
        font: null,
        cdnUrl: null,
        error: 'Font name is required'
      };
    }

    const result = await searchFont(fontName, apiKey, {
      weights: options.weights || ['400', '500', '600', '700'],
      display: options.display || 'swap',
      subsets: options.subsets || ['latin'],
      format: options.format || 'css2'
    });
    
    return result;
    
  } catch (error) {
    console.error('Font search action error:', error);
    return {
      font: null,
      cdnUrl: null,
      error: error instanceof Error ? error.message : 'Failed to search font'
    };
  }
}

/**
 * Server action to search for multiple fonts
 */
export async function searchMultipleFontsAction(
  fontNames: string[],
  options: FontSearchOptions = {}
): Promise<FontSearchResult[]> {
  try {
    const apiKey = process.env.GOOGLE_FONTS_API_KEY;
    
    if (!apiKey) {
      return [{
        font: null,
        cdnUrl: null,
        error: 'Google Fonts API key not configured'
      }];
    }

    if (!Array.isArray(fontNames) || fontNames.length === 0) {
      return [{
        font: null,
        cdnUrl: null,
        error: 'Font names array is required'
      }];
    }

    const results = await searchMultipleFonts(fontNames, apiKey, {
      weights: options.weights || ['400', '500', '600', '700'],
      display: options.display || 'swap',
      subsets: options.subsets || ['latin'],
      format: options.format || 'css2'
    });
    
    return results;
    
  } catch (error) {
    console.error('Multiple fonts search action error:', error);
    return [{
      font: null,
      cdnUrl: null,
      error: error instanceof Error ? error.message : 'Failed to search fonts'
    }];
  }
}

/**
 * Server action to get popular fonts
 */
export async function getPopularFontsAction(
  options: FontSearchOptions = {}
): Promise<FontSearchResult[]> {
  const popularFonts = [
    'Inter', 
    'Roboto', 
    'Open Sans', 
    'Lato', 
    'Montserrat', 
    'Poppins', 
    'Playfair Display', 
    'Source Sans Pro',
    'Nunito',
    'Raleway'
  ];
  
  return searchMultipleFontsAction(popularFonts, options);
}

/**
 * Server action to validate if a font exists in Google Fonts
 */
export async function validateFontAction(fontName: string): Promise<boolean> {
  try {
    const result = await searchFontAction(fontName);
    return !result.error && result.font !== null;
  } catch {
    return false;
  }
}
