import { TopTrackItem } from "@/components/TopTrackItem";
import { createClient } from "@/utils/supabase/server";
import {
  Container,
  Grid,
  Paper,
  Title,
  Text,
  Button,
  Stack,
  Card,
  rem,
  GridCol,
} from "@mantine/core";
import { IconPlayerPlay } from "@tabler/icons-react";

export interface IHomePage {}

export default async function HomePage({}: IHomePage) {
  const supabase = await createClient();
  const featuredTrack = {
    id: 1,
    title: "Summer Breeze",
    artist: "Chill Vibes",
    description: "Listen to our top pick",
  };

  const { data: topTracks, error } = await supabase
    .from("tracks")
    .select(
      `
      id,
      title,
      artist_tracks (
        id,
        title
      )`
    )
    .limit(5);

  console.log("topTracks", topTracks);
  console.log("error", error);

  return (
    <Container size="lg" py={rem(48)}>
      <Grid gutter={rem(32)}>
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
          <Stack gap="md">
            <Title order={2}>Top Tracks</Title>
            <Card padding="md" radius="md" withBorder>
              // TODO: Add error state
              {(topTracks || []).map((track) => (
                <TopTrackItem key={track.id} track={track} artists={track} />
              ))}
            </Card>
          </Stack>
        </GridCol>
      </Grid>
    </Container>
  );
}
