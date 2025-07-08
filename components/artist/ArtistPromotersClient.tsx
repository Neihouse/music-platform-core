"use client";

import { nameToUrl } from "@/lib/utils";
import { Avatar, Button, Card, Center, Container, Group, Paper, SimpleGrid, Stack, Switch, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconArrowLeft, IconMapPin, IconSearch, IconSparkles, IconUser, IconUserPlus, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { StyledTitle } from "../StyledTitle";

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
    <Container size="xl" py={{ base: "md", sm: "xl" }}>
      {/* Header */}
      <Stack gap="xl" mb="xl">
        <Group justify="space-between" align="flex-start" wrap="wrap" gap="md">
          <Stack gap="xs" style={{ flex: 1, minWidth: 0 }}>
            <Group gap="md" wrap="nowrap" align="center">
              <ThemeIcon
                size={50}
                radius="xl"
                variant="light"
                color="orange"
                style={{ flexShrink: 0 }}
              >
                <IconUserPlus size={24} />
              </ThemeIcon>
              <div style={{ flex: 1, minWidth: 0 }}>
                <Title
                  order={2}
                  style={{ lineHeight: 1.2 }}
                  hiddenFrom="sm"
                >
                  Connect with Promoters
                </Title>
                <Title
                  order={1}
                  style={{ lineHeight: 1.2 }}
                  visibleFrom="sm"
                >
                  Connect with Promoters
                </Title>
                <Text
                  c="dimmed"
                  size="sm"
                  style={{ lineHeight: 1.3 }}
                  hiddenFrom="sm"
                >
                  {filterByArtistLocality
                    ? `Shared localities${localityName ? ` (${localityName})` : ""}`
                    : `Primary area${localityName ? ` (${localityName})` : ""}`
                  }
                </Text>
                <Text
                  c="dimmed"
                  size="lg"
                  style={{ lineHeight: 1.3 }}
                  visibleFrom="sm"
                >
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
      </Stack>

      {/* Filter Controls */}
      <Paper p={{ base: "sm", sm: "md" }} radius="lg" withBorder mb={{ base: "lg", sm: "xl" }}>
        <Stack gap="md">
          {/* Search Bar */}
          <Group gap="md" wrap="nowrap">
            <IconSearch size={20} style={{ flexShrink: 0 }} />
            <TextInput
              placeholder="Search promoters..."
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
          <Stack gap="xs">
            <Group justify="space-between" wrap="nowrap" align="flex-start">
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text fw={500} size="sm">Show promoters in your localities only</Text>
                <Text size="xs" c="dimmed" hiddenFrom="sm">
                  {filterByArtistLocality
                    ? "Shared localities only"
                    : "All promoters"
                  }
                </Text>
                <Text size="xs" c="dimmed" visibleFrom="sm">
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
                style={{ flexShrink: 0 }}
              />
            </Group>
          </Stack>
        </Stack>
      </Paper>


      {/* Promoters Grid */}
      {filteredPromoters.length > 0 ? (
        <SimpleGrid
          cols={{ base: 1, xs: 2, sm: 2, md: 3, lg: 4 }}
          spacing={{ base: "sm", sm: "md", md: "lg" }}
          verticalSpacing={{ base: "sm", sm: "md", md: "lg" }}
        >
          {filteredPromoters.map((promoter) => (
            <PromoterCard key={promoter.id} promoter={promoter} getLocationText={getLocationText} />
          ))}
        </SimpleGrid>
      ) : (
        <Center py={{ base: "lg", sm: "xl" }}>
          <Stack align="center" gap="md" maw={400}>
            <ThemeIcon size={80} radius="xl" variant="light" color="gray">
              <IconUser size={40} />
            </ThemeIcon>
            <Title order={3} c="dimmed" ta="center">No Promoters Found</Title>
            <Text c="dimmed" ta="center" size="md">
              {searchTerm
                ? `No promoters found matching "${searchTerm}". Try a different search term.`
                : filterByArtistLocality
                  ? "No promoters found in your shared localities. Try unchecking the locality filter."
                  : "No promoters available in your area. Try expanding your search."
              }
            </Text>
            {searchTerm && (
              <Button variant="light" onClick={() => setSearchTerm("")} size="md">
                Clear Search
              </Button>
            )}
            {!searchTerm && !filterByArtistLocality && (
              <Button variant="light" component={Link} href="/promoters" size="md">
                Browse All Promoters
              </Button>
            )}
          </Stack>
        </Center>
      )}

      {/* Call to Action */}
      <Paper
        p={{ base: "lg", sm: "xl" }}
        radius="xl"
        mt={{ base: "lg", sm: "xl" }}
        style={{ background: "linear-gradient(45deg, #ff6b35, #f7931e)", color: "white" }}
      >
        <Stack align="center" gap="md">
          <ThemeIcon size={60} radius="xl" variant="white" color="orange">
            <IconSparkles size={30} />
          </ThemeIcon>
          <Title order={2} ta="center" style={{ lineHeight: 1.3 }}>
            <Text hiddenFrom="sm" component="span" inherit size="lg">
              Don't See the Right Promoter?
            </Text>
            <Text visibleFrom="sm" component="span" inherit>
              Don't See the Promoter You're Looking For?
            </Text>
          </Title>
          <Text ta="center" opacity={0.9} style={{ lineHeight: 1.4 }}>
            <Text hiddenFrom="sm" component="span" inherit size="md">
              Encourage them to join our platform!
            </Text>
            <Text visibleFrom="sm" component="span" inherit size="lg">
              Encourage them to join our platform and grow the local music scene together!
            </Text>
          </Text>
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
          <StyledTitle
            selectedFont="Inter"
            style={{
              lineClamp: 1,
              fontWeight: 700,
              fontSize: '1.125rem',
              textAlign: 'center'
            }}
          >
            {promoter.name}
          </StyledTitle>

          {/* Location */}
          <Group gap="xs" justify="center" wrap="nowrap">
            <IconMapPin size={14} style={{ color: "var(--mantine-color-dimmed)", flexShrink: 0 }} />
            <Text size="xs" c="dimmed" ta="center" lineClamp={1} style={{ minWidth: 0 }}>
              {getLocationText(promoter)}
            </Text>
          </Group>

          {/* Bio */}
          {promoter.bio && (
            <>
              <Text
                size="xs"
                c="dimmed"
                ta="center"
                lineClamp={2}
                style={{ flex: 1 }}
                hiddenFrom="sm"
              >
                {promoter.bio}
              </Text>
              <Text
                size="sm"
                c="dimmed"
                ta="center"
                lineClamp={3}
                style={{ flex: 1 }}
                visibleFrom="sm"
              >
                {promoter.bio}
              </Text>
            </>
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
            <Text visibleFrom="xs">View Profile</Text>
            <Text hiddenFrom="xs">Profile</Text>
          </Button>
          <Button
            size="sm"
            fullWidth
            leftSection={<IconUserPlus size={16} />}
            color="orange"
          >
            <Text visibleFrom="xs">Request to Join</Text>
            <Text hiddenFrom="xs">Request</Text>
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
