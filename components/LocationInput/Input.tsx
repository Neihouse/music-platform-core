"use client";
import { useState, useRef, useEffect } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import "./LocationInput.css";

export interface IInputProps {
  onPlaceSelect?: (place: google.maps.places.PlaceResult) => void;
  options?: google.maps.places.AutocompleteOptions;
  searchFullAddress?: boolean;
}

const _cityOptions: google.maps.places.AutocompleteOptions = {
  types: ["(cities)"],
  componentRestrictions: { country: "us" },
  fields: ["geometry", "name", "formatted_address", "address_components"],
};

const _fullAddressOptions: google.maps.places.AutocompleteOptions = {
  types: ["address"],
  componentRestrictions: { country: "us" },
  fields: ["geometry", "name", "formatted_address", "address_components"],
};

export function Input({ onPlaceSelect, options, searchFullAddress = false }: IInputProps) {
  const [placeAutocomplete, setPlaceAutocomplete] =
    useState<google.maps.places.Autocomplete | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary("places");

  // Choose the appropriate options based on searchFullAddress prop
  const autocompleteOptions = options || (searchFullAddress ? _fullAddressOptions : _cityOptions);

  useEffect(() => {
    if (!places || !inputRef.current) {
      return;
    }

    setPlaceAutocomplete(new places.Autocomplete(inputRef.current, autocompleteOptions));
  }, [places, autocompleteOptions]);

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
      <input 
        placeholder={searchFullAddress ? "Enter full address" : "Enter your city"} 
        ref={inputRef} 
      />
    </div>
  );
}
