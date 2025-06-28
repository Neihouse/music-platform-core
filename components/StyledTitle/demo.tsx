"use client";

import React, { useState } from 'react';
import { Stack, Paper, Text, Group, Button, Code, Divider } from '@mantine/core';
import StyledTitle from './index';
import FontSelect from '@/components/FontSelect';

/**
 * Demo component showing StyledTitle usage
 */
export default function StyledTitleDemo() {
  const [selectedFont, setSelectedFont] = useState<string | undefined>("Inter");
  
  // Mock entity data (like what would come from database)
  const mockArtist = {
    id: "1",
    name: "The Midnight Collective",
    selectedFont: selectedFont,
    bio: "An indie rock band from Portland"
  };

  const mockPromoter = {
    id: "2", 
    name: "Downtown Events Co.",
    selectedFont: selectedFont,
    email: "events@downtown.com"
  };

  const mockVenue = {
    id: "3",
    name: "The Historic Theater",
    selectedFont: selectedFont,
    capacity: 500
  };

  const exampleFonts = [
    "Inter",
    "Playfair Display", 
    "Roboto",
    "Montserrat",
    "Poppins",
    "Lora",
    "Open Sans"
  ];

  return (
    <Stack gap="xl" p="md">
      <div>
        <Text size="xl" fw={700} mb="md">
          StyledTitle Component Demo
        </Text>
        <Text c="dimmed" mb="xl">
          This component dynamically loads and applies Google Fonts based on the selectedFont field from your database entities.
        </Text>
      </div>

      {/* Font Selector */}
      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Font Selection</Text>
          <FontSelect
            label="Choose a font to test"
            description="This simulates the selectedFont field from your database"
            value={selectedFont}
            onChange={(font) => setSelectedFont(font || undefined)}
            placeholder="Select a font..."
          />
          
          <Text size="sm" c="dimmed">
            Quick options:
          </Text>
          <Group gap="xs">
            {exampleFonts.map(font => (
              <Button
                key={font}
                size="xs"
                variant={selectedFont === font ? "filled" : "light"}
                onClick={() => setSelectedFont(font)}
              >
                {font}
              </Button>
            ))}
          </Group>
        </Stack>
      </Paper>

      {/* Artist Example */}
      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Artist Example</Text>
          <Text size="sm" c="dimmed">
            Using artist.selectedFont to style the artist name
          </Text>
          
          <StyledTitle selectedFont={mockArtist.selectedFont}>
            {mockArtist.name}
          </StyledTitle>
          
          <Text size="sm">{mockArtist.bio}</Text>
          
          <Code block>
{`<StyledTitle selectedFont={artist.selectedFont}>
  {artist.name}
</StyledTitle>`}
          </Code>
        </Stack>
      </Paper>

      {/* Promoter Example */}
      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Promoter Example (H2)</Text>
          <Text size="sm" c="dimmed">
            Using promoter.selectedFont with custom element
          </Text>
          
          <StyledTitle 
            selectedFont={mockPromoter.selectedFont}
            as="h2"
            style={{ color: '#1971c2', marginBottom: '0.5rem' }}
          >
            {mockPromoter.name}
          </StyledTitle>
          
          <Text size="sm">{mockPromoter.email}</Text>
          
          <Code block>
{`<StyledTitle 
  selectedFont={promoter.selectedFont}
  as="h2"
  style={{ color: '#1971c2' }}
>
  {promoter.name}
</StyledTitle>`}
          </Code>
        </Stack>
      </Paper>

      {/* Venue Example */}
      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Venue Example (With Loading)</Text>
          <Text size="sm" c="dimmed">
            Using venue.selectedFont with loading state
          </Text>
          
          <StyledTitle 
            selectedFont={mockVenue.selectedFont}
            as="h3"
            showLoading={true}
            className="venue-title"
            style={{ 
              fontSize: '1.8rem',
              color: '#37b24d',
              textAlign: 'center',
              padding: '1rem',
              border: '2px solid #37b24d',
              borderRadius: '8px'
            }}
          >
            {mockVenue.name}
          </StyledTitle>
          
          <Text size="sm" ta="center">Capacity: {mockVenue.capacity}</Text>
          
          <Code block>
{`<StyledTitle 
  selectedFont={venue.selectedFont}
  as="h3"
  showLoading={true}
  style={{ 
    fontSize: '1.8rem',
    color: '#37b24d',
    textAlign: 'center' 
  }}
>
  {venue.name}
</StyledTitle>`}
          </Code>
        </Stack>
      </Paper>

      {/* Multiple Elements Example */}
      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Multiple Elements</Text>
          <Text size="sm" c="dimmed">
            Using the same font across different elements
          </Text>
          
          <div style={{ padding: '1rem', backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
            <StyledTitle selectedFont={selectedFont} as="h1">
              Main Title
            </StyledTitle>
            
            <StyledTitle selectedFont={selectedFont} as="h2" style={{ color: '#666' }}>
              Subtitle
            </StyledTitle>
            
            <StyledTitle selectedFont={selectedFont} as="p" style={{ fontSize: '1.1rem' }}>
              This is body text using the same font family
            </StyledTitle>
          </div>
          
          <Code block>
{`<StyledTitle selectedFont={selectedFont} as="h1">
  Main Title
</StyledTitle>

<StyledTitle selectedFont={selectedFont} as="h2">
  Subtitle  
</StyledTitle>

<StyledTitle selectedFont={selectedFont} as="p">
  Body text
</StyledTitle>`}
          </Code>
        </Stack>
      </Paper>

      {/* Fallback Example */}
      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="md">
          <Text fw={600}>Fallback Font Example</Text>
          <Text size="sm" c="dimmed">
            When selectedFont is null or empty, uses fallback
          </Text>
          
          <StyledTitle 
            selectedFont={null}
            fallbackFont="Georgia, serif"
            style={{ color: '#e03131' }}
          >
            This uses the fallback font (Georgia)
          </StyledTitle>
          
          <Code block>
{`<StyledTitle 
  selectedFont={null}
  fallbackFont="Georgia, serif"
>
  This uses the fallback font
</StyledTitle>`}
          </Code>
        </Stack>
      </Paper>

      <Divider />

      {/* Current State Info */}
      <Paper p="md" shadow="sm" radius="md" bg="gray.0">
        <Stack gap="sm">
          <Text fw={600} size="sm">Current State</Text>
          <Group gap="lg">
            <div>
              <Text size="xs" c="dimmed">Selected Font:</Text>
              <Code>{selectedFont || 'null'}</Code>
            </div>
            <div>
              <Text size="xs" c="dimmed">Applied CSS:</Text>
              <Code>{selectedFont ? `font-family: "${selectedFont}", Arial, sans-serif` : 'font-family: Arial, sans-serif'}</Code>
            </div>
          </Group>
        </Stack>
      </Paper>
    </Stack>
  );
}
