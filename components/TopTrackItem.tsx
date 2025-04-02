import { Artist, Track } from "@/utils/supabase/global.types";
import { UnstyledButton, MantineTheme, Group, Box, Text } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

export interface ITopTrackItem {
  track: Track;
  artist: Artist;
}

export function TopTrackItem({
  track: { title: trackTitle },
  artist: { title: artistTitle },
}: ITopTrackItem) {
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
    >
      <Group wrap="nowrap">
        <IconPlayerPlay size={16} color="var(--mantine-color-blue-5)" />
        <Box>
          d
          <Text size="sm" fw={500}>
            {trackTitle}
          </Text>
          <Text size="sm" c="dimmed">
            {artistTitle}
          </Text>
        </Box>
      </Group>
    </UnstyledButton>
  );
}
