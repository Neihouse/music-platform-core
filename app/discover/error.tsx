'use client';

import { Container, Title, Text, Button, Stack, Paper, ThemeIcon, rem } from "@mantine/core";
import { IconAlertTriangle, IconRefresh } from "@tabler/icons-react";
import { useEffect } from 'react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Discover page error:', error);
  }, [error]);

  return (
    <Container size="sm" py="xl">
      <Paper p="xl" radius="lg" withBorder style={{ textAlign: 'center' }}>
        <Stack align="center" gap="lg">
          <ThemeIcon 
            size={rem(80)} 
            radius="xl" 
            variant="light" 
            color="red"
          >
            <IconAlertTriangle size={40} />
          </ThemeIcon>
          
          <Stack align="center" gap="sm">
            <Title order={2} size={rem(24)}>
              Something went wrong!
            </Title>
            <Text c="dimmed" ta="center" maw={400}>
              We encountered an error while loading the music discovery page. 
              This might be a temporary issue with our servers.
            </Text>
          </Stack>

          <Button
            leftSection={<IconRefresh size={16} />}
            onClick={reset}
            size="lg"
            radius="xl"
            variant="gradient"
            gradient={{ from: 'blue', to: 'cyan' }}
          >
            Try again
          </Button>
          
          {process.env.NODE_ENV === 'development' && (
            <details style={{ marginTop: rem(20), textAlign: 'left' }}>
              <summary>Error details (development only)</summary>
              <pre style={{ 
                fontSize: '12px', 
                background: 'var(--mantine-color-gray-0)', 
                padding: '10px', 
                borderRadius: '4px',
                overflow: 'auto',
                maxWidth: '100%'
              }}>
                {error.message}
              </pre>
            </details>
          )}
        </Stack>
      </Paper>
    </Container>
  );
}
