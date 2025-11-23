"use client"
import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

interface RoutePolylineProps {
  path: google.maps.LatLngLiteral[];
}

export default function RoutePolyline({ path }: RoutePolylineProps) {
  const map = useMap(); 
  const strokeColor = '#000'; 

  useEffect(() => {
    if (!map || path.length === 0) return;

    const polyline = new google.maps.Polyline({
      path: path,
      geodesic: true,
      strokeColor: strokeColor, 
      strokeOpacity: 0.8,
      strokeWeight: 4,
      map: map,
    });

    return () => {
      polyline.setMap(null);
    };
  }, [map, path, strokeColor]);

  return null; 
}