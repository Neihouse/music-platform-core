"use client";

import { Input } from "./Input";
import { PlacesApiProvider } from "./PlacesApiProvider";

export function LocationInput() {
  return (
    <PlacesApiProvider>
      <Input onPlaceSelect={(place) => {}} />
    </PlacesApiProvider>
  );

  async function handlePlaceSelect(place: google.maps.places.PlaceResult) {
    console.log("Selected place:", place);
  }
}
