import { DiscoverClient } from "@/components/discover/DiscoverClient";
import { createClient } from '@/utils/supabase/server';
import { Metadata } from 'next';
import { cache, Suspense } from 'react';
import { CityData, getCityMusicData } from "./actions";

// Cached data fetching function with Next.js caching
const getCachedCityData = cache(async (city: string): Promise<CityData> => {
  try {
    const data = await getCityMusicData(city);
    return data;
  } catch (error) {
    // Return empty data structure if server action fails
    return {
      artists: [],
      venues: [],
      events: [],
      promoters: []
    };
  }
});

// Cached function to fetch popular cities
const getCachedPopularCities = cache(async (): Promise<string[]> => {
  const supabase = await createClient();

  try {
    // Get localities that have active artists
    const { data: artistLocalities } = await supabase
      .from('artists_localities')
      .select(`
        locality,
        localities!inner(id, name)
      `);

    // Get localities that have active promoters
    const { data: promoterLocalities } = await supabase
      .from('promoters_localities')
      .select(`
        locality,
        localities!inner(id, name)
      `);

    // Combine and count occurrences of each locality
    const localityCounts = new Map<string, number>();

    // Count artist localities
    artistLocalities?.forEach(al => {
      if (al.localities?.name) {
        const count = localityCounts.get(al.localities.name) || 0;
        localityCounts.set(al.localities.name, count + 1);
      }
    });

    // Count promoter localities (add to existing counts)
    promoterLocalities?.forEach(pl => {
      if (pl.localities?.name) {
        const count = localityCounts.get(pl.localities.name) || 0;
        localityCounts.set(pl.localities.name, count + 1);
      }
    });

    // Sort by count (most active first) and return top cities
    const sortedCities = Array.from(localityCounts.entries())
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6) // Get top 6 cities
      .map(([cityName]) => cityName);

    return sortedCities
  } catch (error) {
    throw new Error('Failed to fetch popular cities');
  }
});

interface DiscoverPageProps {
  searchParams: Promise<{ city?: string }>;
}

// Generate dynamic metadata based on search params
export async function generateMetadata({ searchParams }: DiscoverPageProps): Promise<Metadata> {
  const { city } = await searchParams;

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

  // Check user authentication status
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  const [cityData, popularCities] = await Promise.all([
    getCachedCityData(decodedCity),
    getCachedPopularCities()
  ]);

  return (
    <DiscoverClient
      initialData={cityData}
      initialCity={decodedCity}
      popularCities={popularCities}
      isLoggedIn={isLoggedIn}
    />
  );
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const selectedCity = (await searchParams).city || "";

  // Check user authentication status
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isLoggedIn = !!user;

  if (selectedCity) {
    return (
      <Suspense fallback={<DiscoverClient isLoggedIn={isLoggedIn} />}>
        <CityDataWrapper city={selectedCity} />
      </Suspense>
    );
  }

  // Fetch popular cities for the default discover page
  const popularCities = await getCachedPopularCities();

  return <DiscoverClient popularCities={popularCities} isLoggedIn={isLoggedIn} />;
}
