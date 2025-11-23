"use client"
import { useMapsLibrary } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

interface DistanceCalculatorProps {
  origem: google.maps.LatLngLiteral | null;
  destino: google.maps.LatLngLiteral | null;
  distanceCallback?: (distanciaKm: number | undefined) => void;
  durationCallback?: (durationM: number | undefined) => void;
}

export default function DistanceTimeCalculator({ origem, destino, distanceCallback ,durationCallback}: DistanceCalculatorProps) {
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
          
          distanceCallback?.(km);

          const tempo = result.routes[0].legs[0].duration?.value;
          durationCallback?.(tempo)

        } else {
          console.error("Distance calculation failed:", status);
          distanceCallback?.(undefined);
        }
      }
    );
  }, [routesLib, origem, destino, distanceCallback]);

  return null;
}
