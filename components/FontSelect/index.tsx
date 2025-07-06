"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Select,
  Text,
  Box,
  Group,
  Loader,
  Paper,
  Stack,
  rem,
  Pill,
  ScrollArea,
} from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { searchFonts, getPopularFonts, getFontsByCategory } from "@/lib/fonts-secure";
import { loadFont } from "@/lib/fonts-client";

// Google Font interface - simplified for our needs
export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  category: 'serif' | 'sans-serif' | 'monospace' | 'display' | 'handwriting';
  files: Record<string, string>;
}

interface FontSelectProps {
  value?: string;
  onChange?: (fontFamily: string | null) => void;
  placeholder?: string;
  label?: string;
  description?: string;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
}

// Font category colors for visual differentiation
const CATEGORY_COLORS = {
  "serif": "#e64980",
  "sans-serif": "#1971c2", 
  "monospace": "#37b24d",
  "display": "#f76707",
  "handwriting": "#9c36b5",
} as const;

/**
 * FontSelect - A secure font selector that doesn't expose API keys
 * 
 * This component uses server-side API routes to search fonts, keeping
 * the Google Fonts API key secure on the server.
 */
export function FontSelect({
  value,
  onChange,
  placeholder = "Search for a font...",
  label,
  description,
  error,
  required,
  disabled,
  size = "md",
}: FontSelectProps) {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Load fonts from server - either popular fonts or search results
  const fetchFonts = async (query?: string, category?: string | null) => {
    setLoading(true);
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
      notifications.show({
        title: "Font Loading Error",
        message: "Failed to load fonts. Please try again.",
        color: "orange",
      });
      // Clear fonts on error
      setFonts([]);
    } finally {
      setLoading(false);
    }
  };

  // Load font in the browser for preview - this is safe, no API key needed
  const loadFontForPreview = async (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return;
    
    try {
      // Use the secure client-side font loader
      const result = await loadFont(fontFamily, {
        weights: ['400', '500', '600', '700'],
        display: 'swap'
      });
      
      if (result.success) {
        // Mark as loaded
        setLoadedFonts(prev => new Set([...prev, fontFamily]));
      }
    } catch (error) {
      console.warn(`Failed to load font: ${fontFamily}`, error);
    }
  };

  // Load fonts for preview when fonts change
  useEffect(() => {
    // Load first few visible fonts to avoid loading too many at once
    const fontsToLoad = fonts.slice(0, 10);
    fontsToLoad.forEach(font => {
      if (!loadedFonts.has(font.family)) {
        setTimeout(() => {
          loadFontForPreview(font.family);
        }, 0);
      }
    });
  }, [fonts, loadedFonts]);

  // Convert fonts to select data format
  const selectData = useMemo(() => {
    return fonts.map(font => ({
      value: font.family,
      label: font.family,
      font: font,
    }));
  }, [fonts]);

  // Handle debounced search query changes
  useEffect(() => {
    fetchFonts(debouncedQuery, selectedCategory);
  }, [debouncedQuery, selectedCategory]);

  // Load initial fonts
  useEffect(() => {
    fetchFonts();
  }, []);

  // Custom option renderer with font preview
  const renderOption = ({ option }: { option: any }) => {
    const font = option.font as GoogleFont;
    const categoryColor = CATEGORY_COLORS[font.category as keyof typeof CATEGORY_COLORS] || "#868e96";
    
    return (
      <Box p="xs">
        <Group justify="space-between" wrap="nowrap">
          <Box style={{ flex: 1, minWidth: 0 }}>
            <Text
              size="sm"
              fw={500}
              truncate
              style={{
                fontFamily: loadedFonts.has(font.family) ? `"${font.family}", sans-serif` : undefined,
                fontSize: "16px",
                lineHeight: 1.3,
              }}
            >
              {font.family}
            </Text>
            <Group gap="xs" mt={2}>
              <Text size="xs" c="dimmed" tt="capitalize">
                {font.category}
              </Text>
              <Text size="xs" c="dimmed">
                •
              </Text>
              <Text size="xs" c="dimmed">
                {font.variants.length} variant{font.variants.length !== 1 ? 's' : ''}
              </Text>
            </Group>
          </Box>
          <Box
            style={{
              width: rem(10),
              height: rem(10),
              borderRadius: "50%",
              backgroundColor: categoryColor,
              flexShrink: 0,
            }}
          />
        </Group>
      </Box>
    );
  };

  return (
    <Stack gap="xs">
      {/* Category filter pills */}
      <Box>
        <Text size="xs" c="dimmed" mb="xs">
          Filter by category:
        </Text>
        <Group gap="xs">
          <Pill 
            size="sm" 
            variant={selectedCategory === null ? "filled" : "light"}
            style={{ cursor: "pointer" }}
            onClick={() => {
              setSelectedCategory(null);
              setSearchQuery(""); // Clear search when changing category
            }}
          >
            All
          </Pill>
          {Object.entries(CATEGORY_COLORS).map(([category, color]) => (
            <Pill
              key={category}
              size="sm"
              variant={selectedCategory === category ? "filled" : "light"}
              style={{ 
                cursor: "pointer",
                backgroundColor: selectedCategory === category ? color : undefined,
                color: selectedCategory === category ? "white" : undefined,
              }}
              onClick={() => {
                const newCategory = selectedCategory === category ? null : category;
                setSelectedCategory(newCategory);
                setSearchQuery(""); // Clear search when changing category
              }}
            >
              {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
            </Pill>
          ))}
        </Group>
      </Box>

      <Select
        label={label}
        description={description}
        placeholder={placeholder}
        error={error}
        required={required}
        disabled={disabled}
        size={size}
        value={value}
        onChange={onChange}
        data={selectData}
        searchable
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        clearable
        allowDeselect
        nothingFoundMessage={
          loading ? (
            <Group justify="center" p="md">
              <Loader size="sm" />
              <Text size="sm" c="dimmed">
                {searchQuery ? `Searching for "${searchQuery}"...` : "Loading fonts..."}
              </Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed" ta="center" p="md">
              No fonts found
              {searchQuery ? ` matching "${searchQuery}"` : ''}
              {selectedCategory ? ` in ${selectedCategory} category` : ''}
            </Text>
          )
        }
        renderOption={renderOption}
        maxDropdownHeight={450}
        limit={50}
        comboboxProps={{
          shadow: "md",
          transitionProps: { transition: "fade", duration: 200 },
          dropdownPadding: 8,
          offset: 2,
        }}
        leftSection={loading ? <Loader size={16} /> : undefined}
        rightSection={
          value && (
            <Group gap={4} wrap="nowrap">
              <Text size="xs" c="dimmed">
                {fonts.find(f => f.family === value)?.variants.length || 0} variants
              </Text>
            </Group>
          )
        }
      />
    </Stack>
  );
}

export default FontSelect;
