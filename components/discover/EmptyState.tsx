'use client';

import { Box, Button, Stack, Text, ThemeIcon, useMantineColorScheme } from "@mantine/core";
import { IconMapOff, IconPlus } from "@tabler/icons-react";
import Link from "next/link";

interface EmptyStateProps {
  cityName: string;
  onTryAgain: () => void;
  isLoggedIn: boolean | null;
}

export function EmptyState({ cityName, onTryAgain, isLoggedIn }: EmptyStateProps) {
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
          {!isLoggedIn && (
            <>
              <Button
                component={Link}
                href="/signup"
                leftSection={<IconPlus size={16} />}
                variant="gradient"
                gradient={{ from: 'blue', to: 'teal' }}
              >
                Join & Build Scene
              </Button>
              <Text ta="center" size="sm" c="dimmed">
                Be the first to add artists, venues, and events to your city
              </Text>
            </>
          )}
        </Stack>
      </Stack>
    </Box>
  );
}
