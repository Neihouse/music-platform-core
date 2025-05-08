"use client";

import { Input } from "./Input";
import { PlacesApiProvider } from "./PlacesApiProvider";

interface ILocationInputProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
}
export function LocationInput({ onPlaceSelect }: ILocationInputProps) {
  return (
    <PlacesApiProvider>
      <Input onPlaceSelect={onPlaceSelect} />
    </PlacesApiProvider>
  );
}
