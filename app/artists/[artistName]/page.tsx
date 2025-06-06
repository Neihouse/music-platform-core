import { getArtistByName } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
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
  Center,
  Button,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artistName: string }>;
}) {
  const { artistName } = await params;
  const supabase = await createClient();
  const user = await getUser(supabase);
  const artist = await getArtistByName(supabase, artistName);

  if (!artist) {
    notFound();
  }

  const userIsArtist = user?.id === artist.user_id;

  const { name, bio, tracks } = artist;
  return (
    <Container>
      <Grid gutter="lg">
        {/* Main Content */}
        <GridCol span={8}>
          {/* Artist Header */}
          <div style={{ position: "relative", marginBottom: "2rem" }}>
            <Image
              src="https://i1.sndcdn.com/visuals-PzeCi6m2YKysjZ7C-2pyiyA-t2480x520.jpg"
              alt={`${artist.name} banner`}
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
                <Group>
                  <Title style={{ color: "white" }}>{name}</Title>
                  {userIsArtist && <Button component={Link} href={`/artists/${name}/edit`}><IconEdit size={16} /></Button>}
                </Group>
                <Group gap="sm">
                  {["house", "rock"].map((genre) => (
                    <Badge key={genre} color="dark">
                      {genre}
                    </Badge>
                  ))}
                </Group>
              </div>
            </div>
          </div>

          {/* Tracks Section */}
          <Stack gap="md">
            {!tracks.length ? (
              <Center mt={50}>
                <Text c="dimmed" size="sm">
                  <em>No tracks yet</em>
                </Text>
              </Center>
            ) : (
              tracks?.map(({ title, duration, id }) => (
                <Card key={id} withBorder shadow="sm" radius="md">
                  <Group justify="space-between">
                    <Stack>
                      <Text fw={500}>{title || "F"}</Text>
                      <Text size="sm" c="dimmed">
                        {formatDuration(duration)}
                      </Text>
                    </Stack>
                    <Image
                      src={"https://via.placeholder.com/100"}
                      alt={`${title} cover`}
                      width={100}
                      height={100}
                      radius="sm"
                    />
                  </Group>
                </Card>
              ))
            )}
          </Stack>
        </GridCol>

        {/* Upcoming Events Section */}
        <GridCol span={4}>
          <Title order={3} mb="md">
            Bio
          </Title>
          <Text size="sm" c="dimmed">
            {bio || "No bio available."}
          </Text>
          <Divider my="md" />
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
