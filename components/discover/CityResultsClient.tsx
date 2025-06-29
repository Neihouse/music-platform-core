"use client";

import { useRouter } from "next/navigation";
import { CityResults } from "./CityResults";
import { CityData } from "@/app/discover/actions";

interface CityResultsClientProps {
  cityData: CityData | null;
  cityName: string;
  isLoading: boolean;
}

export function CityResultsClient({ cityData, cityName, isLoading }: CityResultsClientProps) {
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
    />
  );
}
