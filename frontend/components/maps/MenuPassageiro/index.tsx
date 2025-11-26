"use client"

import { FieldGroup } from "@/components/ui/field";

import { useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { toast } from "sonner"

import AbaOrigem from "../AbasMenuPassageiro/AbaOrigem";
import AbaDestino from "../AbasMenuPassageiro/AbaDestino";
import AbaCategoria from "../AbasMenuPassageiro/AbaCategoria";
import AbaBuscaMotorista from "../AbasMenuPassageiro/AbaBuscaMotorista";
import AbaCorrida from "../AbasMenuPassageiro/AbaCorrida";
import AbaPagamento from "../AbasMenuPassageiro/AbaPagamento";
import { AbaMenuPassageiro, Categoria, FormaPagamento, Geolocalizacao, Localizacao, Motorista, PagamentoStatus, StatusCorrida } from "@/types/types";
import { handleUpdateDestino, handleUpdateOrigem } from "@/util/googleApiMethods";

type MenuPassageiroProps = {
    onSelecionarOrigem?: (loc: Localizacao) => void;
    onSelecionarDestino?: (loc: Localizacao) => void;
    onBuscarMotorista?: () => void;
    distancia: number | undefined;
    posicao: { lat: number; lng: number } | null;
    getPosicaoAtual: (callback: (pos: Geolocalizacao | null) => void) => void;
};

const motorista: Motorista = {
    nome: 'Rafael',
    telefone: "(61)98855-1255",
    avaliacoes: 4.9,
    img_url: 'https://github.com/laube-developer.png'
}

const formasDePagamento: FormaPagamento[] = [
    {
        nome: "final 4689",
        tipo: 'credito',
        descricao: 'MasterCard'
    },
    {
        nome: "Saldo em Conta",
        tipo: 'saldo em conta',
        descricao: 'Saldo atual R$ 67,63'
    },

];

export default function MenuPassageiro({
    onSelecionarOrigem,
    onSelecionarDestino,
    onBuscarMotorista,
    distancia,
    posicao,
    getPosicaoAtual
}: MenuPassageiroProps) {

    const [origem, setOrigem] = useState<Localizacao>(null);
    const [destino, setDestino] = useState<Localizacao>(null);
    const [abaMenu, setAbaMenu] = useState<AbaMenuPassageiro>("origem");
    const [categoria, setCategoria] = useState<Categoria>('luxo');

    const inputOrigemRef = useRef<HTMLInputElement | null>(null);
    const inputDestinoRef = useRef<HTMLInputElement | null>(null);

    const map = useMap();

    const [formaAtualDePagamento, setFormaPagamento] = useState(0);
    const [statusCorrida, setStatusCorrida] = useState<StatusCorrida>('motorista_chegou')

    const [statusPagamento, setStatusPagamento] = useState<PagamentoStatus>(null)

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
    )}

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
    )}

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
                        onBuscarMotorista={onBuscarMotorista}
                        abaMenu={abaMenu}
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