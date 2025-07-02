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
import { useDebouncedValue, useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";
import { searchFonts, getPopularFonts } from "@/lib/fonts-secure";
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

  // Mobile responsive hooks
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  // Demo fonts fallback
  const DEMO_FONTS: GoogleFont[] = [
    {
      family: "Inter",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      files: { regular: "" },
      category: "sans-serif"
    },
    {
      family: "Roboto",
      variants: ["regular", "500", "700"],
      subsets: ["latin"],
      files: { regular: "" },
      category: "sans-serif"
    },
    {
      family: "Open Sans",
      variants: ["regular", "600", "700"],
      subsets: ["latin"],
      files: { regular: "" },
      category: "sans-serif"
    },
    {
      family: "Playfair Display",
      variants: ["regular", "600", "700"],
      subsets: ["latin"],
      files: { regular: "" },
      category: "serif"
    },
    {
      family: "Poppins",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      files: { regular: "" },
      category: "sans-serif"
    }
  ];

  // Load fonts from secure server actions
  const fetchFonts = async () => {
    setLoading(true);
    try {
      const result = await getPopularFonts(100);
      
      if (result.success && result.fonts) {
        setFonts(result.fonts);
      } else {
        throw new Error(result.error || 'Failed to fetch fonts');
      }
    } catch (error) {
      console.error("Failed to fetch Google Fonts:", error);
      notifications.show({
        title: "Font Loading Error",
        message: "Failed to load Google Fonts. Using demo fonts instead.",
        color: "orange",
      });
      // Fallback to demo fonts
      setFonts(DEMO_FONTS);
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

  // Filter fonts based on category (search is handled server-side)
  const filteredFonts = useMemo(() => {
    let filtered = fonts;
    
    // Filter by category (if selected)
    if (selectedCategory) {
      filtered = filtered.filter(font => font.category === selectedCategory);
    }
    
    return filtered;
  }, [fonts, selectedCategory]);

  // Load fonts for preview when filtered fonts change
  useEffect(() => {
    // Load first few visible fonts to avoid loading too many at once
    const fontsToLoad = filteredFonts.slice(0, 10);
    fontsToLoad.forEach(font => {
      if (!loadedFonts.has(font.family)) {
        setTimeout(() => {
          loadFontForPreview(font.family);
        }, 0);
      }
    });
  }, [filteredFonts, loadedFonts]);

  // Convert fonts to select data format
  const selectData = useMemo(() => {
    return filteredFonts.map(font => ({
      value: font.family,
      label: font.family,
      font: font,
    }));
  }, [filteredFonts]);

  // Handle debounced search query changes
  useEffect(() => {
    if (debouncedQuery.trim()) {
      // Perform server-side search for better performance
      setLoading(true);
      searchFonts(debouncedQuery, 20)
        .then(result => {
          if (result.success && result.fonts) {
            setFonts(result.fonts);
          } else {
            console.error('Font search error:', result.error);
          }
        })
        .catch(error => {
          console.error('Font search failed:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      // If no search query, load popular fonts
      fetchFonts();
    }
  }, [debouncedQuery]);

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
    <Stack gap={isSmallMobile ? "xs" : "sm"}>
      {/* Category filter pills - Hidden on small mobile for space */}
      {!isSmallMobile && (
        <Box>
          <Text size="xs" c="dimmed" mb="xs">
            Filter by category:
          </Text>
          <Group gap="xs" wrap="wrap">
            <Pill 
              size="sm" 
              variant={selectedCategory === null ? "filled" : "light"}
              style={{ cursor: "pointer" }}
              onClick={() => setSelectedCategory(null)}
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
                onClick={() => setSelectedCategory(selectedCategory === category ? null : category)}
              >
                {category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ')}
              </Pill>
            ))}
          </Group>
        </Box>
      )}

      <Select
        label={label}
        description={description}
        placeholder={isSmallMobile ? "Choose font..." : placeholder}
        error={error}
        required={required}
        disabled={disabled}
        size={isSmallMobile ? "sm" : size}
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
            <Group justify="center" p={isSmallMobile ? "sm" : "md"}>
              <Loader size="sm" />
              <Text size="sm" c="dimmed">Loading fonts...</Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed" ta="center" p={isSmallMobile ? "sm" : "md"}>
              No fonts found{debouncedQuery ? ` matching "${debouncedQuery}"` : ''}
              {selectedCategory ? ` in ${selectedCategory} category` : ''}
            </Text>
          )
        }
        renderOption={renderOption}
        maxDropdownHeight={isMobile ? 300 : 450}
        limit={isMobile ? 30 : 50}
        comboboxProps={{
          shadow: "md",
          transitionProps: { transition: "fade", duration: 200 },
          dropdownPadding: isSmallMobile ? 4 : 8,
          offset: 2,
        }}
        leftSection={loading ? <Loader size={16} /> : undefined}
        rightSection={
          value && !isSmallMobile && (
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
