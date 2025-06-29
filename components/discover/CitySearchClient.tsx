"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { HeroSection } from "./HeroSection";

export function CitySearchClient() {
  const router = useRouter();

  const handleCitySelect = (city: string) => {
    // Update URL with selected city
    const newUrl = new URL(window.location.href);
    newUrl.searchParams.set('city', city);
    router.push(newUrl.pathname + newUrl.search);
  };

  return <HeroSection onCitySelect={handleCitySelect} />;
}
