import {
  Grid,
  GridCol,
  Group,
  Stack,
  Title,
  Badge,
  Card,
  Skeleton,
  Text,
  Image,
  Button,
} from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import Link from "next/link";
import { TrackList } from "@/components/Tracks/TrackList";
import { ExternalLinksDisplay } from "@/components/ExternalLinksDisplay";
import { nameToUrl } from "@/lib/utils";
import { Artist, StoredLocality } from "@/utils/supabase/global.types";
import { ArtistTrackWithPlayCount } from "@/db/queries/tracks";

interface ArtistProfileContentProps {
  artist: Artist;
  storedLocality?: StoredLocality;
  canEdit: boolean;
  tracksWithPlayCounts: ArtistTrackWithPlayCount[];
  avatarUrl: string | null;
  bannerUrl: string | null;
}

const ArtistProfileContent = ({
  artist,
  storedLocality,
  canEdit,
  tracksWithPlayCounts,
  avatarUrl,
  bannerUrl,
}: ArtistProfileContentProps) => {
  const { name, bio, external_links } = artist;

  return (
    <div style={{ padding: '1rem' }}>
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
                {canEdit && <Button component={Link} href={`/artists/${nameToUrl(name)}/edit`}><IconEdit size={16} /></Button>}
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

        {/* Artist Info Section */}
        <Stack gap="md" mb="xl">
          {/* Bio */}
          {bio && (
            <div>
              <Title order={3} mb="xs">
                About
              </Title>
              <Text size="sm" c="dimmed">
                {bio}
              </Text>
            </div>
          )}

          {/* Location */}
          {storedLocality && (
            <div>
              <Title order={3} mb="xs">
                Location
              </Title>
              <Text size="sm" c="dimmed">
                {storedLocality.locality.name}, {storedLocality.administrativeArea.name}, {storedLocality.country.name}
              </Text>
            </div>
          )}

          {/* External Links */}
          {external_links && external_links.length > 0 && (
            <div>
              <Title order={3} mb="xs">
                Links
              </Title>
              <ExternalLinksDisplay links={external_links} />
            </div>
          )}
        </Stack>

        {/* Tracks Section */}
        <TrackList
          tracks={tracksWithPlayCounts}
          artist={artist}
          canDelete={canEdit}
        />
      </GridCol>

      {/* Upcoming Events Section */}
      <GridCol span={{ base: 12, md: 4 }}>
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
    </div>
  );
};

export default ArtistProfileContent;
