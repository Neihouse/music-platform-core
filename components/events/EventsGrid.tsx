"use client";

import { getPosterUrl } from "@/lib/images/image-utils-client";
import { AspectRatio, Badge, Box, Button, Card, Grid, Group, Image, Stack, Text, Title } from "@mantine/core";
import { IconCalendar, IconMapPin, IconPhoto, IconTicket, IconUsers } from "@tabler/icons-react";
import Link from "next/link";
import { useState, useEffect } from "react";

interface Event {
  id: string;
  name: string;
  date: string | null;
  hash: string | null;
  poster_img: string | null;
  venues: {
    id: string;
    name: string;
    address: string | null;
  } | null;
}

interface EventsGridProps {
  events: Event[];
}

// Utility function to extract dominant color from image
const extractDominantColor = (imageSrc: string): Promise<string> => {
  return new Promise((resolve) => {
    const img = document.createElement('img') as HTMLImageElement;
    img.crossOrigin = 'anonymous';
    
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      if (!ctx) {
        resolve('#667eea'); // fallback color
        return;
      }
      
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      
      try {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Sample colors from the image
        const colors: { [key: string]: number } = {};
        const sampleSize = 10; // Sample every 10th pixel for performance
        
        for (let i = 0; i < data.length; i += 4 * sampleSize) {
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const alpha = data[i + 3];
          
          // Skip transparent pixels
          if (alpha < 128) continue;
          
          // Group similar colors
          const colorKey = `${Math.floor(r / 16) * 16},${Math.floor(g / 16) * 16},${Math.floor(b / 16) * 16}`;
          colors[colorKey] = (colors[colorKey] || 0) + 1;
        }
        
        // Find most frequent color
        let dominantColor = '#667eea';
        let maxCount = 0;
        
        for (const [color, count] of Object.entries(colors)) {
          if (count > maxCount) {
            maxCount = count;
            const [r, g, b] = color.split(',').map(Number);
            dominantColor = `rgb(${r}, ${g}, ${b})`;
          }
        }
        
        resolve(dominantColor);
      } catch (error) {
        resolve('#667eea'); // fallback color
      }
    };
    
    img.onerror = () => resolve('#667eea');
    img.src = imageSrc;
  });
};

// Convert RGB to HSL for color manipulation
const rgbToHsl = (r: number, g: number, b: number) => {
  r /= 255;
  g /= 255;
  b /= 255;
  
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  let h = 0, s = 0, l = (max + min) / 2;
  
  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  
  return [h * 360, s * 100, l * 100];
};

