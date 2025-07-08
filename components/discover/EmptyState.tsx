'use client';

import { createClient } from "@/utils/supabase/client";
import { Box, Button, Stack, Text, ThemeIcon, useMantineColorScheme } from "@mantine/core";
import { IconMapOff, IconPlus } from "@tabler/icons-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface EmptyStateProps {
  cityName: string;
  onTryAgain: () => void;
}

export function EmptyState({ cityName, onTryAgain }: EmptyStateProps) {
  const { colorScheme } = useMantineColorScheme();
  const isDark = colorScheme === 'dark';
  const router = useRouter();
  const [userType, setUserType] = useState<'artist' | 'promoter' | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function checkUserType() {
      try {
        const supabase = createClient();

        // Get current user
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) {
          setUserType(null);
          setIsLoading(false);
          return;
        }

        // Check if user is an artist
        const { data: artist, error: artistError } = await supabase
          .from("artists")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!artistError && artist) {
          setUserType('artist');
          setIsLoading(false);
          return;
        }

        // Check if user is a promoter
        const { data: promoter, error: promoterError } = await supabase
          .from("promoters")
          .select("id")
          .eq("user_id", user.id)
          .maybeSingle();

        if (!promoterError && promoter) {
          setUserType('promoter');
          setIsLoading(false);
          return;
        }

        // No profile found
        setUserType(null);
      } catch (error) {
        console.error('Error fetching user profile:', error);
        setUserType(null);
      } finally {
        setIsLoading(false);
      }
    }

    checkUserType();
  }, []);

  const handleJoinCall = () => {
    // Redirect to signup/onboarding to help them become part of the music scene
    router.push('/signup');
  };

  // Don't show the CTA for artists or promoters - they can already contribute
  if (isLoading) {
    return null; // or a loading spinner
  }

  if (userType === 'artist' || userType === 'promoter') {
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
              leftSection={<IconPlus size={16} />}
              variant="gradient"
              gradient={{ from: 'blue', to: 'teal' }}
              onClick={onTryAgain}
            >
              Try Another City
            </Button>
            <Text ta="center" size="sm" c="dimmed">
              Or search for popular cities like New York, Los Angeles, Chicago
            </Text>
          </Stack>
        </Stack>
      </Box>
    );
  }

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
            leftSection={<IconPlus size={16} />}
            variant="gradient"
            gradient={{ from: 'blue', to: 'teal' }}
            onClick={handleJoinCall}
          >
            Join & Build Scene
          </Button>
          <Text ta="center" size="sm" c="dimmed">
            Be the first to add artists, venues, and events to your city
          </Text>
        </Stack>
      </Stack>
    </Box>
  );
}
