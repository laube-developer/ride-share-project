"use client"

import Header from '@/components/Header';
import HeaderMotorista from '@/components/HeaderMotorista';
import InterfacePrincipal from '@/components/InterfacePrincipal';
import DestinoMarker from '@/components/maps/DestinoMarker';
import DistanceTimeCalculator from '@/components/maps/DistanceTimeCalculator';
import { LocalizacaoAtual } from '@/components/maps/LocalizacaoAtual';
import MenuMotorista from '@/components/maps/MenuMotorista';

import MotoristaMarker from '@/components/maps/MotoristaMarker';
import OrigemMarker from '@/components/maps/OrigemMarker';
import PassageiroMarker from '@/components/maps/PassageiroMarker';
import RouteCalculator from '@/components/maps/RouteCalculator';
import RoutePolyline from '@/components/maps/RoutePolyline.tsx';
import { Localizacao, StatusCorrida, StatusMotorista } from '@/types/types';
import { panTo } from '@/util/googleApiMethods';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

export type OperacoesMotorista =
    "ficarOnline" |
    "ficarOffline" |
    "aceitarCorrida" |
    "seguirAtePassageiro" |
    "iniciarCorrida" |
    "cancelarCorrida" |
    "finalizarCorrida" |
    "registrarPendencia" |
    "confirmarPagamento"
    ;


export default function CorridaPage() {
    const [posicao, setPosicao] = useState<{ lat: number; lng: number; name?: string } | null>(null);
    const [origem, setOrigem] = useState<Localizacao | null>({
        lat: -15.880105436286705,
        lng: -48.00851267498029,
        name: "QN1 Conjunto 2/3"
    });
    const [destino, setDestino] = useState<Localizacao | null>({
        lat: -15.864570401825036,
        lng: -48.03001610329702,
        name: "UCB - Universidade Católica de Brasília"
    });
    const [mostrarRota, setMostrarRota] = useState(false);
    const [rota, setRota] = useState<google.maps.LatLngLiteral[]>([]);
    const [distancia, setDistancia] = useState<number | undefined>(undefined);
    const [duracao, setDuracao] = useState<number | undefined>(undefined);

    const [mostrarRotaAtePassageiro, setMostrarRotaAtePassageiro] = useState(false);
    const [rotaAtePassageiro, setRotaAtePassageiro] = useState<google.maps.LatLngLiteral[]>([]);
    const [distanciaAtePassageiro, setDistanciaAtePassageiro] = useState<number | undefined>(undefined);
    const [duracaoAtePassageiro, setDuracaoAtePassageiro] = useState<number | undefined>(undefined);

    const [statusCorridaAtual, setStatusCorridaAtual] = useState<StatusCorrida | null>("solicitada")
    const [statusProximaCorrida, setStatusProximaCorrida] = useState<StatusCorrida | null>(null)

    const [statusMotorista, setStatusMotorista] = useState<StatusMotorista>("online");

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
        const interval = setInterval(() => {
            getPosicaoAtual((pos) => {
                if (pos) setPosicao(pos);
            });
        }, 1000)

        return () => clearInterval(interval)
    }, []);



    const handleMostrarRota = (origem: Localizacao, destino: Localizacao) => {
        if (!origem || !destino) return

        setOrigem({ lat: origem?.lat, lng: origem?.lng, name: origem?.name });
        setDestino({ lat: destino?.lat, lng: destino?.lng, name: destino?.name });
        setMostrarRota(true);
        setRota([]);
    };

    const operacoes: Record<OperacoesMotorista, (attr?: any) => void> = {
        ficarOnline: () => {
            setStatusMotorista("processando");
            setTimeout(() => (setStatusMotorista("online")), 2000);
        },

        ficarOffline: () => {
            setStatusMotorista("processando");
            setTimeout(() => (setStatusMotorista("offline")), 2000);
        },

        aceitarCorrida: () => {
            //aceitar corrida no backend e esperar a resposta
            //caso autorizado

            setMostrarRotaAtePassageiro(false)
            setRotaAtePassageiro([])

            setMostrarRota(true)
            setStatusCorridaAtual("aceita")
        },
        seguirAtePassageiro: () => {
            setMostrarRota(false)
            setRota([])
            setMostrarRotaAtePassageiro(true)
        },
        iniciarCorrida: () => {
            setMostrarRota(true)
            setMostrarRotaAtePassageiro(false)
            setRotaAtePassageiro([])
            setStatusCorridaAtual("iniciada")
        },
        cancelarCorrida: () => {
            setStatusCorridaAtual("cancelada")
            toast("Corrida cancelada")
        },
        finalizarCorrida: (map: google.maps.Map | null) => {
            setStatusCorridaAtual("finalizada")
            setRota([])
            setOrigem(null)


            if (destino?.lat && destino?.lng && map) {
                panTo(
                    { lat: destino?.lat, lng: destino?.lng },
                    map,
                    15
                )
            }
        },
        confirmarPagamento: (map: google.maps.Map | null) => {
            setDestino(null)
            setStatusCorridaAtual(null)

            if (posicao?.lat && posicao?.lng && map) {
                panTo(
                    { lat: posicao?.lat, lng: posicao?.lng },
                    map,
                    15
                )
            }
        },
        registrarPendencia: (x: number) => {

        }
    }


    return (
        <div className="flex flex-col h-dvh relative">

            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["routes"]}>
                <HeaderMotorista />

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

                        <MenuMotorista
                            origem={origem}
                            destino={destino}
                            distancia={distancia}
                            duracao={duracao}
                            statusCorridaAtual={statusCorridaAtual}
                            statusProximaCorrida={statusProximaCorrida}
                            operacoes={operacoes}
                            duracaoAtePassageiro={duracaoAtePassageiro}
                            distanciaAtePassageiro={distanciaAtePassageiro}
                            statusMotorista={statusMotorista}
                        />

                    </InterfacePrincipal>

                    <DistanceTimeCalculator origem={origem} destino={destino} distanceCallback={setDistancia} durationCallback={setDuracao} />
                    <RouteCalculator origem={origem} destino={destino} mostrarRota={mostrarRota} setRota={setRota} />
                    {rota.length > 0 && <RoutePolyline path={rota} />}

                    <DistanceTimeCalculator origem={posicao} destino={origem} distanceCallback={setDistanciaAtePassageiro} durationCallback={setDuracaoAtePassageiro} />
                    <RouteCalculator origem={posicao} destino={origem} mostrarRota={mostrarRotaAtePassageiro} setRota={setRotaAtePassageiro} />
                    {rotaAtePassageiro.length > 0 && <RoutePolyline path={rotaAtePassageiro} color="#fdc426" />}


                    {posicao && statusCorridaAtual != "finalizada" && <MotoristaMarker origem={posicao} showPulse={!statusCorridaAtual && statusMotorista == "online"} />}
                    {origem && statusCorridaAtual == "iniciada" && <OrigemMarker origem={origem} />}
                    {origem && statusCorridaAtual == "aceita" && <PassageiroMarker origem={origem} />}
                    {destino && <DestinoMarker destino={destino} duracao={duracao} />}

                </Map>
            </APIProvider>
        </div>
    );
}
