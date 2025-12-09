"use client"

import { FieldGroup } from "@/components/ui/field";

import { use, useEffect, useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { toast } from "sonner"

import AbaOrigem from "../AbasMenuPassageiro/AbaOrigem";
import AbaDestino from "../AbasMenuPassageiro/AbaDestino";
import AbaCategoria from "../AbasMenuPassageiro/AbaCategoria";
import AbaBuscaMotorista from "../AbasMenuPassageiro/AbaBuscaMotorista";
import AbaCorrida from "../AbasMenuPassageiro/AbaCorrida";
import AbaPagamento from "../AbasMenuPassageiro/AbaPagamento";
import { AbaMenuPassageiro, Categoria, FormaPagamento, Geolocalizacao, Localizacao, Motorista, PagamentoStatus, Sessao, StatusCorrida } from "@/types/types";
import { handleUpdateDestino, handleUpdateOrigem } from "@/util/googleApiMethods";
import { useRouter } from "next/navigation";
import LoadingPage from "@/components/Loading";
import { text } from "stream/consumers";

type MenuPassageiroProps = {
    onSelecionarOrigem?: (loc: Localizacao) => void;
    onSelecionarDestino?: (loc: Localizacao) => void;
    onBuscarMotorista?: () => void;
    distancia: number | undefined;
    posicao: { lat: number; lng: number } | null;
    getPosicaoAtual: (callback: (pos: Geolocalizacao | null) => void) => void;
    session: Sessao | null
};

const motorista: Motorista = {
    nome: 'Rafael',
    telefone: "(61)98855-1255",
    avaliacoes: 4.9,
    img_url: 'https://github.com/laube-developer.png'
}



export default function MenuPassageiro({
    onSelecionarOrigem,
    onSelecionarDestino,
    onBuscarMotorista,
    distancia,
    posicao,
    getPosicaoAtual,
    session,
}: MenuPassageiroProps) {
    const [origem, setOrigem] = useState<Localizacao>(null);
    const [destino, setDestino] = useState<Localizacao>(null);
    const [abaMenu, setAbaMenu] = useState<AbaMenuPassageiro>("origem");
    const [categoria, setCategoria] = useState<Categoria>('luxo');
    const [formasDePagamento, setFormasDePagamento] = useState<FormaPagamento[]>([])

    const inputOrigemRef = useRef<HTMLInputElement | null>(null);
    const inputDestinoRef = useRef<HTMLInputElement | null>(null);

    const map = useMap();

    const [formaAtualDePagamento, setFormaPagamento] = useState(0);
    const [statusCorrida, setStatusCorrida] = useState<StatusCorrida>('motorista_chegou')

    const [statusPagamento, setStatusPagamento] = useState<PagamentoStatus>(null)

    const router = useRouter();

    const [isSessionValidated, setIsSessionValidated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const onPlaceSelectedOrigem = (place: google.maps.places.PlaceResult) => {
        const loc = place.geometry?.location;
        if (!loc) return;

        handleUpdateOrigem({
            name: place.name ?? place.name,
            lat: loc.lat(),
            lng: loc.lng(),
        },
            setOrigem,
            onSelecionarOrigem,
            map
        )
    }

    const onPlaceSelectedDestino = (place: google.maps.places.PlaceResult) => {
        const loc = place.geometry?.location;
        if (!loc) return;

        handleUpdateDestino({
            name: place.name ?? place.name,
            lat: loc.lat(),
            lng: loc.lng(),
        },
            setDestino,
            onSelecionarDestino,
            map
        )
    }

    useEffect(() => {
        if (!session) {
            router.push('/passageiro/login');
        };
    }, [session]);



    useEffect(() => {
        const backend = process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN || 'http://localhost:8080';

        const loadPaymentMethods = async () => {
            if (!session) return;

            try {

                const response = await fetch(`${backend}/api/passageiro/formas-pagamento`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        "nomeDoUsuario": session.nomeDeUsuario,
                        "sessaoToken": session.sessaoToken,
                        "email": session.email,
                        "categoria": session.categoria
                    }),
                });

                if (!response.ok) {
                    const errorDetails = await response.text();
                    toast.error(`Erro ${response.status} ao carregar formas de pagamento.\n${errorDetails}`);
                    return;
                }

                let data: FormaPagamento[] | null = null;

                const contentType = response.headers.get("content-type");

                if (contentType && contentType.includes("application/json") && response.status === 200) {
                    const textData = await response.clone().text();

                    if (textData.length > 0) {
                        try {
                            console.log(data)
                            data = await response.json();
                        } catch (e) {
                            console.error("Falha ao parsear JSON:", e);
                            data = [];
                        }
                    }
                }

                const carregadas = data || [];

                setFormasDePagamento(carregadas);

                console.log('Formas de Pagamento carregadas (Dados):', carregadas);


            } catch (error) {
                console.error('Erro de rede ou desconhecido:', error);
                toast.error('Falha de conexão ao carregar pagamentos.');
            }
        };

        loadPaymentMethods();

    }, [session]);

    useEffect(() => {
        if (abaMenu !== "buscando motorista" || !session) return;

        const intervalo = setInterval(() => {
            console.log("Verificando status da corrida... ");

            console.log(session.email)

            const envio = {
                "nomeDeUsuario": session?.nomeDeUsuario,
                "sessaoToken": session?.sessaoToken,
                "email": session.email,
                "categoria": session?.categoria
            }

            console.log(session.email)

            fetch(`${process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN}/api/passageiro/verificar-corrida-ativa`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(envio)
            })
                .then(async (data) => {
                    if (data.status != 200) {
                        const errorText = await data.text();
                        toast.error(`Erro ao verificar corrida: ${errorText}`, {
                            position: "top-right"
                        })
                        return
                    }

                    const statusData = await data.json();
                    console.log("Status da corrida:", statusData);

                    if (statusData.statusCorrida === "") {
                        setAbaMenu("corrida");
                        setStatusCorrida("iniciada");
                        toast.success("Motorista a caminho!", {
                            position: "top-right"
                        })
                    }
                })
                .catch(reason => {
                    toast.error("Falha ao verificar corrida\n" + reason, { position: "top-right" });
                })
        }, 5000);
        return () => clearInterval(intervalo);
    }, [abaMenu, session]);

    return (
        <div className="md:p-2 items-center flex justify-start">
            <div className="bg-white bg-opacity-90 rounded-t-2xl md:rounded-2xl shadow-xl p-4 z-20 shadow-xl w-full md:w-96 lg:w-100 xl:w-110 2xl:w-120">
                <FieldGroup className="flex flex-col">
                    <AbaOrigem
                        map={map}
                        open={abaMenu == "origem"}
                        origem={origem}
                        abaAtual={abaMenu}
                        setOrigem={setOrigem}
                        posicaoAtual={posicao}
                        setAbaMenu={setAbaMenu}
                        inputOrigemRef={inputOrigemRef}
                        onPlaceSelected={onPlaceSelectedOrigem}
                        onSelecionarOrigem={onSelecionarOrigem}
                    />

                    <AbaDestino
                        open={abaMenu == "destino"}
                        origem={origem}
                        setDestino={setDestino}
                        posicaoAtual={posicao}
                        setAbaMenu={setAbaMenu}
                        inputOrigemRef={inputOrigemRef}
                        onPlaceSelected={onPlaceSelectedDestino}
                        destino={destino}
                        handleUpdateDestino={(loc: Localizacao) => {
                            handleUpdateDestino(
                                loc,
                                setDestino,
                                onSelecionarDestino,
                                map
                            )
                        }}
                        inputDestinoRef={inputDestinoRef}
                    />

                    <AbaCategoria
                        open={abaMenu == "categoria"}
                        categoria={categoria}
                        destino={destino}
                        distancia={distancia}
                        origem={origem}
                        setAbaMenu={setAbaMenu}
                        setCategoria={setCategoria}
                        setStatusCorrida={setStatusCorrida}
                        onBuscarMotorista={() => {
                            fetch(`${process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN}/api/passageiro/solicitar-corrida`, {
                                method: "POST",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({
                                    "sessao": session,
                                    "origem": origem,
                                    "destino": destino,
                                    "categoria": categoria == 'luxo' ? 'LUXO' : 'COMUM',
                                    "precoEstimado": distancia ? (categoria == 'luxo' ? 5 + (distancia * 2) : 5 + distancia) * 10 : 0
                                })
                            })
                                .then(async (data) => {
                                    if (data.status != 200) {
                                        const errorText = await data.text();
                                        toast.error(`Erro ao solicitar corrida: ${errorText}`, {
                                            position: "top-right"
                                        })
                                        return
                                    }

                                    if (onBuscarMotorista) onBuscarMotorista()
                                    setAbaMenu("buscando motorista");
                                    setStatusCorrida('solicitada')

                                    toast.success("Corrida solicitada com sucesso!", {
                                        position: "top-right"
                                    })
                                    setAbaMenu("buscando motorista")
                                })
                                .catch(reason => {
                                    toast.error("Falha ao solicitar corrida\n" + reason, { position: "top-right" });
                                })
                        }}
                        abaMenu={abaMenu}
                        formasPagamento={formasDePagamento}
                        indiceFormaPagamento={formaAtualDePagamento}
                        setFormaPagamento={setFormaPagamento}
                    />

                    <AbaBuscaMotorista
                        open={abaMenu == "buscando motorista"}
                        cancelarCorrida={() => {
                            setAbaMenu('destino');
                            toast.error('Corrida cancelada', {
                                position: 'top-right'
                            })
                        }}
                    />

                    <AbaCorrida
                        open={abaMenu == "corrida"}
                        origem={origem}
                        destino={destino}
                        distancia={distancia}
                        motorista={motorista}
                        statusCorrida={statusCorrida}
                        cancelarCorrida={() => {
                            setAbaMenu('destino');
                            toast.error('Corrida cancelada', {
                                position: 'top-right'
                            })
                        }}

                    />

                    <AbaPagamento
                        open={abaMenu == "pagamento"}
                        categoria={categoria}
                        formasPagamento={formasDePagamento}
                        indiceFormaPagamento={formaAtualDePagamento}
                        setFormaPagamento={setFormaPagamento}
                        statusPagamento={statusPagamento}
                        realizarPagamento={() => {
                            setStatusPagamento("processando")
                            setTimeout(() => {
                                //implementar pagamento 
                                const chance = Math.random()
                                setStatusPagamento(chance > .5 ? "pago" : "falha_no_pagamento")

                                if (statusPagamento == "falha_no_pagamento") {
                                    toast.error("Falha no pagamento.", {
                                        position: "top-right"
                                    })
                                    return
                                }

                            }, 2000)
                        }}
                        statusCorrida={statusCorrida}
                        distancia={distancia}
                        voltarParaInicio={() => {
                            setAbaMenu("origem")
                        }}
                        motorista={motorista}
                        onAvaliarMotorista={(v) => alert("Usuário avaliou o motorista com " + v + " estrelas.")}
                    />
                </FieldGroup>

            </div>
        </div>
    );
}