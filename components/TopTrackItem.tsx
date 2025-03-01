import { createClient } from "@/utils/supabase/client";
import { UnstyledButton, MantineTheme, Group, Box, Text } from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

export function TopTrackItem({ title, id }: { title: string; id: string }) {
  return (
    <UnstyledButton w="100%" p="md" display="block">
      <Group wrap="nowrap">
        <IconPlayerPlay size={16} color="var(--mantine-color-blue-5)" />
        <Box>
          <Text size="sm" fw={500}>
            {title}
          </Text>
          {/* <Text size="sm" c="dimmed">
            {artist}
          </Text> */}
        </Box>
      </Group>
    </UnstyledButton>
  );

  async function playSong(id: string) {
    const client = await createClient();

    const data = await client.storage.from("tracks").download(id);

    data.data.
  }
}
