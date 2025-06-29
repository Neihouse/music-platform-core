import { Container } from "@mantine/core";
import { getCityMusicData, CityData } from "./actions";
import { CitySearchClient } from "@/components/discover/CitySearchClient";
import { CityResultsClient } from "@/components/discover/CityResultsClient";
import { mockCityData } from "@/lib/mock-data";
import { cache } from 'react';
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


interface DiscoverPageProps {
  searchParams: Promise<{ city?: string }>;
}

// Generate dynamic metadata based on search params
export async function generateMetadata({ searchParams }: DiscoverPageProps): Promise<Metadata> {
  const {city} = await searchParams;
  
  // Decode hyphenated city names back to spaces for display
  const displayCity = city ? city.replace(/-/g, ' ').split(' ').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ') : null;
  
  if (city) {
    return {
      title: `Music Scene in ${displayCity} | MusicPlatform`,
      description: `Discover local artists, venues, promoters, and upcoming events in ${displayCity}. Connect with your city's vibrant music community.`,
      openGraph: {
        title: `Music Scene in ${displayCity} | MusicPlatform`,
        description: `Explore ${displayCity}'s music scene - find local artists, venues, and events`,
        type: 'website',
      },
      // Add structured data for SEO
      other: {
        'city': displayCity || city,
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
  // Decode hyphenated city names back to spaces for database lookup
  const decodedCity = city.replace(/-/g, ' ');
  const cityData = await getCachedCityData(decodedCity);
  
  const isEmpty = Object.values(cityData).flat().length === 0;

  return (
    <CityResultsClient 
      cityData={isEmpty ? mockCityData : cityData} 
      cityName={decodedCity}
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
