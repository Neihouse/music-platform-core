"use client";

import PlaybackContext from "@/lib/PlayerContext";
import { Artist, Track } from "@/utils/supabase/global.types";
import { UnstyledButton, MantineTheme, Group, Box, Text } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";
import { useContext } from "react";

export interface ITopTrackItem {
  track: Track;
  artists: Artist[];
  plays: number;
}

export function TopTrackItem({
  track: { title: trackTitle, id: trackId },
  artists,
  plays,
}: ITopTrackItem) {
  const { setTrackId } = useContext(PlaybackContext);
  return (
    <UnstyledButton
      w="100%"
      p="md"
      display="block"
      style={(theme: MantineTheme) => ({
        borderRadius: theme.radius.md,
        "&:hover": {
          backgroundColor: theme.colors.gray[0],
        },
        transition: "background-color 150ms ease",
      })}
      onClick={() => setTrackId(trackId)}
    >
      <Group wrap="nowrap">
        <IconPlayerPlay size={16} color="var(--mantine-color-blue-5)" />
        <Box>
          <Text size="sm" fw={500}>
            {trackTitle}
          </Text>
          <Group>
            <Text size="xs" c="dimmed">
              {plays} plays
            </Text>
            <Text size="sm" c="dimmed">
              {artists.map((artist) => artist.name).join(", ")}
            </Text>
          </Group>
        </Box>
      </Group>
    </UnstyledButton>
  );
}
