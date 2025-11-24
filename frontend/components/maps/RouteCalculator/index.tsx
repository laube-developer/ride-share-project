"use client"
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { useEffect } from 'react';

interface RouteCalculatorProps {
  origem: google.maps.LatLngLiteral | null;
  destino: google.maps.LatLngLiteral | null;
  mostrarRota: boolean;
  setRota: (path: google.maps.LatLngLiteral[]) => void;
}

export default function RouteCalculator({ origem, destino, mostrarRota, setRota }: RouteCalculatorProps) {
  const routesLib = useMapsLibrary("routes"); 
  const map = useMap(); 

  useEffect(() => {
    if (!routesLib || !mostrarRota || !origem || !destino) return;

    const directionsService = new routesLib.DirectionsService();

    directionsService.route(
      {
        origin: origem,
        destination: destino,
        travelMode: google.maps.TravelMode.DRIVING,
      },
      (result, status) => {
        if (status === "OK" && result) {
          const polyline = result.routes[0].overview_path.map((p) => ({
            lat: p.lat(),
            lng: p.lng(),
          }));
          
          setRota(polyline);

          if (map) {
            const bounds = new google.maps.LatLngBounds();
            polyline.forEach((p) => bounds.extend(p));

            const padding = {
                top: 150,
                bottom: 50,
                left: 50,
                right: 50,
            };

            map.fitBounds(bounds, padding);
          }
        } else {
            console.error('Directions request failed due to ' + status);
            setRota([]); 
        }
      }
    );
  }, [routesLib, mostrarRota, origem, destino, map, setRota]); 

  return null;
}