"use client"

import Header from '@/components/Header';
import InterfacePrincipal from '@/components/InterfacePrincipal';
import DestinoMarker from '@/components/maps/DestinoMarker';
import DistanceTimeCalculator from '@/components/maps/DistanceTimeCalculator';
import { LocalizacaoAtual } from '@/components/maps/LocalizacaoAtual';
import MenuPassageiro from '@/components/maps/MenuPassageiro';
import OrigemMarker from '@/components/maps/OrigemMarker';
import RouteCalculator from '@/components/maps/RouteCalculator';
import RoutePolyline from '@/components/maps/RoutePolyline.tsx';
import { Localizacao } from '@/types/types';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';

export default function ViagemPage() {
    const [posicao, setPosicao] = useState<{ lat: number; lng: number; name?: string } | null>(null);
    const [origem, setOrigem] = useState<{ lat: number; lng: number; name?: string } | null>(null);
    const [destino, setDestino] = useState<{ lat: number; lng: number; name?: string } | null>(null);
    const [mostrarRota, setMostrarRota] = useState(false);
    const [rota, setRota] = useState<google.maps.LatLngLiteral[]>([]);
    const [distancia, setDistancia] = useState<number | undefined>(undefined);
    const [duracao, setDuracao] = useState<number | undefined>(undefined);

    const getPosicaoAtual = (callback: (pos: { lat: number; lng: number } | null) => void) => {
        navigator.geolocation.getCurrentPosition(
            (loc) => {
                callback({
                    lat: loc.coords.latitude,
                    lng: loc.coords.longitude,
                });
            },
            (err) => {
                console.error("Erro ao obter localização:", err);
                callback(null);
            }
        );
    };

    

    useEffect(() => {
        getPosicaoAtual((pos) => {
            if (pos) setPosicao(pos);
        });
    }, []);

    const handleSelecionarOrigem = (loc: Localizacao) => {
        if (!loc) return
        
        setOrigem({ lat: loc?.lat, lng: loc?.lng, name: loc?.name });
        setMostrarRota(false);
        setRota([]);
    };

    const handleSelecionarDestino = (loc: Localizacao) => {
        if (!loc) return
        
        setDestino({ lat: loc?.lat, lng: loc?.lng, name: loc?.name });
        setMostrarRota(true);
        setRota([]);
    };

    return (
        <div className="flex flex-col h-dvh relative">

            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!}>
                <Header />

                <Map
                    style={{ width: "100vw", height: "100vh" }}
                    defaultCenter={posicao || { lat: 22.54992, lng: 0 }}
                    defaultZoom={posicao ? 15 : 3}
                    gestureHandling="greedy"
                    disableDefaultUI
                    mapId={process.env.NEXT_PUBLIC_MAP_ID!}
                    className="relative h-full w-screen"
                >
                    <InterfacePrincipal>

                        <MenuPassageiro
                            onSelecionarOrigem={handleSelecionarOrigem}
                            onSelecionarDestino={handleSelecionarDestino}
                            onBuscarMotorista={() => setMostrarRota(true)}
                            posicao={posicao}
                            distancia={distancia}
                            getPosicaoAtual={getPosicaoAtual}
                        />
                    </InterfacePrincipal>

                    {(posicao?.lat != origem?.lat && posicao?.lng != origem?.lng) && <LocalizacaoAtual posicao={posicao} />}


                    <DistanceTimeCalculator origem={origem} destino={destino} distanceCallback={setDistancia} durationCallback={setDuracao} />

                    <RouteCalculator origem={origem} destino={destino} mostrarRota={mostrarRota} setRota={setRota} />

                    {origem && <OrigemMarker origem={origem} />}

                    {destino && <DestinoMarker destino={destino} duracao={duracao} />}

                    {rota.length > 0 && <RoutePolyline path={rota} />}
                </Map>
            </APIProvider>
        </div>
    );
}
