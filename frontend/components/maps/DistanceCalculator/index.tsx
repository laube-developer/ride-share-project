"use client"
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

interface DistanceCalculatorProps {
  origem: google.maps.LatLngLiteral | null;
  destino: google.maps.LatLngLiteral | null;
  callback?: (distanciaKm: number | undefined) => void;
}

export default function DistanceCalculator({ origem, destino, callback }: DistanceCalculatorProps) {
  const routesLib = useMapsLibrary("routes");

  useEffect(() => {
    if (!routesLib || !origem || !destino) return;

    const directionsService = new routesLib.DirectionsService();

    directionsService.route(
      {
        origin: origem,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          const metros = result.routes[0].legs[0].distance?.value;
          const km = metros ? Number((metros / 1000).toFixed(2)) : undefined;

          callback?.(km);
        } else {
          console.error("Distance calculation failed:", status);
          callback?.(undefined);
        }
      }
    );
  }, [routesLib, origem, destino, callback]);

  return null;
}
