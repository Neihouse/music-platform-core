"use client";

import { nameToUrl } from "@/lib/utils";
import { Database } from "@/utils/supabase/database.types";
import { Avatar, Button, Card, Center, Container, Group, Paper, SimpleGrid, Stack, Switch, Text, TextInput, ThemeIcon, Title } from "@mantine/core";
import { IconArrowLeft, IconMapPin, IconSearch, IconSparkles, IconUser, IconUserPlus, IconX } from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import JoinRequestModal from "./JoinRequestModal";

// Use database-first types as per TYPE_USAGE_GUIDE.md
type PromoterWithLocation = Pick<Database['public']['Tables']['promoters']['Row'], 'id' | 'name' | 'bio' | 'avatar_img' | 'user_id'> & {
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
};

interface ArtistPromotersClientProps {
  localityPromoters: PromoterWithLocation[];
  artistLocalityPromoters: PromoterWithLocation[];
  localityName?: string;
}

export default function ArtistPromotersClient({
  localityPromoters,
  artistLocalityPromoters,
  localityName
}: ArtistPromotersClientProps) {
  const [filterByArtistLocality, setFilterByArtistLocality] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [joinModalOpened, setJoinModalOpened] = useState(false);
  const [selectedPromoter, setSelectedPromoter] = useState<PromoterWithLocation | null>(null);

  // Determine which promoters to show based on the toggle
  const basePromoters = filterByArtistLocality ? artistLocalityPromoters : localityPromoters;

  // Filter by search term
  const filteredPromoters = basePromoters.filter(promoter =>
    promoter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    promoter.bio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getLocationText(promoter).toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getLocationText = (promoter: PromoterWithLocation) => {
    if (promoter.storedLocality) {
      return `${promoter.storedLocality.locality.name}, ${promoter.storedLocality.administrativeArea.name}, ${promoter.storedLocality.country.name}`;
    }
    if (promoter.localities?.name) return promoter.localities.name;
    if (promoter.administrative_areas?.name) return promoter.administrative_areas.name;
    if (promoter.countries?.name) return promoter.countries.name;
    return "Location not specified";
  };

  const handleJoinRequest = (promoter: PromoterWithLocation) => {
    setSelectedPromoter(promoter);
    setJoinModalOpened(true);
  };

  const handleCloseJoinModal = () => {
    setJoinModalOpened(false);
    setSelectedPromoter(null);
  };

  return (
    <>
      <Container size="xl" py={{ base: "md", md: "xl" }}>
        {/* Header */}
        <Stack gap="md" mb={{ base: "lg", md: "xl" }}>
          <Group gap="md" wrap="nowrap">
            <ThemeIcon
              size={40}
              radius="xl"
              variant="light"
              color="orange"
              hiddenFrom="md"
            >
              <IconUserPlus size={20} />
            </ThemeIcon>
            <ThemeIcon
              size={50}
              radius="xl"
              variant="light"
              color="orange"
              visibleFrom="md"
            >
              <IconUserPlus size={24} />
            </ThemeIcon>
            <div style={{ flex: 1, minWidth: 0 }}>
              <Title
                order={1}
                fz={{ base: "xl", sm: "1.75rem", md: "2rem" }}
                lh={{ base: 1.2, md: 1.3 }}
              >
                Connect with Promoters
              </Title>
              <Text
                c="dimmed"
                fz={{ base: "sm", md: "lg" }}
                lineClamp={2}
              >
                {filterByArtistLocality
                  ? `Promoters in your shared localities${localityName ? ` (including ${localityName})` : ""}`
                  : `Promoters in your primary area${localityName ? ` (${localityName})` : ""}`
                }
              </Text>
            </div>
          </Group>

          <Button
            component={Link}
            href="/artist"
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            size="sm"
            fullWidth
            hiddenFrom="sm"
          >
            Back to Dashboard
          </Button>
          <Button
            component={Link}
            href="/artist"
            variant="light"
            leftSection={<IconArrowLeft size={16} />}
            size="md"
            visibleFrom="sm"
          >
            Back to Dashboard
          </Button>
        </Stack>

        {/* Filter Controls */}
        <Paper p={{ base: "sm", sm: "md", lg: "lg" }} radius="lg" withBorder mb={{ base: "lg", md: "xl" }}>
          <Stack gap="md">
            {/* Search Bar */}
            <Stack gap="xs">
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
              <Text
                fz="xs"
                c="dimmed"
                hiddenFrom="sm"
              >
                Search by name, bio, or location
              </Text>
            </Stack>

            {/* Locality Filter Toggle */}
            <Stack gap="xs">
              <Group justify="space-between" wrap="nowrap" align="flex-start">
                <div style={{ flex: 1, minWidth: 0 }}>
                  <Text fw={500} fz="sm">Show promoters in your localities only</Text>
                  <Text
                    fz="xs"
                    c="dimmed"
                    lineClamp={2}
                  >
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
            spacing={{ base: "sm", sm: "md", lg: "lg" }}
            verticalSpacing={{ base: "sm", sm: "md", lg: "lg" }}
            style={{
              // Additional mobile optimizations
              '@media (maxWidth: 30em)': {
                gap: '0.75rem',
              }
            }}
          >
            {filteredPromoters.map((promoter) => (
              <PromoterCard
                key={promoter.id}
                promoter={promoter}
                getLocationText={getLocationText}
                onJoinRequest={handleJoinRequest}
              />
            ))}
          </SimpleGrid>
        ) : (
          <Center py={{ base: "lg", sm: "xl" }}>
            <Stack
              align="center"
              gap="md"
              maw={{ base: 300, sm: 400 }}
              px={{ base: "sm", sm: 0 }}
            >
              <ThemeIcon
                size={60}
                radius="xl"
                variant="light"
                color="gray"
                hiddenFrom="sm"
              >
                <IconUser size={30} />
              </ThemeIcon>
              <ThemeIcon
                size={80}
                radius="xl"
                variant="light"
                color="gray"
                visibleFrom="sm"
              >
                <IconUser size={40} />
              </ThemeIcon>
              <Title
                order={3}
                c="dimmed"
                fz={{ base: "lg", sm: "xl" }}
                ta="center"
              >
                No Promoters Found
              </Title>
              <Text
                c="dimmed"
                ta="center"
                fz={{ base: "sm", sm: "md" }}
              >
                {searchTerm
                  ? `No promoters found matching "${searchTerm}". Try a different search term.`
                  : filterByArtistLocality
                    ? "No promoters found in your shared localities. Try unchecking the locality filter."
                    : "No promoters available in your area. Try expanding your search."
                }
              </Text>
              {searchTerm && (
                <Button
                  variant="light"
                  onClick={() => setSearchTerm("")}
                  size="sm"
                >
                  Clear Search
                </Button>
              )}
              {!searchTerm && filterByArtistLocality && (
                <Button
                  variant="light"
                  onClick={() => setFilterByArtistLocality(false)}
                  size="sm"
                >
                  Show All Local Promoters
                </Button>
              )}
              {!searchTerm && !filterByArtistLocality && (
                <Button
                  variant="light"
                  component={Link}
                  href="/promoters"
                  size="sm"
                >
                  Browse All Promoters
                </Button>
              )}
            </Stack>
          </Center>
        )}

        {/* Call to Action */}
        <Paper p={{ base: "lg", md: "xl" }} radius="xl" mt={{ base: "lg", md: "xl" }} style={{ background: "linear-gradient(45deg, #ff6b35, #f7931e)", color: "white" }}>
          <Stack align="center" gap="md">
            <ThemeIcon
              size={60}
              radius="xl"
              variant="white"
              color="orange"
            >
              <IconSparkles size={30} />
            </ThemeIcon>
            <Title order={2} ta="center">Don't See the Promoter You're Looking For?</Title>
            <Text ta="center" fz={{ base: "md", sm: "lg" }} style={{ opacity: 0.9 }} lineClamp={2}>
              Encourage them to join our platform and grow the local music scene together!
            </Text>
            <Button
              size="lg"
              variant="white"
              color="dark"
              mt={{ base: "xs", sm: "sm" }}
            >
              Invite Promoter to Join
            </Button>
          </Stack>
        </Paper>
      </Container>

      {/* Join Request Modal */}
      {selectedPromoter && (
        <JoinRequestModal
          promoter={{
            id: selectedPromoter.id,
            name: selectedPromoter.name,
            bio: selectedPromoter.bio,
            user_id: selectedPromoter.user_id,
            avatarUrl: selectedPromoter.avatarUrl,
          }}
          opened={joinModalOpened}
          onClose={handleCloseJoinModal}
        />
      )}
    </>
  );
}

