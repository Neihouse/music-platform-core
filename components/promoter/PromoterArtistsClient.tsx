"use client";

import { Container, Title, Text, SimpleGrid, Card, Group, Stack, Badge, Avatar, Button, Center, ThemeIcon, TextInput, Paper, Switch } from "@mantine/core";
import { IconUser, IconMapPin, IconSearch, IconX, IconUserPlus, IconMusic, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";
import { useState } from "react";

interface Artist {
  id: string;
  name: string;
  bio: string | null;
  avatar_img: string | null;
  avatarUrl?: string | null;
  localities?: { id: string; name: string } | null;
  administrative_areas?: { id: string; name: string } | null;
  countries?: { id: string; name: string } | null;
  storedLocality?: {
    locality: { id: string; name: string };
    administrativeArea: { id: string; name: string };
    country: { id: string; name: string };
    fullAddress: undefined;
  };
}

interface PromoterArtistsClientProps {
  localityArtists: Artist[];
  promoterLocalityArtists: Artist[];
  localityName?: string;
}

export default function PromoterArtistsClient({ 
  localityArtists, 
  promoterLocalityArtists, 
  localityName 
}: PromoterArtistsClientProps) {
  const [filterByPromoterLocality, setFilterByPromoterLocality] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Determine which artists to show based on the toggle
  const baseArtists = filterByPromoterLocality ? promoterLocalityArtists : localityArtists;
  
  // Filter by search term
  const filteredArtists = baseArtists.filter(artist => 
    artist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    artist.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLocationText(artist).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLocationText = (artist: Artist) => {
    if (artist.storedLocality) {
      return `${artist.storedLocality.locality.name}, ${artist.storedLocality.administrativeArea.name}, ${artist.storedLocality.country.name}`;
    }
    if (artist.localities?.name) return artist.localities.name;
    if (artist.administrative_areas?.name) return artist.administrative_areas.name;
    if (artist.countries?.name) return artist.countries.name;
    return "Location not specified";
  };

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
                {filterByPromoterLocality 
                  ? `Artists in your shared localities${localityName ? ` (including ${localityName})` : ""}`
                  : `Artists in your primary area${localityName ? ` (${localityName})` : ""}`
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

      {/* Filter Controls */}
      <Paper p="md" radius="lg" withBorder mb="xl">
        <Stack gap="md">
          {/* Search Bar */}
          <Group gap="md" wrap="nowrap">
            <IconSearch size={20} style={{ flexShrink: 0 }} />
            <TextInput
              placeholder="Search for artists by name, genre, or location..."
              style={{ flex: 1 }}
              size="md"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.currentTarget.value)}
              rightSection={searchTerm && (
                <IconX 
                  size={16} 
                  style={{ cursor: 'pointer' }} 
                  onClick={() => setSearchTerm("")}
                />
              )}
            />
          </Group>

          {/* Locality Filter Toggle */}
          <Group justify="space-between" wrap="nowrap">
            <div>
              <Text fw={500} size="sm">Filter by shared localities</Text>
              <Text size="xs" c="dimmed">
                Show only artists in areas where you also promote
              </Text>
            </div>
            <Switch
              checked={filterByPromoterLocality}
              onChange={(event) => setFilterByPromoterLocality(event.currentTarget.checked)}
              size="md"
              color="blue"
            />
          </Group>
        </Stack>
      </Paper>
     

      {/* Artists Grid */}
      {filteredArtists.length > 0 ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: "md", sm: "lg" }}>
          {filteredArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} getLocationText={getLocationText} />
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
              {searchTerm 
                ? `No artists found matching "${searchTerm}". Try a different search term.`
                : filterByPromoterLocality
                  ? "No artists found in your shared localities. Try unchecking the locality filter."
                  : "No artists available in your area. Try expanding your search."
              }
            </Text>
            {searchTerm && (
              <Button variant="light" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
            {!searchTerm && filterByPromoterLocality && (
              <Button variant="light" onClick={() => setFilterByPromoterLocality(false)}>
                Show All Local Artists
              </Button>
            )}
            {!searchTerm && !filterByPromoterLocality && (
              <Button variant="light" component={Link} href="/artists">
                Browse All Artists
              </Button>
            )}
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

function ArtistCard({ 
  artist, 
  getLocationText 
}: { 
  artist: Artist; 
  getLocationText: (artist: Artist) => string;
}) {
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
              {getLocationText(artist)}
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
