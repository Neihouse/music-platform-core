"use client";

import { useState } from "react";
import { submitPlace } from "./actions";
import { Input } from "./Input";
import { PlacesApiProvider } from "./PlacesApiProvider";
import { StoredLocality } from "@/utils/supabase/global.types";
import { Loader, Pill, Box } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { notifications } from "@mantine/notifications";


interface ILocationInputProps {
  onPlaceSelect: (storedLocality: StoredLocality) => void;
  onRemovePlace?: () => Promise<void>;
  storedLocality?: StoredLocality;
  searchFullAddress?: boolean; // New prop to control search type
}

export function LocationInput({ onPlaceSelect, onRemovePlace, storedLocality, searchFullAddress = false }: ILocationInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  
  // Mobile responsive hooks
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');
  
  const formattedAddress = storedLocality 
    ? (storedLocality.fullAddress || `${storedLocality?.locality?.name}, ${storedLocality?.administrativeArea?.name}, ${storedLocality?.country?.name}`)
    : undefined

  return (
    <PlacesApiProvider>
      <Box style={{ width: '100%' }}>
        {renderGroup(isLoading, formattedAddress)}
      </Box>
    </PlacesApiProvider>
  );

  function renderGroup(loading: boolean, formattedAddress?: string) {
    if (loading) {
      return (
        <Box style={{ display: 'flex', justifyContent: 'center', padding: isSmallMobile ? '8px' : '12px' }}>
          <Loader type="dots" size={isSmallMobile ? "sm" : "md"} />
        </Box>
      )
    }

    if (!formattedAddress) {
      return (
        <Input onPlaceSelect={handlePlaceSelect} searchFullAddress={searchFullAddress} />
      )
    }

    return (
      <Pill
        size={isSmallMobile ? "md" : "lg"}
        withRemoveButton 
        color="blue"
        onRemove={handleRemovePlace}
        style={{
          maxWidth: '100%',
          fontSize: isSmallMobile ? '0.75rem' : '0.875rem'
        }}
      >
        {formattedAddress}
      </Pill>
    );
  }

  async function handleRemovePlace() {
    if (!storedLocality || !onRemovePlace) {
      notifications.show({
        title: "Error",
        message: "No place found",
        color: "red",
      });
      return;
    }

    setIsLoading(true);
    try {
      await onRemovePlace()
      notifications.show({
        title: "Success",
        message: "Location removed",
        color: "green",
      });
    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });
    } finally {
      setIsLoading(false);
    }

  }


  async function handlePlaceSelect(
    place: google.maps.places.PlaceResult,
  ) {
    if (!place || !place.address_components) {
      throw new Error("No place found");
    }

    setIsLoading(true);

    try {

      const storedLocality = await submitPlace(
        place.address_components,
        searchFullAddress ? place.formatted_address : undefined,
      );


      onPlaceSelect(storedLocality);

    } catch (error) {
      notifications.show({
        title: "Error",
        message: `${error}`,
        color: "red",
      });

    } finally {
      setIsLoading(false);
    }
  }
}
