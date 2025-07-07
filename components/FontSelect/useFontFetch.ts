/**
 * Custom hook to manage font fetching operations
 * 
 * Extracts the fetchFonts logic from FontSelect component to reduce duplication
 * and simplify the component.
 */

import { useState, useEffect, useCallback } from 'react';
import { notifications } from '@mantine/notifications';
import { useDebouncedValue } from '@mantine/hooks';
import { GoogleFont } from '@/lib/fonts-secure';
import { searchFonts, getFontsByCategory, getPopularFonts } from '@/lib/fonts-secure';

interface UseFontFetchOptions {
  searchQuery?: string;
  selectedCategory?: string | null;
  debounceMs?: number;
}

interface UseFontFetchResult {
  fonts: GoogleFont[];
  loading: boolean;
  error: string | null;
  fetchFonts: (query?: string, category?: string | null) => Promise<void>;
}

export function useFontFetch(options: UseFontFetchOptions = {}): UseFontFetchResult {
  const { searchQuery = '', selectedCategory = null, debounceMs = 300 } = options;
  
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [debouncedQuery] = useDebouncedValue(searchQuery, debounceMs);

  // Fetch fonts from server - either popular fonts or search results
  const fetchFonts = useCallback(async (query?: string, category?: string | null) => {
    setLoading(true);
    setError(null);
    
    try {
      let result;
      
      if (query?.trim()) {
        // Search for fonts based on query
        result = await searchFonts(query, 50);
      } else if (category) {
        // Get fonts by category
        result = await getFontsByCategory(category, 50);
      } else {
        // Get popular fonts
        result = await getPopularFonts(50);
      }
      
      if (result.success) {
        setFonts(result.fonts);
      } else {
        throw new Error(result.error || 'Failed to fetch fonts');
      }
    } catch (error) {
      console.error("Failed to fetch fonts:", error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch fonts';
      
      setError(errorMessage);
      notifications.show({
        title: "Font Loading Error",
        message: "Failed to load fonts. Please try again.",
        color: "orange",
      });
      
      // Do not clear fonts on error; retain existing fonts to preserve user experience
    } finally {
      setLoading(false);
    }
  }, []);

  // Handle debounced search query changes
  useEffect(() => {
    fetchFonts(debouncedQuery, selectedCategory);
  }, [debouncedQuery, selectedCategory, fetchFonts]);

  // Load initial fonts
  useEffect(() => {
    fetchFonts();
  }, [fetchFonts]);

  return {
    fonts,
    loading,
    error,
    fetchFonts
  };
}
