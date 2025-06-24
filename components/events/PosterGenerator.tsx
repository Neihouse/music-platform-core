"use client";

import { useState } from 'react';
import {
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Group,
  Select,
  Loader,
  Image,
  Alert,
  Modal,
  Textarea
} from '@mantine/core';
import { IconWand, IconDownload, IconRefresh, IconPhoto } from '@tabler/icons-react';
import { generateEventPoster } from '@/app/events/[eventName]/poster-actions';

interface Event {
  id: string;
  name: string;
  date?: string;
  address?: string;
  venue?: {
    name: string;
  };
}

interface PosterGeneratorProps {
  event: Event;
}

interface GeneratedPoster {
  url: string;
  prompt: string;
  metadata: {
    style: string;
    colorScheme: string;
    generatedAt: string;
  };
}

export function PosterGenerator({ event }: PosterGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPoster, setGeneratedPoster] = useState<GeneratedPoster | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [style, setStyle] = useState<string>('modern');
  const [colorScheme, setColorScheme] = useState<string>('vibrant');
  const [customPrompt, setCustomPrompt] = useState('');
  const [showCustomPrompt, setShowCustomPrompt] = useState(false);

  const styleOptions = [
    { value: 'modern', label: 'Modern' },
    { value: 'vintage', label: 'Vintage' },
    { value: 'minimalist', label: 'Minimalist' },
    { value: 'bold', label: 'Bold' }
  ];

  const colorOptions = [
    { value: 'vibrant', label: 'Vibrant' },
    { value: 'monochrome', label: 'Monochrome' },
    { value: 'pastel', label: 'Pastel' },
    { value: 'dark', label: 'Dark' }
  ];

  const generatePoster = async () => {
    setIsGenerating(true);
    setError(null);

    try {
      const result = await generateEventPoster({
        eventName: event.name,
        date: event.date,
        venue: event.venue?.name || event.address,
        style: style as 'modern' | 'vintage' | 'minimalist' | 'bold',
        colorScheme: colorScheme as 'vibrant' | 'monochrome' | 'pastel' | 'dark',
        customPrompt: customPrompt || undefined
      });

      if (result.success && result.posterUrl) {
        setGeneratedPoster({
          url: result.posterUrl,
          prompt: result.prompt || '',
          metadata: result.metadata || {
            style,
            colorScheme,
            generatedAt: new Date().toISOString()
          }
        });
      } else {
        setError(result.error || 'Failed to generate poster');
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsGenerating(false);
    }
  };

  const downloadPoster = () => {
    if (generatedPoster) {
      // Create a temporary link to download the image
      const link = document.createElement('a');
      link.href = generatedPoster.url;
      link.download = `${event.name.replace(/\s+/g, '-').toLowerCase()}-poster.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Paper shadow="sm" p="xl">
      <Stack gap="lg">
        <div>
          <Title order={2} mb="xs">
            AI Poster Generator
          </Title>
          <Text c="dimmed">
            Generate a custom poster for your event using AI
          </Text>
        </div>

        <Group grow>
          <Select
            label="Style"
            value={style}
            onChange={(value) => setStyle(value || 'modern')}
            data={styleOptions}
          />
          <Select
            label="Color Scheme"
            value={colorScheme}
            onChange={(value) => setColorScheme(value || 'vibrant')}
            data={colorOptions}
          />
        </Group>

        <Group justify="space-between">
          <Button
            variant="subtle"
            size="sm"
            onClick={() => setShowCustomPrompt(!showCustomPrompt)}
          >
            {showCustomPrompt ? 'Hide' : 'Show'} Custom Prompt
          </Button>
        </Group>

        {showCustomPrompt && (
          <Textarea
            label="Custom Prompt"
            placeholder="Add specific instructions for the AI poster generation..."
            value={customPrompt}
            onChange={(event) => setCustomPrompt(event.currentTarget.value)}
            minRows={3}
          />
        )}

        <Group>
          <Button
            onClick={generatePoster}
            loading={isGenerating}
            leftSection={<IconWand size={16} />}
            size="lg"
          >
            {isGenerating ? 'Generating...' : 'Generate Poster'}
          </Button>

          {generatedPoster && (
            <Button
              variant="outline"
              leftSection={<IconRefresh size={16} />}
              onClick={generatePoster}
              disabled={isGenerating}
            >
              Regenerate
            </Button>
          )}
        </Group>

        {error && (
          <Alert color="red" title="Error">
            {error}
          </Alert>
        )}

        {isGenerating && (
          <Paper withBorder p="md">
            <Group>
              <Loader size="sm" />
              <Text>Creating your poster with AI...</Text>
            </Group>
          </Paper>
        )}

        {generatedPoster && (
          <Stack gap="md">
            <Title order={3}>Generated Poster</Title>
            
            <Paper withBorder p="md">
              <Stack gap="md" align="center">
                <Image
                  src={generatedPoster.url}
                  alt={`Generated poster for ${event.name}`}
                  style={{ maxWidth: '400px', width: '100%' }}
                  fallbackSrc="/artist-not-found.svg"
                />
                
                <Group>
                  <Button
                    leftSection={<IconDownload size={16} />}
                    onClick={downloadPoster}
                  >
                    Download Poster
                  </Button>
                </Group>
                
                <Text size="sm" c="dimmed" ta="center">
                  Style: {generatedPoster.metadata.style} | 
                  Colors: {generatedPoster.metadata.colorScheme}
                </Text>
              </Stack>
            </Paper>
          </Stack>
        )}
      </Stack>

      <Modal
        opened={showCustomPrompt}
        onClose={() => setShowCustomPrompt(false)}
        title="Custom Prompt Guidelines"
        size="md"
      >
        <Stack gap="md">
          <Text>
            Use the custom prompt to add specific instructions for your poster:
          </Text>
          <ul>
            <li>Mention specific colors or themes</li>
            <li>Include musical genres or vibes</li>
            <li>Specify layout preferences</li>
            <li>Add special elements or symbols</li>
          </ul>
          <Text size="sm" c="dimmed">
            Example: "Include neon lights, cyberpunk theme, featuring electronic music elements"
          </Text>
        </Stack>
      </Modal>
    </Paper>
  );
}
