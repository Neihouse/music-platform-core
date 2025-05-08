"use client";
import { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./LocationInput.css";

export interface IInputProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
}

export function Input({ onPlaceSelect }: IInputProps) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) {
      return;
    }

    const options: google.maps.places.AutocompleteOptions = {
      types: ["(cities)"],
      componentRestrictions: { country: "us" },
      fields: ["geometry", "name", "formatted_address", "address_components"],
    };

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places]);

  useEffect(() => {
    if (!placeAutocomplete) {
      return;
    }

    placeAutocomplete.addListener("place_changed", () => {
      onPlaceSelect && onPlaceSelect(placeAutocomplete.getPlace());
    });
  }, [onPlaceSelect, placeAutocomplete]);

  return (
    <div className="autocomplete-container">
      <input placeholder="Enter your city" ref={inputRef} />
    </div>
  );
}
