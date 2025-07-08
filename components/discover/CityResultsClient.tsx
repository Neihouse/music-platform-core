"use client";

import { CityData } from "@/app/discover/actions";
import { useRouter } from "next/navigation";
import { CityResults } from "./CityResults";

interface CityResultsClientProps {
  cityData: CityData | null;
  cityName: string;
  isLoading: boolean;
  isLoggedIn: boolean | null;
}

export function CityResultsClient({ cityData, cityName, isLoading, isLoggedIn }: CityResultsClientProps) {
  const router = useRouter();

  const handleReset = () => {
    // Clear the city parameter from URL
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.delete('city');
    router.push(newUrl.pathname + newUrl.search);
  };

  return (
    <CityResults
      cityData={cityData}
      cityName={cityName}
      isLoading={isLoading}
      onReset={handleReset}
      isLoggedIn={isLoggedIn}
    />
  );
}
