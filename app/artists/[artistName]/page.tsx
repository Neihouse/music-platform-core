import { getArtistByName } from "@/db/queries/artists";
import { formatDuration } from "@/lib/formatting";
import { createClient } from "@/utils/supabase/server";
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
  Image,
} from "@mantine/core";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) {
  const { artistName } = await params;
  const { name, bio, tracks } = await getArtistByName(
    await createClient(),
    artistName
  );

  return (
    <Container>
      <Grid gutter="lg">
        {/* Main Content */}
        <GridCol span={8}>
          {/* Artist Header */}
          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <Image
              src="https://i1.sndcdn.com/visuals-PzeCi6m2YKysjZ7C-2pyiyA-t2480x520.jpg"
              alt={`${name} banner`}
              style={{
                width: "100%",
                height: "200px",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "200px",
                background:
                  "linear-gradient(to bottom, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0))", // Darker gradient
                zIndex: 0,
              }}
            />
            <div
              style={{
                position: "absolute",
                top: "1rem",
                left: "1rem",
                zIndex: 1,
                color: "white",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
              }}
            >
              <Image
                src="https://i1.sndcdn.com/avatars-YMlrZVHCf2EwCAsA-kL7awg-t1080x1080.jpg"
                alt={`${name} avatar`}
                w={64} // Twice the font size of the title
                h={64} // Twice the font size of the title
                radius="xl"
              />
              <div>
                <Title style={{ color: "white" }}>{name}</Title>
                <Group gap="sm">
                  {["house", "rock"].map((genre) => (
                    <Badge key={genre} color="dark">
                      {genre}
                    </Badge>
                  ))}
                </Group>
              </div>
            </div>
            <Group
              align="center"
              gap="lg"
              style={{ position: "relative", zIndex: 1, paddingTop: "150px" }}
            >
              <Stack>
                <Text size="sm" c="dimmed">
                  {bio || "No bio available."}
                </Text>
              </Stack>
            </Group>
          </div>
          <Divider my="lg" />

          {/* Tracks Section */}
          <Stack gap="md">
            <Title order={2}>Tracks</Title>
            {tracks?.map(({ title, duration, id }) => (
              <Card key={title} withBorder shadow="sm" radius="md">
                <Group justify="space-between">
                  <Stack>
                    <Text fw={500}>{title || "F"}</Text>
                    <Text size="sm" c="dimmed">
                      {formatDuration(duration)}
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
