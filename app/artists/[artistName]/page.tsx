import { getArtistByName } from "@/db/queries/artists";
import { getUser } from "@/db/queries/users";
import { getArtistTracksWithPlayCounts } from "@/db/queries/tracks";
import { getArtistAvatarUrlServer, getArtistBannerUrlServer } from "@/lib/image-utils";
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
  Button,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { TrackList } from "@/components/Tracks/TrackList";
import { ExternalLinksDisplay } from "@/components/ExternalLinksDisplay";

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
  
  // Get tracks with play counts instead of using the basic track data
  const tracksWithPlayCounts = artist.id ? await getArtistTracksWithPlayCounts(supabase, artist.id) : [];

  // Get dynamic image URLs
  const avatarUrl = artist.id ? await getArtistAvatarUrlServer(artist.id) : null;
  const bannerUrl = artist.id ? await getArtistBannerUrlServer(artist.id) : null;

  const { name, bio, tracks, external_links } = artist;
  return (
    <Container>
      <Grid gutter="lg">
        {/* Main Content */}
        <GridCol span={{ base: 12, md: 8 }}>
          {/* Artist Header */}
          <div style={{ position: "relative", height: "200px", marginBottom: "2rem" }}>
            <Image
              src={bannerUrl} 
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
                src={avatarUrl}
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
          <TrackList
            tracks={tracksWithPlayCounts}
            artist={{
              id: artist.id!,
              name: artist.name!,
              bio: artist.bio!,
              created_at: artist.created_at!,
              user_id: artist.user_id!,
              administrative_area_id: artist.administrative_area || null,
              locality_id: artist.locality || null,
              country_id: null,
              external_links: artist.external_links || [],
            }}
            canDelete={userIsArtist}
          />
        </GridCol>

        {/* Upcoming Events Section */}
        <GridCol span={{ base: 12, md: 4 }}>
          <Title order={3} mb="md">
            Bio
          </Title>
          <Text size="sm" c="dimmed">
            {bio || "No bio available."}
          </Text>
          
          {/* External Links Section */}
          {external_links && external_links.length > 0 && (
            <>
              <Divider my="md" />
              <ExternalLinksDisplay links={external_links} />
            </>
          )}
          
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
