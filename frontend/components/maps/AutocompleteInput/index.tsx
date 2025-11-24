"use client";

import { useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
  placeholder: string;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  className?: string;
}

export function AutocompleteInput({ placeholder, onPlaceSelected, className }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const places = useMapsLibrary("places");

  useEffect(() => {
    if (!places || !inputRef.current) return;

    const autocomplete = new places.Autocomplete(inputRef.current, {
      fields: ["geometry", "formatted_address", "name"],
    });

    autocomplete.addListener("place_changed", () => {
      const place = autocomplete.getPlace();
      onPlaceSelected(place);
    });

  }, [places]);

  return (
    <input
      ref={inputRef}
      placeholder={placeholder}
      className={className ?? "border p-2 rounded w-full"}
    />
  );
}
