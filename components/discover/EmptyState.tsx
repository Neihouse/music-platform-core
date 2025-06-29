'use client';

import { Box, Text, ThemeIcon, Stack, Button, useMantineColorScheme } from "@mantine/core";
import { IconMapOff, IconSearch, IconSparkles } from "@tabler/icons-react";

interface EmptyStateProps {
  cityName: string;
  onTryAgain: () => void;
}

export function EmptyState({ cityName, onTryAgain }: EmptyStateProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <Box
      py={80}
      style={{
        background: isDark
          ? 'linear-gradient(135deg, var(--mantine-color-dark-7), var(--mantine-color-gray-8))'
          : 'linear-gradient(135deg, var(--mantine-color-gray-1), var(--mantine-color-blue-0))',
        borderRadius: 'var(--mantine-radius-lg)',
        border: '1px dashed var(--mantine-color-gray-4)',
      }}
    >
      <Stack align="center" gap="xl">
        <ThemeIcon 
          size={120} 
          radius="xl" 
          variant="light" 
          color="gray"
        >
          <IconMapOff size={60} />
        </ThemeIcon>
        
        <Stack align="center" gap="md">
          <Text size="xl" fw={600} ta="center">
            No music scene data found for "{cityName}"
          </Text>
          <Text size="md" c="dimmed" ta="center" maw={400}>
            We couldn't find any artists, venues, or events in this city yet. 
            This could mean the city isn't in our database or there's no data available.
          </Text>
        </Stack>

        <Stack align="center" gap="sm">
          <Button
            leftSection={<IconSearch size={16} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'teal' }}
            onClick={onTryAgain}
          >
            Try Another City
          </Button>
          <Text size="sm" c="dimmed">
            Or try popular cities like New York, Los Angeles, Chicago, or Austin
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
