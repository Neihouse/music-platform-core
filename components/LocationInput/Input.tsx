"use client";
import { useState, useRef, useEffect, useMemo } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";
import { TextInput } from "@mantine/core";
import { useMediaQuery } from "@mantine/hooks";
import { IconMapPin } from "@tabler/icons-react";

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
  
  // Mobile responsive hooks
  const isMobile = useMediaQuery('(max-width: 768px)');
  const isSmallMobile = useMediaQuery('(max-width: 480px)');

  // Memoize the appropriate options based on searchFullAddress prop
  const autocompleteOptions = useMemo(() => {
    return options || (searchFullAddress ? _fullAddressOptions : _cityOptions);
  }, [options, searchFullAddress]);

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
    <TextInput
      ref={inputRef}
      placeholder={searchFullAddress ? "Enter full address" : "Enter your city"}
      leftSection={<IconMapPin size={16} />}
      size={isSmallMobile ? "sm" : "md"}
      style={{
        width: '100%',
        maxWidth: isMobile ? '100%' : '400px'
      }}
    />
  );
}
