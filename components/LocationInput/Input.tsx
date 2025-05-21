"use client";
import { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./LocationInput.css";

export interface IInputProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  options?: google.maps.places.AutocompleteOptions;
}

const _options: google.maps.places.AutocompleteOptions = {
  types: ["(cities)"],
  componentRestrictions: { country: "us" },
  fields: ["geometry", "name", "formatted_address", "address_components"],
};

export function Input({ onPlaceSelect, options = _options }: IInputProps) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) {
      return;
    }

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, options));
  }, [places, _options]);

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
