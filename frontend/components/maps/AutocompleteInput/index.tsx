"use client";

import { forwardRef, RefObject, useEffect, useRef, useState } from "react";
import { useMapsLibrary } from "@vis.gl/react-google-maps";

interface Props {
    placeholder: string;
    onPlaceSelected: (place: google.maps.places.PlaceResult) => void;
    className?: string;
    value?: string;
    disabled?: boolean;
    disabledOnClick?: () => void;
}

export const AutocompleteInput = forwardRef<HTMLInputElement, Props>(
    ({ placeholder, onPlaceSelected, className, value, disabled, disabledOnClick }, ref) => {

        // --- MODO DESABILITADO ---
        if (disabled) {
            return (
                <input
                    className={className ?? "border p-2 rounded w-full"}
                    value={value ?? ""}
                    readOnly
                    onClick={() => disabledOnClick?.()}
                />
            );
        }

        // --- MODO NORMAL ---
        const internalRef = useRef<HTMLInputElement | null>(null);
        const inputRef = (ref as RefObject<HTMLInputElement>) ?? internalRef;

        const places = useMapsLibrary("places");

        const [internalValue, setInternalValue] = useState(value ?? "");

        // Sincroniza quando o pai alterar value
        useEffect(() => {
            if (value !== undefined) {
                setInternalValue(value);
            }
        }, [value]);

        useEffect(() => {
            if (!places || !inputRef.current) return;

            const autocomplete = new places.Autocomplete(inputRef.current, {
                fields: ["geometry", "formatted_address", "name"],
            });

            const listener = autocomplete.addListener("place_changed", () => {
                const place = autocomplete.getPlace();
                onPlaceSelected(place);

                if (place.formatted_address) {
                    setInternalValue(place.formatted_address);
                }
            });

            return () => listener.remove();
        }, [places]);

        return (
            <input
                ref={inputRef}
                placeholder={placeholder}
                className={className ?? "border p-2 rounded w-full"}
                value={internalValue}    // <--- ESSENCIAL!!!
                onChange={(e) => setInternalValue(e.target.value)}
            />
        );
    }
);
