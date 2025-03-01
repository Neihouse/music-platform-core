import { TopTrackItem } from "@/components/TopTrackItem";
import { TopTracks } from "@/components/TopTracks";
import { createClient } from "@/utils/supabase/server";
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
  MantineTheme,
  GridCol,
} from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

export default async function HomePage() {
  const featuredTrack = {
    id: 1,
    title: "Summer Breeze",
    artist: "Chill Vibes",
    description: "Listen to our top pick",
  };

  const { data: topTracks } = await (await createClient())
    .from("tracks")
    .select()
    .eq("featured", "true");

  return (
    <Container size="lg" py={48}>
      <Grid gutter={32}>
        <GridCol span={{ base: 12, md: 6 }}>
          <Stack gap="md">
            <Title order={2}>Featured Track</Title>
            <Card padding="xl" radius="md" withBorder>
              <Stack gap="md">
                <Title order={3}>Featured Track of the Day</Title>
                <Text c="dimmed" size="sm">
                  {featuredTrack.description}
                </Text>
                <Paper
                  radius="md"
                  bg="gray.1"
                  style={{
                    aspectRatio: "16/9",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text c="dimmed" size="xl">
                    Track Image
                  </Text>
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
        </GridCol>

        <GridCol span={{ base: 12, md: 6 }}>
          <TopTracks tracks={topTracks as any[]} />
        </GridCol>
      </Grid>
    </Container>
  );
}
