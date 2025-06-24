import { Container, Title, Text, SimpleGrid, Card, Group, Stack, Badge, Avatar, Button, Center, ThemeIcon, TextInput, Paper } from "@mantine/core";
import { IconUser, IconMapPin, IconSearch, IconX, IconUserPlus, IconMusic, IconArrowLeft } from "@tabler/icons-react";
import { createClient } from "@/utils/supabase/server";
import { getPromoter } from "@/db/queries/promoters";
import { getArtistsByLocality, getAllArtists } from "@/db/queries/artists";
import { getArtistImagesServer } from "@/lib/image-utils";
import { redirect } from "next/navigation";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  avatar_img: string | null;
  localities?: { id: string; name: string } | null;
  administrative_areas?: { id: string; name: string } | null;
  countries?: { id: string; name: string } | null;
}

interface ArtistWithAvatar extends Artist {
  avatarUrl?: string | null;
}

export default async function PromoterArtistsPage() {
  const supabase = await createClient();
  
  // Get current user and verify they are a promoter
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  const promoter = await getPromoter(supabase);
  if (!promoter) {
    redirect("/promoter");
  }

  // Get artists in the same locality as the promoter
  const localityId = promoter?.promoters_localities?.[0]?.localities?.id;

  const localArtists = await getArtistsByLocality(
    supabase, 
    localityId, 
    undefined, 
    undefined
  );

  // Get all artists as fallback
  const allArtists = localArtists.length === 0 ? await getAllArtists(supabase) : [];

  const artistsToDisplay = localArtists.length > 0 ? localArtists : allArtists;
  const localityName = promoter?.promoters_localities?.[0]?.localities?.name;

  // Fetch avatar URLs for all artists
  const artistsWithAvatars: ArtistWithAvatar[] = await Promise.all(
    artistsToDisplay.map(async (artist) => {
      const { avatarUrl } = artist.id ? await getArtistImagesServer(supabase, artist.id) : { avatarUrl: null };
      return {
        ...artist,
        avatarUrl,
      };
    })
  );

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl" align="flex-start">
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Group gap="md" wrap="nowrap">
            <ThemeIcon size={50} radius="xl" variant="light" color="blue">
              <IconUserPlus size={24} />
            </ThemeIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title order={1}>Add Artists to Your Collective</Title>
              <Text c="dimmed" size="lg">
                {localArtists.length > 0 
                  ? `Artists in your area${localityName ? ` (${localityName})` : ""}`
                  : "All available artists"
                }
              </Text>
            </div>
          </Group>
        </Stack>
        
        <Button 
          component={Link} 
          href="/promoter" 
          variant="light"
          leftSection={<IconArrowLeft size={16} />}
          size="sm"
          style={{ flexShrink: 0 }}
        >
          <Text visibleFrom="sm">Back to Dashboard</Text>
          <Text hiddenFrom="sm">Back</Text>
        </Button>
      </Group>

      {/* Search Bar */}
      <Paper p="md" radius="lg" withBorder mb="xl">
        <Stack gap="md">
          <Group gap="md" wrap="nowrap">
            <IconSearch size={20} style={{ flexShrink: 0 }} />
            <TextInput
              placeholder="Search for artists by name, genre, or location..."
              style={{ flex: 1 }}
              size="md"
            />
          </Group>
          <Group justify="flex-end" visibleFrom="sm">
            <Button variant="light">Search</Button>
          </Group>
          <Button variant="light" fullWidth hiddenFrom="sm">Search</Button>
        </Stack>
      </Paper>

      {/* Filter Info */}
      {localArtists.length > 0 && (
        <Paper p="md" radius="lg" style={{ background: "linear-gradient(45deg, #e3f2fd, #f3e5f5)" }} mb="xl">
          <Group gap="md">
            <ThemeIcon size={40} radius="xl" variant="light" color="green">
              <IconMapPin size={20} />
            </ThemeIcon>
            <div>
              <Text fw={600} c="dark">Local Artists Found!</Text>
              <Text size="sm" c="dimmed">
                Showing {localArtists.length} artists from your locality{localityName ? `: ${localityName}` : ""}
              </Text>
            </div>
          </Group>
        </Paper>
      )}

      {/* Artists Grid */}
      {artistsWithAvatars.length > 0 ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: "md", sm: "lg" }}>
          {artistsWithAvatars.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </SimpleGrid>
      ) : (
        <Center py="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" variant="light" color="gray">
              <IconUser size={40} />
            </ThemeIcon>
            <Title order={3} c="dimmed">No Artists Found</Title>
            <Text c="dimmed" ta="center">
              No artists available in your area. Try expanding your search.
            </Text>
            <Button variant="light" component={Link} href="/artists">Browse All Artists</Button>
          </Stack>
        </Center>
      )}

      {/* Call to Action */}
      <Paper p="xl" radius="xl" mt="xl" style={{ background: "linear-gradient(45deg, #667eea, #764ba2)", color: "white" }}>
        <Stack align="center" gap="md">
          <ThemeIcon size={60} radius="xl" variant="white" color="blue">
            <IconMusic size={30} />
          </ThemeIcon>
          <Title order={2} ta="center">Don't See the Artist You're Looking For?</Title>
          <Text ta="center" size="lg" opacity={0.9}>
            Encourage them to join our platform and grow the local music scene together!
          </Text>
          <Button size="lg" variant="white" color="dark">
            Invite Artist to Join
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

function ArtistCard({ artist }: { artist: ArtistWithAvatar }) {
  const getLocationText = () => {
    if (artist.localities?.name) return artist.localities.name;
    if (artist.administrative_areas?.name) return artist.administrative_areas.name;
    if (artist.countries?.name) return artist.countries.name;
    return "Location not specified";
  };

  return (
    <Card
      p={{ base: "md", sm: "lg" }}
      radius="xl"
      withBorder
      h="100%"
      style={{
        transition: "all 0.2s ease",
        cursor: "pointer",
      }}
      styles={{
        root: {
          "&:hover": {
            transform: "translateY(-4px)",
            boxShadow: "0 12px 24px rgba(0,0,0,0.15)",
          },
        },
      }}
    >
      <Stack gap="md" h="100%" align="center">
        {/* Avatar */}
        <Avatar
          src={artist.avatarUrl}
          size={80}
          radius="xl"
          style={{
            border: "3px solid var(--mantine-color-blue-3)",
          }}
        >
          {artist.name?.[0]?.toUpperCase()}
        </Avatar>
        
        {/* Artist Info */}
        <Stack gap="xs" align="center" style={{ flex: 1 }}>
          <Text fw={700} size="lg" ta="center" lineClamp={1}>
            {artist.name}
          </Text>
          
          {/* Location */}
          <Group gap="xs" justify="center">
            <IconMapPin size={14} style={{ color: "var(--mantine-color-dimmed)" }} />
            <Text size="xs" c="dimmed" ta="center" lineClamp={1}>
              {getLocationText()}
            </Text>
          </Group>
          
          {/* Bio */}
          {artist.bio && (
            <Text size="sm" c="dimmed" ta="center" lineClamp={3} style={{ flex: 1 }}>
              {artist.bio}
            </Text>
          )}
        </Stack>

        {/* Action Buttons */}
        <Stack gap="xs" style={{ width: "100%" }}>
          <Button
            variant="light"
            size="sm"
            fullWidth
            leftSection={<IconUser size={16} />}
            component={Link}
            href={`/artists/${nameToUrl(artist.name)}`}
          >
            View Profile
          </Button>
          <Button
            size="sm"
            fullWidth
            leftSection={<IconUserPlus size={16} />}
            color="green"
          >
            Invite Artist
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
