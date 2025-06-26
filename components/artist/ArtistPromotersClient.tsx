"use client";

import { Container, Title, Text, SimpleGrid, Card, Group, Stack, Avatar, Button, Center, ThemeIcon, TextInput, Paper, Switch } from "@mantine/core";
import { IconUser, IconMapPin, IconSearch, IconX, IconUserPlus, IconSparkles, IconArrowLeft } from "@tabler/icons-react";
import Link from "next/link";
import { nameToUrl } from "@/lib/utils";
import { useState } from "react";

interface Promoter {
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

interface ArtistPromotersClientProps {
  localityPromoters: Promoter[];
  artistLocalityPromoters: Promoter[];
  localityName?: string;
}

export default function ArtistPromotersClient({ 
  localityPromoters, 
  artistLocalityPromoters, 
  localityName 
}: ArtistPromotersClientProps) {
  const [filterByArtistLocality, setFilterByArtistLocality] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Determine which promoters to show based on the toggle
  const basePromoters = filterByArtistLocality ? artistLocalityPromoters : localityPromoters;
  
  // Filter by search term
  const filteredPromoters = basePromoters.filter(promoter => 
    promoter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promoter.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLocationText(promoter).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLocationText = (promoter: Promoter) => {
    if (promoter.storedLocality) {
      return `${promoter.storedLocality.locality.name}, ${promoter.storedLocality.administrativeArea.name}, ${promoter.storedLocality.country.name}`;
    }
    if (promoter.localities?.name) return promoter.localities.name;
    if (promoter.administrative_areas?.name) return promoter.administrative_areas.name;
    if (promoter.countries?.name) return promoter.countries.name;
    return "Location not specified";
  };

  return (
    <Container size="xl" py="xl">
      {/* Header */}
      <Group justify="space-between" mb="xl" align="flex-start">
        <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
          <Group gap="md" wrap="nowrap">
            <ThemeIcon size={50} radius="xl" variant="light" color="orange">
              <IconUserPlus size={24} />
            </ThemeIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title order={1}>Connect with Promoters</Title>
              <Text c="dimmed" size="lg">
                {filterByArtistLocality 
                  ? `Promoters in your shared localities${localityName ? ` (including ${localityName})` : ""}`
                  : `Promoters in your primary area${localityName ? ` (${localityName})` : ""}`
                }
              </Text>
            </div>
          </Group>
        </Stack>
        
        <Button 
          component={Link} 
          href="/artist" 
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
              placeholder="Search for promoters by name, bio, or location..."
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
              <Text fw={500} size="sm">Show promoters in your localities only</Text>
              <Text size="xs" c="dimmed">
                {filterByArtistLocality 
                  ? "Currently showing only promoters in your shared localities" 
                  : "Currently showing all promoters regardless of location"
                }
              </Text>
            </div>
            <Switch
              checked={filterByArtistLocality}
              onChange={(event) => setFilterByArtistLocality(event.currentTarget.checked)}
              size="md"
              color="orange"
            />
          </Group>
        </Stack>
      </Paper>
     

      {/* Promoters Grid */}
      {filteredPromoters.length > 0 ? (
        <SimpleGrid cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }} spacing={{ base: "md", sm: "lg" }}>
          {filteredPromoters.map((promoter) => (
            <PromoterCard key={promoter.id} promoter={promoter} getLocationText={getLocationText} />
          ))}
        </SimpleGrid>
      ) : (
        <Center py="xl">
          <Stack align="center" gap="md">
            <ThemeIcon size={80} radius="xl" variant="light" color="gray">
              <IconUser size={40} />
            </ThemeIcon>
            <Title order={3} c="dimmed">No Promoters Found</Title>
            <Text c="dimmed" ta="center">
              {searchTerm 
                ? `No promoters found matching "${searchTerm}". Try a different search term.`
                : filterByArtistLocality
                  ? "No promoters found in your shared localities. Try unchecking the locality filter."
                  : "No promoters available in your area. Try expanding your search."
              }
            </Text>
            {searchTerm && (
              <Button variant="light" onClick={() => setSearchTerm("")}>
                Clear Search
              </Button>
            )}
            {!searchTerm && filterByArtistLocality && (
              <Button variant="light" onClick={() => setFilterByArtistLocality(false)}>
                Show All Local Promoters
              </Button>
            )}
            {!searchTerm && !filterByArtistLocality && (
              <Button variant="light" component={Link} href="/promoters">
                Browse All Promoters
              </Button>
            )}
          </Stack>
        </Center>
      )}

      {/* Call to Action */}
      <Paper p="xl" radius="xl" mt="xl" style={{ background: "linear-gradient(45deg, #ff6b35, #f7931e)", color: "white" }}>
        <Stack align="center" gap="md">
          <ThemeIcon size={60} radius="xl" variant="white" color="orange">
            <IconSparkles size={30} />
          </ThemeIcon>
          <Title order={2} ta="center">Don't See the Promoter You're Looking For?</Title>
          <Text ta="center" size="lg" opacity={0.9}>
            Encourage them to join our platform and grow the local music scene together!
          </Text>
          <Button size="lg" variant="white" color="dark">
            Invite Promoter to Join
          </Button>
        </Stack>
      </Paper>
    </Container>
  );
}

function PromoterCard({ 
  promoter, 
  getLocationText 
}: { 
  promoter: Promoter; 
  getLocationText: (promoter: Promoter) => string;
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
          src={promoter.avatarUrl}
          size={80}
          radius="xl"
          style={{
            border: "3px solid var(--mantine-color-orange-3)",
          }}
        >
          {promoter.name?.[0]?.toUpperCase()}
        </Avatar>
        
        {/* Promoter Info */}
        <Stack gap="xs" align="center" style={{ flex: 1 }}>
          <Text fw={700} size="lg" ta="center" lineClamp={1}>
            {promoter.name}
          </Text>
          
          {/* Location */}
          <Group gap="xs" justify="center">
            <IconMapPin size={14} style={{ color: "var(--mantine-color-dimmed)" }} />
            <Text size="xs" c="dimmed" ta="center" lineClamp={1}>
              {getLocationText(promoter)}
            </Text>
          </Group>
          
          {/* Bio */}
          {promoter.bio && (
            <Text size="sm" c="dimmed" ta="center" lineClamp={3} style={{ flex: 1 }}>
              {promoter.bio}
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
            href={`/promoters/${nameToUrl(promoter.name)}`}
          >
            View Profile
          </Button>
          <Button
            size="sm"
            fullWidth
            leftSection={<IconUserPlus size={16} />}
            color="orange"
          >
            Request to Join
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
