"use client";

import { Container, Title, Paper, Group, Text, Stack, ActionIcon, Collapse, UnstyledButton } from '@mantine/core';
import { IconChevronUp, IconChevronDown } from '@tabler/icons-react';
import { useState } from 'react';

interface Track {
  id: number;
  title: string;
  artist: string;
  votes: number;
}

function TrackItem({ artist }: { artist: string }) {
  return (
    <UnstyledButton
      component="div"
      px="md"
      py="xs"
      className="hover:bg-gray-50 transition-colors w-full"
    >
      <Text size="sm" c="dimmed">
        {artist}
      </Text>
    </UnstyledButton>
  );
}

function TrackSection({ title, tracks, voteCount }: { 
  title: string; 
  tracks: Track[]; 
  voteCount: number;
}) {
  const [opened, setOpened] = useState(true);

  return (
    <Paper radius="md" withBorder>
      <UnstyledButton
        component="div"
        p="md"
        className="w-full"
        onClick={() => setOpened(o => !o)}
      >
        <Group justify="space-between">
          <Text fw={500} size="lg">{title}</Text>
          <Group gap={4}>
            <Text size="sm" c="dimmed">{voteCount}</Text>
            <ActionIcon variant="subtle" size="sm">
              {opened ? <IconChevronUp size={16} /> : <IconChevronDown size={16} />}
            </ActionIcon>
          </Group>
        </Group>
      </UnstyledButton>
      
      <Collapse in={opened}>
        <Stack gap={0}>
          {tracks.map((track) => (
            <TrackItem key={track.id} artist={track.artist} />
          ))}
        </Stack>
      </Collapse>
    </Paper>
  );
}

export default function DiscoverPage() {
  const newReleases: Track[] = [
    { id: 1, title: "Track 1", artist: "Artist Name", votes: 10 },
  ];

  const popularTracks: Track[] = [
    { id: 2, title: "Track 2", artist: "Another Artist", votes: 20 },
  ];

  return (
    <Container size="lg" py="xl">
      <Title order={1} mb="xl">Discover New Music</Title>

      <Stack gap="lg">
        <TrackSection 
          title="New Release" 
          tracks={newReleases}
          voteCount={10}
        />

        <TrackSection 
          title="Popular Track" 
          tracks={popularTracks}
          voteCount={20}
        />
      </Stack>
    </Container>
  );
}
