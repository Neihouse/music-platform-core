"use client";

import { CityData, getCityMusicData } from "@/app/discover/actions";
import { EventCard } from "@/components/discover/EventCard";
import {
  ArtistCard,
  ContentSection,
  MusicGrid,
  MusicTrack,
  SearchHero,
  VenueCard,
} from "@/components/shared";
import { nameToUrl } from "@/lib/utils";
import {
  Box,
  Button,
  Container,
  Group,
  Paper,
  rem,
  Stack,
  Text,
  ThemeIcon
} from "@mantine/core";
import {
  IconMapPin
} from "@tabler/icons-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EmptyState } from "./EmptyState";
import { LoadingAnimation } from "./LoadingAnimation";

interface DiscoverClientProps {
  initialData?: CityData | null;
  initialCity?: string;
  popularCities?: string[];
  isLoggedIn?: boolean;
  initialFeaturedTracks?: MusicTrack[];
}

export function DiscoverClient({ initialData, initialCity, popularCities, isLoggedIn, initialFeaturedTracks }: DiscoverClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [cityData, setCityData] = useState<CityData | null>(initialData || null);
  const [currentCity, setCurrentCity] = useState(initialCity || "");
  const [featuredTracks, setFeaturedTracks] = useState<MusicTrack[]>(initialFeaturedTracks || []);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Helper function to capitalize city names
  const capitalizeCity = (cityName: string) => {
    return cityName
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(' ');
  };

  // Initialize with props data - separate effects to avoid dependency issues
  useEffect(() => {
    if (initialData && initialCity && !cityData) {
      setCityData(initialData);
      setCurrentCity(initialCity);
    }
  }, [initialData, initialCity]); // Remove cityData from dependency array

  useEffect(() => {
    if (initialFeaturedTracks && initialFeaturedTracks.length > 0) {
      setFeaturedTracks(initialFeaturedTracks);
    }
  }, [initialFeaturedTracks]); // Separate effect for featured tracks

  const handleSearch = useCallback(async (searchQuery: string) => {
    const trimmedQuery = searchQuery.trim();
    if (!trimmedQuery) return;

    setIsLoading(true);
    setError(null);

    // Update current city state immediately
    setCurrentCity(trimmedQuery);

    // Update URL with hyphenated city name
    const hyphenatedCity = trimmedQuery.toLowerCase().replace(/\s+/g, '-');
    const url = new URL(window.location.href);
    url.searchParams.set('city', hyphenatedCity);
    router.push(url.pathname + url.search);

    try {
      const data = await getCityMusicData(trimmedQuery);
      const hasData = Object.values(data).some(arr => arr.length > 0);

      setCityData(data);
    } catch (err) {
      console.error('Error fetching city data:', err);
      setError('Failed to fetch city data');
      setCityData(null);
    } finally {
      setIsLoading(false);
    }
  }, [router]);

  const handleRetry = useCallback(() => {
    if (currentCity) {
      handleSearch(currentCity);
    }
  }, [currentCity, handleSearch]);

  const handleReset = useCallback(() => {
    setCityData(null);
    setCurrentCity("");
    setError(null);

    // Clear URL params
    const url = new URL(window.location.href);
    url.searchParams.delete('city');
    router.push(url.pathname);
  }, [router]);

  // Effect to handle URL changes
  useEffect(() => {
    const city = searchParams.get('city');
    if (city) {
      const decodedCity = city.replace(/-/g, ' ');
      const currentCityHyphenated = currentCity.toLowerCase().replace(/\s+/g, '-');

      // Only fetch if this is a different city than what we currently have
      if (city !== currentCityHyphenated && decodedCity !== currentCity) {
        handleSearch(decodedCity);
      }
    } else if (currentCity) {
      // Clear state if no city in URL but we have a current city
      setCurrentCity("");
      setCityData(null);
      setError(null);
    }
  }, [searchParams, handleSearch]);

  const hasData = cityData && Object.values(cityData).some(arr => arr.length > 0);

  return (
    <Box style={{
      position: 'relative',
      background: 'linear-gradient(135deg, var(--mantine-color-dark-9) 0%, var(--mantine-color-dark-8) 100%)',
      minHeight: '100vh'
    }}>
      {/* Background decorative elements - responsive sizing */}
      <Box
        hiddenFrom="sm"
        style={{
          position: 'fixed',
          top: '15%',
          right: '5%',
          width: rem(100),
          height: rem(100),
          background: 'radial-gradient(circle, rgba(51, 154, 240, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <Box
        visibleFrom="sm"
        style={{
          position: 'fixed',
          top: '20%',
          right: '10%',
          width: rem(200),
          height: rem(200),
          background: 'radial-gradient(circle, rgba(51, 154, 240, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <Box
        hiddenFrom="sm"
        style={{
          position: 'fixed',
          bottom: '25%',
          left: '2%',
          width: rem(80),
          height: rem(80),
          background: 'radial-gradient(circle, rgba(116, 192, 252, 0.08) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />
      <Box
        visibleFrom="sm"
        style={{
          position: 'fixed',
          bottom: '20%',
          left: '5%',
          width: rem(150),
          height: rem(150),
          background: 'radial-gradient(circle, rgba(116, 192, 252, 0.1) 0%, transparent 70%)',
          borderRadius: '50%',
          zIndex: 1,
          pointerEvents: 'none',
        }}
      />

      {/* Hero Section */}
      <SearchHero
        onSearch={handleSearch}
        onClear={handleReset}
        currentValue={currentCity ? capitalizeCity(currentCity) : ""}
        popularCities={popularCities}
      />

      {/* Loading State */}
      {isLoading && (
        <Container size="xl" py={{ base: "md", sm: "lg", md: "xl" }}>
          <LoadingAnimation cityName={capitalizeCity(currentCity)} />
        </Container>
      )}

      {/* Error State */}
      {error && !isLoading && (
        <Container size="sm" py={{ base: "md", sm: "lg", md: "xl" }}>
          <Paper
            p={{ base: "md", sm: "lg", md: "xl" }}
            radius="lg"
            style={{ textAlign: 'center', background: 'var(--mantine-color-red-9)' }}
          >
            <Text c="red.2" size="lg" fw={600} hiddenFrom="sm">
              {error}
            </Text>
            <Text c="red.2" size="xl" fw={600} visibleFrom="sm">
              {error}
            </Text>
            <Group justify="center" mt="md">
              <Button onClick={handleRetry} variant="light" color="red" size="sm" hiddenFrom="sm">
                Try again
              </Button>
              <Button onClick={handleRetry} variant="light" color="red" size="md" visibleFrom="sm">
                Try again
              </Button>
            </Group>
          </Paper>
        </Container>
      )}

      {/* Featured Tracks - when no city is selected */}
      {!isLoading && !error && !currentCity && featuredTracks.length > 0 && (
        <Container size="xl" py={{ base: "md", sm: "lg", md: "xl" }}>
          <MusicGrid
            tracks={featuredTracks}
            title="🎵 Featured Tracks"
            maxItems={12}
          />
        </Container>
      )}

      {/* Results */}
      {!isLoading && !error && currentCity && (
        <>
          {!hasData ? (
            <Container size="xl" py={{ base: "md", sm: "lg", md: "xl" }}>
              <EmptyState
                cityName={capitalizeCity(currentCity)}
                onTryAgain={handleReset}
                isLoggedIn={isLoggedIn ?? null}
              />
            </Container>
          ) : (
            <Stack gap="sm">
              {/* City Header */}
              {currentCity && (
                <Box py={{ base: "md", sm: "lg", md: "xl" }}>
                  <Container size="xl" px={{ base: "md", sm: "lg" }}>
                    {/* Mobile City Header */}
                    <Stack hiddenFrom="sm" align="center" gap="sm">
                      <ThemeIcon size="lg" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                        <IconMapPin size={20} />
                      </ThemeIcon>
                      <Text
                        size="xl"
                        fw={700}
                        c="white"
                        ta="center"
                        style={{ fontSize: 'clamp(1.5rem, 5vw, 2rem)' }}
                      >
                        Music in {capitalizeCity(currentCity)}
                      </Text>
                    </Stack>

                    {/* Desktop City Header */}
                    <Group visibleFrom="sm" ta="center" justify="center" gap="md">
                      <ThemeIcon size="xl" variant="gradient" gradient={{ from: 'blue', to: 'cyan' }}>
                        <IconMapPin size={28} />
                      </ThemeIcon>
                      <Text size={rem(36)} fw={700} c="white">
                        Music in {capitalizeCity(currentCity)}
                      </Text>
                    </Group>
                  </Container>
                </Box>
              )}

              {/* Upcoming Events */}
              {cityData?.events && cityData.events.length > 0 && (
                <ContentSection
                  title="🔥 Hot Events"
                  subtitle="Don't miss these upcoming shows in your city"
                  badge={`${cityData.events.length} events`}
                  scrollable
                >
                  {cityData.events.map((event) => (
                    <EventCard
                      key={event.id}
                      event={event}
                    />
                  ))}
                </ContentSection>
              )}

              {/* Featured Artists */}
              {cityData?.artists && cityData.artists.length > 0 && (
                <ContentSection
                  title="🎤 Rising Artists"
                  subtitle="Discover the next big names in your local music scene"
                  badge={`${cityData.artists.length} artists`}
                  scrollable
                >
                  {cityData.artists.map((artist) => (
                    <ArtistCard
                      key={artist.id}
                      id={artist.id}
                      name={artist.name}
                      bio={artist.bio}
                      avatarUrl={artist.avatar_img}
                      bannerUrl={artist.banner_img}
                      genre={artist.genre}
                      selectedFont={artist.selectedFont}
                      onClick={() => router.push(`/artists/${nameToUrl(artist.name)}`)}
                    />
                  ))}
                </ContentSection>
              )}

              {/* Popular Venues */}
              {cityData?.venues && cityData.venues.length > 0 && (
                <ContentSection
                  title="🏛️ Top Venues"
                  subtitle="The best places to catch live music in your city"
                  badge={`${cityData.venues.length} venues`}
                  scrollable
                >
                  {cityData.venues.map((venue) => (
                    <VenueCard
                      key={venue.id}
                      id={venue.id}
                      name={venue.name}
                      description={venue.description}
                      imageUrl={venue.banner_img}
                      capacity={venue.capacity}
                      location={venue.address}
                      onClick={() => router.push(`/venues/${nameToUrl(venue.name)}`)}
                      onViewEvents={() => console.log('View venue events:', venue.id)}
                    />
                  ))}
                </ContentSection>
              )}

              {/* Active Promoters */}
              {cityData?.promoters && cityData.promoters.length > 0 && (
                <ContentSection
                  title="🎪 Active Promoters"
                  subtitle="The tastemakers bringing the best events to your city"
                  badge={`${cityData.promoters.length} promoters`}
                  scrollable
                >
                  {cityData.promoters.map((promoter) => (
                    <ArtistCard
                      key={promoter.id}
                      id={promoter.id}
                      name={promoter.name}
                      bio={promoter.bio}
                      avatarUrl={promoter.avatar_img}
                      bannerUrl={promoter.banner_img}
                      selectedFont={promoter.selectedFont}
                      onClick={() => router.push(`/promoters/${nameToUrl(promoter.name)}`)}
                    />
                  ))}
                </ContentSection>
              )}
            </Stack>
          )}
        </>
      )}
    </Box>
  );
}