function PromoterCard({
  promoter,
  getLocationText,
  onJoinRequest
}: {
  promoter: PromoterWithLocation;
  getLocationText: (promoter: PromoterWithLocation) => string;
  onJoinRequest: (promoter: PromoterWithLocation) => void;
}) {
  return (
    <Card
      p={{ base: "sm", sm: "md", lg: "lg" }}
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
          size={60}
          radius="xl"
          style={{
            border: "3px solid var(--mantine-color-orange-3)",
          }}
          hiddenFrom="sm"
        >
          {promoter.name?.[0]?.toUpperCase()}
        </Avatar>
        <Avatar
          src={promoter.avatarUrl}
          size={80}
          radius="xl"
          style={{
            border: "3px solid var(--mantine-color-orange-3)",
          }}
          visibleFrom="sm"
        >
          {promoter.name?.[0]?.toUpperCase()}
        </Avatar>

        {/* Promoter Info */}
        <Stack gap="xs" align="center" style={{ flex: 1 }}>
          <Text
            fw={700}
            size="lg"
            ta="center"
            lineClamp={1}
          >
            {promoter.name}
          </Text>

          {/* Location */}
          <Group gap="xs" justify="center" wrap="nowrap">
            <IconMapPin
              size={14}
              style={{ color: "var(--mantine-color-dimmed)", flexShrink: 0 }}
            />
            <Text
              fz={{ base: "xs", sm: "sm" }}
              c="dimmed"
              ta="center"
              lineClamp={1}
              style={{ minWidth: 0 }}
            >
              {getLocationText(promoter)}
            </Text>
          </Group>

          {/* Bio */}
          {promoter.bio && (
            <Text size="sm" c="dimmed" ta="center" lineClamp={2} style={{ flex: 1 }} hiddenFrom="sm">
              {promoter.bio}
            </Text>
          )}
          {promoter.bio && (
            <Text size="sm" c="dimmed" ta="center" lineClamp={3} style={{ flex: 1 }} visibleFrom="sm">
              {promoter.bio}
            </Text>
          )}
        </Stack>

        {/* Action Buttons - Simplified without responsive text */}
        <Stack gap="xs" w="100%">
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
            onClick={() => onJoinRequest(promoter)}
          >
            Request to Join
          </Button>
        </Stack>
      </Stack>
    </Card>
  );
}