// Convert HSL back to RGB
const hslToRgb = (h: number, s: number, l: number) => {
  h /= 360;
  s /= 100;
  l /= 100;
  
  const hue2rgb = (p: number, q: number, t: number) => {
    if (t < 0) t += 1;
    if (t > 1) t -= 1;
    if (t < 1/6) return p + (q - p) * 6 * t;
    if (t < 1/2) return q;
    if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
    return p;
  };
  
  let r, g, b;
  
  if (s === 0) {
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }
  
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

// Generate color variations
const generateColorPalette = (baseColor: string) => {
  const rgbMatch = baseColor.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
  if (!rgbMatch) {
    return {
      primary: '#667eea',
      light: '#8796f0',
      dark: '#4c63d2',
      gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      text: '#ffffff'
    };
  }
  
  const [, r, g, b] = rgbMatch.map(Number);
  const [h, s, l] = rgbToHsl(r, g, b);
  
  // Generate variations
  const lightL = Math.min(l + 15, 85);
  const darkL = Math.max(l - 15, 15);
  
  const [lightR, lightG, lightB] = hslToRgb(h, s, lightL);
  const [darkR, darkG, darkB] = hslToRgb(h, s, darkL);
  
  const primary = `rgb(${r}, ${g}, ${b})`;
  const light = `rgb(${lightR}, ${lightG}, ${lightB})`;
  const dark = `rgb(${darkR}, ${darkG}, ${darkB})`;
  const gradient = `linear-gradient(135deg, ${primary} 0%, ${dark} 100%)`;
  const text = l > 50 ? '#000000' : '#ffffff';
  
  return { primary, light, dark, gradient, text };
};

interface EventCardProps {
  event: Event;
}

function EventCard({ event }: EventCardProps) {
  const [colorPalette, setColorPalette] = useState({
    primary: '#667eea',
    light: '#8796f0',
    dark: '#4c63d2',
    gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    text: '#ffffff'
  });
  
  const posterUrl = event.poster_img ? getPosterUrl(event.poster_img) : null;
  const eventDate = event.date ? new Date(event.date) : null;
  
  useEffect(() => {
    if (posterUrl) {
      extractDominantColor(posterUrl).then(dominantColor => {
        setColorPalette(generateColorPalette(dominantColor));
      });
    }
  }, [posterUrl]);

  return (
    <Grid.Col span={{ base: 6, sm: 6, md: 4, lg: 3 }}>
      <Card 
        shadow="lg" 
        radius="md"
        withBorder 
        h="100%" 
        p="xs"
        style={{ 
          overflow: 'hidden',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          background: `linear-gradient(145deg, ${colorPalette.light}15 0%, ${colorPalette.primary}08 100%)`,
          borderColor: `${colorPalette.primary}20`,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = `0 20px 40px ${colorPalette.primary}30`;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '';
        }}
      >
        <Stack gap={0} h="100%">
          {/* Poster Section */}
          <Box pos="relative" mb="xs">
            <AspectRatio ratio={3 / 4}>
              {posterUrl ? (
                <Image
                  src={posterUrl}
                  alt={`${event.name} poster`}
                  style={{
                    objectFit: 'cover',
                    borderRadius: '12px',
                  }}
                  fallbackSrc="/artist-not-found.svg"
                />
              ) : (
                <Box
                  style={{
                    background: colorPalette.gradient,
                    borderRadius: '12px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: colorPalette.text,
                  }}
                >
                  <Stack align="center" gap="xs">
                    <IconPhoto size={32} opacity={0.7} />
                    <Text size="sm" fw={500} ta="center">
                      {event.name}
                    </Text>
                  </Stack>
                </Box>
              )}
            </AspectRatio>
            
            {/* Date Badge */}
            {eventDate && (
              <Badge
                size="sm"
                variant="filled"
                style={{
                  position: 'absolute',
                  top: 8,
                  right: 8,
                  background: `${colorPalette.primary}E6`,
                  backdropFilter: 'blur(10px)',
                  color: colorPalette.text,
                  borderRadius: '8px',
                  padding: '4px 8px',
                  fontSize: '0.7rem',
                }}
              >
                {eventDate.toLocaleDateString('en-US', { 
                  month: 'short', 
                  day: 'numeric' 
                })}
              </Badge>
            )}
          </Box>

          {/* Event Details */}
          <Stack gap="xs" style={{ flex: 1 }}>
            <div>
              <Title 
                order={5} 
                size="h6" 
                lineClamp={1} 
                mb={4}
                style={{ 
                  color: colorPalette.dark,
                  fontSize: '0.9rem',
                  lineHeight: 1.2,
                }}
              >
                {event.name}
              </Title>

              {eventDate && (
                <Group gap={4} mb={4}>
                  <IconCalendar size={12} style={{ color: colorPalette.primary }} />
                  <Text size="xs" c="dimmed" style={{ fontSize: '0.7rem' }}>
                    {eventDate.toLocaleDateString('en-US', { 
                      month: 'short',
                      day: 'numeric'
                    })}
                  </Text>
                </Group>
              )}

              {event.venues && (
                <Group gap={4}>
                  <IconMapPin size={12} style={{ color: colorPalette.primary }} />
                  <Text size="xs" c="dimmed" lineClamp={1} style={{ fontSize: '0.7rem' }}>
                    {event.venues.name}
                  </Text>
                </Group>
              )}
            </div>

            {/* Action Buttons */}
            <Group justify="space-between" mt="auto" pt="xs" gap="xs">
              <Button
                variant="subtle"
                component={Link}
                href={`/events/${event.hash}`}
                size="xs"
                leftSection={<IconTicket size={10} />}
                style={{ 
                  flex: 1,
                  color: colorPalette.primary,
                  backgroundColor: `${colorPalette.primary}15`,
                  fontSize: '0.65rem',
                  height: '28px',
                  padding: '4px 8px',
                }}
              >
                View
              </Button>
              <Button
                component={Link}
                href={`/events/${event.hash}/lineup`}
                leftSection={<IconUsers size={10} />}
                size="xs"
                style={{ 
                  flex: 1,
                  background: colorPalette.gradient,
                  color: colorPalette.text,
                  border: 'none',
                  fontSize: '0.65rem',
                  height: '28px',
                  padding: '4px 8px',
                }}
              >
                Lineup
              </Button>
            </Group>
          </Stack>
        </Stack>
      </Card>
    </Grid.Col>
  );
}

export default function EventsGrid({ events }: EventsGridProps) {
  return (
    <Grid gutter={{ base: "xs", sm: "md", md: "xl" }}>
      {events.map((event) => (
        <EventCard key={event.id} event={event} />
      ))}
    </Grid>
  );
}
