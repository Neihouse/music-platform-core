"use client";

import { 
  Container, 
  Grid, 
  Paper, 
  Title, 
  Text, 
  Button, 
  Group, 
  Stack, 
  Card, 
  UnstyledButton,
  Box,
  rem,
  MantineTheme
} from '@mantine/core';
import { IconPlayerPlay } from '@tabler/icons-react';

interface TopTrack {
  id: number;
  title: string;
  artist: string;
}

function TopTrackItem({ title, artist }: TopTrack) {
  return (
    <UnstyledButton
      w="100%"
      p="md"
      display="block"
      style={(theme: MantineTheme) => ({
        borderRadius: theme.radius.md,
        '&:hover': {
          backgroundColor: theme.colors.gray[0],
        },
        transition: 'background-color 150ms ease',
      })}
    >
      <Group wrap="nowrap">
        <IconPlayerPlay 
          size={16} 
          color="var(--mantine-color-blue-5)"
        />
        <Box>
          <Text size="sm" fw={500}>{title}</Text>
          <Text size="sm" c="dimmed">{artist}</Text>
        </Box>
      </Group>
    </UnstyledButton>
  );
}

export default function HomePage() {
  const featuredTrack = {
    id: 1,
    title: "Summer Breeze",
    artist: "Chill Vibes",
    description: "Listen to our top pick",
  };

  const topTracks: TopTrack[] = [
    { id: 1, title: "Midnight Dreams", artist: "Luna" },
    { id: 2, title: "Neon Lights", artist: "The Glow" },
    { id: 3, title: "Ocean Waves", artist: "Serene" },
  ];

  return (
    <Container size="lg" py={rem(48)}>
      <Grid gutter={rem(32)}>
        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Title order={2}>Featured Track</Title>
            <Card padding="xl" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3}>Featured Track of the Day</Title>
                <Text c="dimmed" size="sm">{featuredTrack.description}</Text>
                <Paper 
                  radius="md" 
                  bg="gray.1"
                  style={{ 
                    aspectRatio: '16/9',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text c="dimmed" size="xl">Track Image</Text>
                </Paper>
                <Stack gap="xs">
                  <Title order={4}>{featuredTrack.title}</Title>
                  <Text c="dimmed">{featuredTrack.artist}</Text>
                </Stack>
                <Button 
                  fullWidth 
                  leftSection={<IconPlayerPlay size={20} />}
                  variant="filled"
                  color="dark"
                >
                  Play Now
                </Button>
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>

        <Grid.Col span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Title order={2}>Top Tracks</Title>
            <Card padding="md" radius="md" withBorder>
              <Stack gap="xs">
                {topTracks.map((track) => (
                  <TopTrackItem key={track.id} {...track} />
                ))}
              </Stack>
            </Card>
          </Stack>
        </Grid.Col>
      </Grid>
    </Container>
  );
}
