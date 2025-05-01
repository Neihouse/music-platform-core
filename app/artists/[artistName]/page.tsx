import { getArtistByName } from "@/db/queries/artists";
import {
  Container,
  Grid,
  GridCol,
  Group,
  Stack,
  Title,
  Badge,
  Divider,
  Card,
  Skeleton,
  Text,
} from "@mantine/core";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) {
  const { artistName } = await params;
  const artist = await getArtistByName(artistName);

  const tracks = artist.artists_tracks;

  return (
    <Container>
      <Grid gutter="lg">
        {/* Main Content */}
        <GridCol span={8}>
          {/* Artist Header */}
          <Group align="center" gap="lg" mb="xl">
            {/* <Image
              src={"https://via.placeholder.com/150"}
              alt={`${artist.name} avatar`}
              width={150}
              height={150}
              radius="xl"
            /> */}
            <Stack>
              <Title>{artist.name}</Title>
              <Text size="sm" c="dimmed">
                {artist.bio || "No bio available."}
              </Text>
              <Group gap="sm">
                {["house", "rock"].map((genre) => (
                  <Badge key={genre}>{genre}</Badge>
                ))}
              </Group>
            </Stack>
          </Group>

          <Divider my="lg" />

          {/* Tracks Section */}
          <Stack gap="md">
            <Title order={2}>Tracks</Title>
            {tracks.map((track) => (
              <Card key={track.track_id.id} withBorder shadow="sm" radius="md">
                <Group justify="space-between">
                  <Stack>
                    <Text fw={500}>{track.track_id.title}</Text>
                    <Text size="sm" c="dimmed">
                      {track.track_id.length} minutes
                    </Text>
                  </Stack>
                  {/* <Image
                    src={"https://via.placeholder.com/100"}
                    alt={`${track.track_id.title} cover`}
                    width={100}
                    height={100}
                    radius="sm"
                  /> */}
                </Group>
              </Card>
            ))}
          </Stack>
        </GridCol>

        {/* Upcoming Events Section */}
        <GridCol span={4}>
          <Title order={3} mb="md">
            Upcoming Events
          </Title>
          <Stack gap="sm">
            {[...Array(3)].map((_, index) => (
              <Card key={index} withBorder shadow="sm" radius="md">
                <Skeleton height={20} width="70%" mb="xs" />
                <Skeleton height={15} width="50%" />
                <Skeleton height={15} width="30%" mt="xs" />
              </Card>
            ))}
          </Stack>
        </GridCol>
      </Grid>
    </Container>
  );
}
