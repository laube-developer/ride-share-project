"use client"
import { useMapsLibrary, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

// Constante para definir o que é considerado 'mobile'
const MOBILE_BREAKPOINT = 768;

interface RouteCalculatorProps {
  origem: google.maps.LatLngLiteral | null;
  destino: google.maps.LatLngLiteral | null;
  mostrarRota: boolean;
  setRota: (path: google.maps.LatLngLiteral[]) => void;
}

export default function RouteCalculator({ origem, destino, mostrarRota, setRota}: RouteCalculatorProps) {
  const routesLib = useMapsLibrary("routes"); 
  const map = useMap(); 
  
  const [windowWidth, setWindowWidth] = useState(0);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    handleResize(); 

    window.addEventListener('resize', handleResize);
    
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    if (!routesLib || !mostrarRota || !origem || !destino || windowWidth === 0) return;

    const isMobile = windowWidth < MOBILE_BREAKPOINT;

    const padding = isMobile 
      ? { // Mobile
          top: 50, 
          bottom: 250, 
          left: 50, 
          right: 50,
        }
      : { // Desktop
          top: 50, 
          bottom: 50,
          left: 400,
          right: 50,
        };
    
    // ... restante do código de cálculo de rotas ...

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
            
            map.fitBounds(bounds, padding);
          }
        } else {
            console.error('Directions request failed due to ' + status);
            setRota([]); 
        }
      }
    );
  }, [routesLib, mostrarRota, origem, destino, map, setRota, windowWidth]);

  return null;
}