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
import { generateFontCDNUrl } from "@/lib/google-fonts";

// Google Font interface based on API response
export interface GoogleFont {
  family: string;
  variants: string[];
  subsets: string[];
  version: string;
  lastModified: string;
  files: Record<string, string>;
  category: string;
  kind: string;
  menu?: string;
}

export interface GoogleFontsResponse {
  kind: string;
  items: GoogleFont[];
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
  apiKey?: string;
}

// Font category colors for visual differentiation
const CATEGORY_COLORS = {
  "serif": "#e64980",
  "sans-serif": "#1971c2", 
  "monospace": "#37b24d",
  "display": "#f76707",
  "handwriting": "#9c36b5",
} as const;

export default function FontSelect({
  value,
  onChange,
  placeholder = "Search for a font...",
  label,
  description,
  error,
  required,
  disabled,
  size = "md",
  apiKey, // Optional API key prop
}: FontSelectProps) {
  const [fonts, setFonts] = useState<GoogleFont[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedQuery] = useDebouncedValue(searchQuery, 300);
  const [loadedFonts, setLoadedFonts] = useState<Set<string>>(new Set());
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  // Demo fonts for when no API key is provided (ordered by popularity)
  const DEMO_FONTS: GoogleFont[] = [
    {
      family: "Inter",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v12",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "sans-serif",
      kind: "webfonts#webfont"
    },
    {
      family: "Roboto",
      variants: ["regular", "500", "700"],
      subsets: ["latin"],
      version: "v30",
      lastModified: "2023-01-01", 
      files: { regular: "" },
      category: "sans-serif",
      kind: "webfonts#webfont"
    },
    {
      family: "Poppins",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v20",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "sans-serif",
      kind: "webfonts#webfont"
    },
    {
      family: "Open Sans",
      variants: ["regular", "600", "700"],
      subsets: ["latin"],
      version: "v34",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "sans-serif", 
      kind: "webfonts#webfont"
    },
    {
      family: "Montserrat",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v25",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "sans-serif",
      kind: "webfonts#webfont"
    },
    {
      family: "Lato",
      variants: ["regular", "700"],
      subsets: ["latin"],
      version: "v24",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "sans-serif",
      kind: "webfonts#webfont"
    },
    {
      family: "Playfair Display",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v30",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "serif",
      kind: "webfonts#webfont"
    },
    {
      family: "Lora",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v32",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "serif",
      kind: "webfonts#webfont"
    },
    {
      family: "Merriweather",
      variants: ["regular", "700"],
      subsets: ["latin"],
      version: "v30",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "serif",
      kind: "webfonts#webfont"
    },
    {
      family: "JetBrains Mono",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v15",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "monospace",
      kind: "webfonts#webfont"
    },
    {
      family: "Source Code Pro",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v22",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "monospace",
      kind: "webfonts#webfont"
    },
    {
      family: "Abril Fatface",
      variants: ["regular"],
      subsets: ["latin"],
      version: "v19",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "display",
      kind: "webfonts#webfont"
    },
    {
      family: "Bebas Neue",
      variants: ["regular"],
      subsets: ["latin"],
      version: "v14",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "display",
      kind: "webfonts#webfont"
    },
    {
      family: "Dancing Script",
      variants: ["regular", "500", "600", "700"],
      subsets: ["latin"],
      version: "v25",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "handwriting",
      kind: "webfonts#webfont"
    },
    {
      family: "Pacifico",
      variants: ["regular"],
      subsets: ["latin"],
      version: "v22",
      lastModified: "2023-01-01",
      files: { regular: "" },
      category: "handwriting",
      kind: "webfonts#webfont"
    }
  ];
  // Load fonts from Google Fonts API
  const fetchFonts = async () => {
    if (!apiKey) {
      // Use demo fonts when no API key provided
      setFonts(DEMO_FONTS);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://www.googleapis.com/webfonts/v1/webfonts?key=${apiKey}&sort=popularity`
      );
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
      }
      const data: GoogleFontsResponse = await response.json();
      setFonts(data.items || []);
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

  // Load font in the browser for preview - simplified approach
  const loadFont = async (fontFamily: string) => {
    if (loadedFonts.has(fontFamily)) return;
    
    try {
      const fontName = fontFamily.replace(/ /g, '+');
      
      // Check if font is already loaded
      const existingLink = document.querySelector(`link[href*="${fontName}"]`);
      if (!existingLink) {
        const fontLink = document.createElement('link');
        fontLink.href = `https://fonts.googleapis.com/css2?family=${fontName}:wght@400;500;600;700&display=swap`;
        fontLink.rel = 'stylesheet';
        document.head.appendChild(fontLink);
      }
      
      // Mark as loaded immediately - the CSS will handle the loading
      setLoadedFonts(prev => new Set([...prev, fontFamily]));
    } catch (error) {
      console.warn(`Failed to load font: ${fontFamily}`, error);
    }
  };

  // Filter fonts based on search query and category
  const filteredFonts = useMemo(() => {
    let filtered = fonts;
    
    // Filter by search query
    if (debouncedQuery.trim()) {
      filtered = filtered.filter(font =>
        font.family.toLowerCase().includes(debouncedQuery.toLowerCase())
      );
    }
    
    // Filter by category
    if (selectedCategory) {
      filtered = filtered.filter(font => font.category === selectedCategory);
    }
    
    return filtered;
  }, [fonts, debouncedQuery, selectedCategory]);

  // Load fonts for preview when filtered fonts change
  useEffect(() => {
    // Load first few visible fonts to avoid loading too many at once
    const fontsToLoad = filteredFonts.slice(0, 10);
    fontsToLoad.forEach(font => {
      if (!loadedFonts.has(font.family)) {
        setTimeout(() => {
          loadFont(font.family);
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

  useEffect(() => {
    fetchFonts();
  }, [apiKey]);

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
              <Text size="sm" c="dimmed">Loading fonts...</Text>
            </Group>
          ) : (
            <Text size="sm" c="dimmed" ta="center" p="md">
              No fonts found{debouncedQuery ? ` matching "${debouncedQuery}"` : ''}
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