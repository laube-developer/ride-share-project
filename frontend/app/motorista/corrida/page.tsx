"use client"

import Header from '@/components/Header';
import HeaderMotorista from '@/components/HeaderMotorista';
import InterfacePrincipal from '@/components/InterfacePrincipal';
import LoadingPage from '@/components/Loading';
import DestinoMarker from '@/components/maps/DestinoMarker';
import DistanceTimeCalculator from '@/components/maps/DistanceTimeCalculator';
import { LocalizacaoAtual } from '@/components/maps/LocalizacaoAtual';
import MenuMotorista from '@/components/maps/MenuMotorista';

import MotoristaMarker from '@/components/maps/MotoristaMarker';
import OrigemMarker from '@/components/maps/OrigemMarker';
import PassageiroMarker from '@/components/maps/PassageiroMarker';
import RouteCalculator from '@/components/maps/RouteCalculator';
import RoutePolyline from '@/components/maps/RoutePolyline.tsx';
import useSessionStorage from '@/hooks/useSessionStorage';
import { Localizacao, StatusCorrida, StatusMotorista } from '@/types/types';
import { panTo } from '@/util/googleApiMethods';
import { APIProvider, Map } from '@vis.gl/react-google-maps';
import { set } from 'date-fns';
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
        lat: -15.988705728337287,
        lng: -48.04442081619255,
        name: "UNB Campus Gama"
        ,
    });
    const [destino, setDestino] = useState<Localizacao | null>({
        lat: -15.833468034603413,
        lng: -47.953542192718174,
        name: "Park Shopping Brasília"
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

    const [statusMotorista, setStatusMotorista] = useState<StatusMotorista>("offline");

    const { session, isLoading } = useSessionStorage('SESSION', '/motorista/login', 'MOTORISTA');

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

    const backend = process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN

    const operacoes: Record<OperacoesMotorista, (attr?: any) => void> = {
        ficarOnline: () => {
            setStatusMotorista("processando");
            fetch(`${backend}/api/motorista/ficar-online`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(session)
            })
                .then(async (response) => {
                    if (response.status !== 200) {
                        toast.error(await response.text(), { position: "top-right" })
                        setStatusMotorista("offline")
                        return
                    }

                    const message = await response.text()

                    toast.success(message, { position: "top-right" })
                    setStatusMotorista("online")

                })
                .catch(error=> {
                    toast.error("Erro ao ficar online: " + error, { position: "top-right" })
                    console.error(error)
                    setStatusMotorista("offline")
                })





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

    if (isLoading || !session) return <LoadingPage />

    return (
        <div className="flex flex-col h-dvh relative">

            <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!} libraries={["routes"]}>
                <HeaderMotorista 
                    session={session}
                />

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
                            session={session}
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
