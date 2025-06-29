import { Container } from "@mantine/core";
import { getCityMusicData, CityData } from "./actions";
import { CitySearchClient } from "@/components/discover/CitySearchClient";
import { CityResultsClient } from "@/components/discover/CityResultsClient";
import { mockCityData } from "@/lib/mock-data";
import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { Suspense } from 'react';
import { Metadata } from 'next';

// Cached data fetching function with Next.js caching
const getCachedCityData = cache(async (city: string): Promise<CityData> => {
  try {
    const data = await getCityMusicData(city);
    return data;
  } catch (error) {
    console.error('Error fetching city data:', error);
    // Fall back to mock data if server action fails
    return mockCityData;
  }
});

// Unstable cache for longer-term caching with revalidation
const getCityDataWithCache = unstable_cache(
  async (city: string) => getCachedCityData(city),
  ['city-music-data'],
  {
    revalidate: 60 * 60, // Cache for 1 hour
    tags: ['discover', 'city-data'],
  }
);

interface DiscoverPageProps {
  searchParams: { city?: string };
}

// Generate static params for popular cities (for static generation)
export function generateStaticParams() {
  const popularCities = [
    'New York',
    'Los Angeles', 
    'Chicago',
    'Austin',
    'Nashville',
    'Seattle',
    'Portland',
    'Denver'
  ];
  
  return popularCities.map((city) => ({
    city: city.toLowerCase().replace(' ', '-'),
  }));
}

// Generate dynamic metadata based on search params
export async function generateMetadata({ searchParams }: DiscoverPageProps): Promise<Metadata> {
  const city = (await searchParams).city;
  
  if (city) {
    return {
      title: `Music Scene in ${city} | MusicPlatform`,
      description: `Discover local artists, venues, promoters, and upcoming events in ${city}. Connect with your city's vibrant music community.`,
      openGraph: {
        title: `Music Scene in ${city} | MusicPlatform`,
        description: `Explore ${city}'s music scene - find local artists, venues, and events`,
        type: 'website',
      },
      // Add structured data for SEO
      other: {
        'city': city,
        'content-type': 'music-discovery',
      },
    };
  }
  
  return {
    title: 'Discover Your City\'s Music Scene | MusicPlatform',
    description: 'Enter your city and explore local artists, venues, promoters, and the hottest upcoming events in your area.',
    openGraph: {
      title: 'Discover Your City\'s Music Scene',
      description: 'Find local music artists, venues, and events in your city',
      type: 'website',
    },
  };
}

async function CityDataWrapper({ city }: { city: string }) {
  const cityData = await getCityDataWithCache(city);
  
  return (
    <CityResultsClient 
      cityData={cityData} 
      cityName={city}
      isLoading={false}
    />
  );
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const selectedCity = (await searchParams).city || "";

  return (
    <Container size="xl" py="xl">
      <CitySearchClient />
      
      {selectedCity && (
        <Suspense fallback={
          <CityResultsClient 
            cityData={null} 
            cityName={selectedCity}
            isLoading={true}
          />
        }>
          <CityDataWrapper city={selectedCity} />
        </Suspense>
      )}
    </Container>
  );
}

// Enable static generation for this page
export const dynamic = 'force-dynamic'; // Allow dynamic rendering for search params
export const revalidate = 3600; // Revalidate every hour
