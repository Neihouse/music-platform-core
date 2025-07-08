"use client";

import { CityData } from "@/app/discover/actions";
import { ArtistCard } from "@/components/discover/ArtistCard";
import { EmptyState } from "@/components/discover/EmptyState";
import { EventCard } from "@/components/discover/EventCard";
import { LoadingAnimation } from "@/components/discover/LoadingAnimation";
import { PromoterCard } from "@/components/discover/PromoterCard";
import { VenueCard } from "@/components/discover/VenueCard";
import {
  Badge,
  Box,
  Divider,
  Grid,
  Group,
  rem,
  Stack,
  ThemeIcon,
  Title,
} from "@mantine/core";
import {
  IconBuilding,
  IconCalendarEvent,
  IconMapPin,
  IconMicrophone,
  IconUsers,
} from "@tabler/icons-react";

interface CityResultsProps {
  cityData: CityData | null;
  cityName: string;
  isLoading: boolean;
  onReset: () => void;
  isLoggedIn: boolean | null;
}

export function CityResults({ cityData, cityName, isLoading, onReset, isLoggedIn }: CityResultsProps) {
  if (isLoading) {
    return <LoadingAnimation cityName={cityName} />;
  }

  if (!cityData) return null;

  // Check if all data arrays are empty
  const hasData = cityData.artists.length > 0 ||
    cityData.venues.length > 0 ||
    cityData.promoters.length > 0 ||
    cityData.events.length > 0;

  if (!hasData) {
    return <EmptyState cityName={cityName} onTryAgain={onReset} isLoggedIn={isLoggedIn} />;
  }

  return (
    <Stack gap="xl">
      <Group justify="center">
        <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
          <IconMapPin size={28} />
        </ThemeIcon>
        <Title order={2} size={rem(36)}>
          Music Scene in {cityName}
        </Title>
      </Group>

      {/* Upcoming Events */}
      {cityData.events.length > 0 && (
        <Box>
          <Group mb="lg">
            <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'pink', to: 'orange' }}>
              <IconCalendarEvent size={24} />
            </ThemeIcon>
            <Title order={3}>🔥 Hot Upcoming Events</Title>
            <Badge size="lg" variant="gradient" gradient={{ from: 'pink', to: 'orange' }}>
              {cityData.events.length} events
            </Badge>
          </Group>

          <Grid>
            {cityData.events.map((event) => (
              <Grid.Col key={event.id} span={{ base: 12, md: 6, lg: 4 }}>
                <EventCard event={event} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}

      {cityData.artists.length > 0 && <Divider />}

      {/* Local Artists */}
      {cityData.artists.length > 0 && (
        <Box>
          <Group mb="lg">
            <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
              <IconMicrophone size={24} />
            </ThemeIcon>
            <Title order={3}>🎤 Rising Local Artists</Title>
            <Badge size="lg" variant="gradient" gradient={{ from: 'violet', to: 'blue' }}>
              {cityData.artists.length} artists
            </Badge>
          </Group>

          <Grid>
            {cityData.artists.map((artist) => (
              <Grid.Col key={artist.id} span={{ base: 12, md: 6, lg: 4 }}>
                <ArtistCard artist={artist} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}

      {cityData.venues.length > 0 && <Divider />}

      {/* Venues */}
      {cityData.venues.length > 0 && (
        <Box>
          <Group mb="lg">
            <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'green', to: 'teal' }}>
              <IconBuilding size={24} />
            </ThemeIcon>
            <Title order={3}>🏛️ Popular Venues</Title>
            <Badge size="lg" variant="gradient" gradient={{ from: 'green', to: 'teal' }}>
              {cityData.venues.length} venues
            </Badge>
          </Group>

          <Grid>
            {cityData.venues.map((venue) => (
              <Grid.Col key={venue.id} span={{ base: 12, md: 6, lg: 4 }}>
                <VenueCard venue={venue} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}

      {cityData.promoters.length > 0 && <Divider />}

      {/* Promoters */}
      {cityData.promoters.length > 0 && (
        <Box>
          <Group mb="lg">
            <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
              <IconUsers size={24} />
            </ThemeIcon>
            <Title order={3}>🎪 Active Promoters & Collectives</Title>
            <Badge size="lg" variant="gradient" gradient={{ from: 'orange', to: 'red' }}>
              {cityData.promoters.length} promoters
            </Badge>
          </Group>

          <Grid>
            {cityData.promoters.map((promoter) => (
              <Grid.Col key={promoter.id} span={{ base: 12, md: 6, lg: 4 }}>
                <PromoterCard promoter={promoter} />
              </Grid.Col>
            ))}
          </Grid>
        </Box>
      )}
    </Stack>
  );
}
