"use client";

import { RefObject, useEffect, useRef } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
  placeholder: string;
  onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
  className?: string;
  ref?: RefObject<HTMLInputElement | null>
}

export function AutocompleteInput({ placeholder, onPlaceSelected, className, ref}: Props) {
  const inputRef = ref || useRef<HTMLInputElement | null>(null);
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
