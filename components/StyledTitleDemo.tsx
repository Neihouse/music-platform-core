"use client";

import React, { useState } from 'react';
import { Stack, Paper, Group, Text, Button, Select, NumberInput, Box } from '@mantine/core';
import { StyledTitle } from './StyledTitle';

const DEMO_FONTS = [
  'Inter',
  'Playfair Display', 
  'Montserrat',
  'Lora',
  'Poppins',
  'Roboto',
  'Open Sans',
  'Dancing Script',
  'Bebas Neue',
  'JetBrains Mono'
];

const DEMO_TEXTS = [
  'Welcome to Music Platform',
  'Discover Amazing Artists',
  'Your Next Favorite Song',
  'Live Music Experience',
  'Connect Through Music'
];

export default function StyledTitleDemo() {
  const [selectedFont, setSelectedFont] = useState('Playfair Display');
  const [selectedText, setSelectedText] = useState(DEMO_TEXTS[0]);
  const [titleOrder, setTitleOrder] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  return (
    <Stack gap="xl" p="md">
      <div>
        <Text size="xl" fw={700} mb="md">
          StyledTitle Component Demo
        </Text>
        <Text c="dimmed" mb="xl">
          This demo shows the StyledTitle component that dynamically loads Google Fonts
          and smoothly transitions from fallback to custom fonts.
        </Text>
      </div>

      {/* Controls */}
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="md">
          <Text fw={600} mb="xs">Configuration</Text>
          
          <Group grow>
            <Select
              label="Font Family"
              data={DEMO_FONTS}
              value={selectedFont}
              onChange={(value) => setSelectedFont(value || DEMO_FONTS[0])}
              searchable
            />
            
            <NumberInput
              label="Title Order (1-6)"
              value={titleOrder}
              onChange={(value) => setTitleOrder((value as 1 | 2 | 3 | 4 | 5 | 6) || 1)}
              min={1}
              max={6}
            />
          </Group>

          <Select
            label="Demo Text"
            data={DEMO_TEXTS}
            value={selectedText}
            onChange={(value) => setSelectedText(value || DEMO_TEXTS[0])}
          />
        </Stack>
      </Paper>

      {/* Live Preview */}
      <Paper p="xl" shadow="sm" radius="md" withBorder bg="gray.0">
        <Stack gap="md" align="center">
          <Text size="sm" c="dimmed" fw={500}>Live Preview</Text>
          
          <Box ta="center">
            <StyledTitle
              title={selectedText}
              fontName={selectedFont}
              order={titleOrder}
              ta="center"
              c="dark"
            />
          </Box>
          
          <Text size="xs" c="dimmed" ta="center" style={{ fontFamily: 'monospace' }}>
            font-family: "{selectedFont}", sans-serif
          </Text>
        </Stack>
      </Paper>

      {/* Multiple Examples */}
      <Paper p="md" shadow="sm" radius="md" withBorder>
        <Stack gap="lg">
          <Text fw={600}>Multiple Font Examples</Text>
          
          <Stack gap="md">
            <StyledTitle
              title="Elegant Serif Header"
              fontName="Playfair Display"
              order={2}
              c="blue"
            />
            
            <StyledTitle
              title="Modern Sans-Serif Title"
              fontName="Inter"
              order={3}
              c="violet"
            />
            
            <StyledTitle
              title="Playful Script Text"
              fontName="Dancing Script"
              order={4}
              c="orange"
            />
            
            <StyledTitle
              title="Bold Display Font"
              fontName="Bebas Neue"
              order={2}
              c="red"
              tt="uppercase"
            />
          </Stack>
        </Stack>
      </Paper>

      {/* Usage Example */}
      <Paper p="md" shadow="sm" radius="md" bg="gray.0">
        <Stack gap="sm">
          <Text fw={600} size="sm">Usage Example</Text>
          <Text size="xs" c="dimmed" style={{ fontFamily: 'monospace', whiteSpace: 'pre-wrap' }}>
{`import { StyledTitle } from '@/components/StyledTitle';

function MyComponent() {
  return (
    <StyledTitle 
      title="Welcome to Music Platform" 
      fontName="Playfair Display"
      order={1}
      size="h1"
      c="blue"
    />
  );
}`}
          </Text>
        </Stack>
      </Paper>

      {/* Features */}
      <Paper p="md" shadow="sm" radius="md">
        <Stack gap="sm">
          <Text fw={600}>Key Features</Text>
          <Stack gap="xs">
            <Text size="sm">• ✅ Dynamically loads Google Fonts</Text>
            <Text size="sm">• ✅ Smooth loading transition (fallback → custom font)</Text>
            <Text size="sm">• ✅ Extends all Mantine Title props</Text>
            <Text size="sm">• ✅ Error handling with fallback fonts</Text>
            <Text size="sm">• ✅ TypeScript support</Text>
            <Text size="sm">• ✅ Configurable font weights and display strategy</Text>
            <Text size="sm">• ✅ Memory cleanup on unmount</Text>
          </Stack>
        </Stack>
      </Paper>
    </Stack>
  );
}
