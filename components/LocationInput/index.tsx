"use client";

import { useState } from "react";
import { submitPlace } from "./actions";
import { Input } from "./Input";
import { PlacesApiProvider } from "./PlacesApiProvider";
import { StoredLocality } from "@/utils/supabase/global.types";
import { Loader, Pill } from "@mantine/core";
import { notifications } from "@mantine/notifications";


interface ILocationInputProps {
  onPlaceSelect: (storedLocality: StoredLocality) => void;
  onRemovePlace?: () => Promise<void>;
  storedLocality?: StoredLocality;
}

export function LocationInput({ onPlaceSelect, onRemovePlace, storedLocality }: ILocationInputProps) {
  const [isLoading, setIsLoading] = useState(false);
  const formattedAddress = storedLocality ? `${storedLocality?.locality?.name}, ${storedLocality?.administrativeArea?.name}, ${storedLocality?.country?.name}` : undefined

  return (
    <PlacesApiProvider>
      <span>
        {renderGroup(isLoading, formattedAddress)}
      </span>
    </PlacesApiProvider>
  );

  function renderGroup(loading: boolean, formattedAddress?: string) {
    if (loading) {
      return (
        <Loader type="dots" />
      )
    }

    if (!formattedAddress) {
      return (
        <Input onPlaceSelect={handlePlaceSelect} />
      )
    }

    return (
      <Pill
        w="min-content"
        size="xl" withRemoveButton color="green"
        onRemove={handleRemovePlace}
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
