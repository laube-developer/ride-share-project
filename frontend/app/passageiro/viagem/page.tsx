"use client"

import Header from '@/components/Header';
import InterfacePrincipal from '@/components/InterfacePrincipal';
import { LocalizacaoAtual } from '@/components/maps/LocalizacaoAtual';
import MenuPassageiro from '@/components/maps/MenuPassageiro';
import RouteCalculator from '@/components/maps/RouteCalculator';
import RoutePolyline from '@/components/maps/RoutePolyline.tsx';
import {AdvancedMarker, APIProvider, Map} from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';


export default function ViagemPage() {
  const [posicao, setPosicao] = useState<{ lat: number; lng: number } | null>(null);
  const [origem, setOrigem] = useState<{ lat: number; lng: number } | null>(null);
  const [destino, setDestino] = useState<{ lat: number; lng: number } | null>(null);
  const [mostrarRota, setMostrarRota] = useState(false);
  const [rota, setRota] = useState<google.maps.LatLngLiteral[]>([]);


  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (loc) => {
        setPosicao({
          lat: loc.coords.latitude,
          lng: loc.coords.longitude,
        });
      },
      (err) => console.error("Erro ao obter localização:", err)
    );
  }, []);

  const handleSelecionarOrigem = ({lat, lng}: {name?: string; lat: number; lng: number}) => {
    setOrigem({ lat, lng });
    setMostrarRota(false); 
    setRota([]);
  }

  const handleSelecionarDestino = ({lat, lng}: {name?: string; lat: number; lng: number}) => {
    setDestino({ lat, lng });
    setMostrarRota(false);
    setRota([]);
  }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
      <Map
        style={{width: '100vw', height: '100vh'}}
        defaultCenter={posicao || {lat: 22.54992, lng: 0}}
        defaultZoom={posicao ? 15 : 3}
        gestureHandling='greedy'
        disableDefaultUI
        mapId={process.env.NEXT_PUBLIC_MAP_ID!}
      >
        <InterfacePrincipal>
          <Header />
          <MenuPassageiro
            onSelecionarOrigem={handleSelecionarOrigem}
            onSelecionarDestino={handleSelecionarDestino}
            onBuscarMotorista={() => setMostrarRota(true)}
          />
        </InterfacePrincipal>
        <LocalizacaoAtual posicao={posicao} />
        
        <RouteCalculator
            origem={origem}
            destino={destino}
            mostrarRota={mostrarRota}
            setRota={setRota}
        />

        {origem && (
          <AdvancedMarker position={{ lat: origem.lat, lng: origem.lng }}>
            <div className="w-5 h-5 bg-green-600 border-3 border-white rounded-full shadow-lg" title="Origem" />
          </AdvancedMarker>
        )}

        {destino && (
          <AdvancedMarker
            position={{ lat: destino.lat, lng: destino.lng }}>
            <div className="w-5 h-5 bg-red-600 border-3 border-white rounded-full shadow-lg" title="Destino" />
          </AdvancedMarker>
        )}

        {/* COMPONENTE QUE DESENHA A ROTA (FILHO DE <Map>) */}
        {rota.length > 0 && (
          <RoutePolyline
            path={rota}
          />
        )}
      </Map>
  </APIProvider>
  );
}