"use client";

import {AdvancedMarker, useMap} from "@vis.gl/react-google-maps";
import { useEffect } from "react";

export function LocalizacaoAtual({ posicao }: { posicao: { lat: number; lng: number } | null }) {
  const map = useMap(); // AGORA funciona

  useEffect(() => {
    if (map && posicao) {
      map.setCenter(posicao);
      map.setZoom(15);
    }
  }, [map, posicao]);

  if (!posicao) return null;

  return (
    <AdvancedMarker position={posicao} anchorTop="-50%">
      <div
        style={{
          width: 20,
          height: 20,
          background: "#fdc426",
          borderRadius: "50%",
          border: "4px solid black",
        }}
      />
    </AdvancedMarker>
  );
}
