"use client"

import { FieldGroup } from "@/components/ui/field";

import { useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { toast } from "sonner"


import { AbaMenuPassageiro, Categoria, FormaPagamento, Geolocalizacao, Localizacao, Motorista, PagamentoStatus, Passageiro, StatusCorrida, StatusMotorista } from "@/types/types";
import { handleUpdateDestino, handleUpdateOrigem } from "@/util/googleApiMethods";
import AbaPrincipal from "../AbasMenuMotorista/AbaPrincipal";
import AbaRecebendoCorrida from "../AbasMenuMotorista/AbaRecebendoCorrida";
import { OperacoesMotorista } from "@/app/motorista/corrida/page";
import AbaCorridaAceita from "../AbasMenuMotorista/AbaCorridaAceita";
import AbaCorridaIniciada from "../AbasMenuMotorista/AbaCorridaIniciada";
import AbaReceberPagamento from "../AbasMenuMotorista/AbaReceberPagamento";

type MenuMotoristaProps = {
    origem: Localizacao;
    destino: Localizacao;
    distancia: number | undefined;
    duracao: number | undefined;
    statusCorridaAtual: StatusCorrida
    statusProximaCorrida: StatusCorrida | null,
    operacoes: Record<OperacoesMotorista, (attr?: any) => void>
    duracaoAtePassageiro: number | undefined;
    distanciaAtePassageiro: number | undefined;
    statusMotorista: StatusMotorista;
};

const motorista: Motorista = {
    nome: 'Rafael',
    telefone: "(61)98855-1255",
    avaliacoes: 4.9,
    img_url: 'https://github.com/laube-developer.png'
}

const passageiro: Passageiro = {
    nome: 'Rafael',
    telefone: "(61)98855-1255",
    avaliacoes: 4.9,
    img_url: 'https://github.com/laube-developer.png'
}

export type AbaMenuMotorista = 
    "principal" |
    "corrida recebida" |
    "corrida aceita" |
    "deslocando ao passageiro" |
    "corrida iniciada" |
    "pagamento"
;

export default function MenuPassageiro({
    origem,
    destino,
    distancia,
    duracao,
    statusCorridaAtual,
    statusProximaCorrida,
    operacoes,
    distanciaAtePassageiro,
    duracaoAtePassageiro,
    statusMotorista,

}: MenuMotoristaProps) {
    const [abaMenu, setAbaMenu] = useState<AbaMenuMotorista>("principal");
    const [recebendoCorrida, setRecebendoCorrida] = useState(true)

    const map = useMap();

    return (
        <div className="md:p-2 items-center flex justify-start">
            <div className="bg-white bg-opacity-90 rounded-t-2xl md:rounded-2xl shadow-xl p-4 z-20 shadow-xl w-full md:w-96 lg:w-100 xl:w-110 2xl:w-120">
                <FieldGroup className="flex flex-col">
                    <AbaPrincipal
                        open={abaMenu == "principal"}
                        statusMotorista={statusMotorista}
                        ficarOnline={operacoes.ficarOnline}
                        ficarOffline={operacoes.ficarOffline}
                        motorista={motorista}
                    />

                    <AbaRecebendoCorrida
                        open={recebendoCorrida}
                        passageiro={passageiro}
                        origem={origem}
                        destino={destino}
                        aceitarCorrida={() => {
                            operacoes.aceitarCorrida()
                            setAbaMenu("corrida aceita")
                        }}
                        distancia={distancia}
                        /*catetoria={/*inserir a categoria}*/
                    />

                    <AbaCorridaAceita
                        open={abaMenu == "corrida aceita" || abaMenu == "deslocando ao passageiro"}
                        seguirAtePassageiro={() => {
                            operacoes.seguirAtePassageiro()
                            setAbaMenu("deslocando ao passageiro")
                        }}
                        iniciarCorrida={() => {
                            operacoes.iniciarCorrida()
                            setAbaMenu("corrida iniciada")
                        }}
                        abaMenu={abaMenu}
                        origem={origem}
                        destino={destino}
                        cancelarCorrida={operacoes.cancelarCorrida}
                        passageiro={passageiro}
                        distanciaAtePassageiro={distanciaAtePassageiro}
                        duracaoAtePassageiro={duracaoAtePassageiro}
                    />

                    <AbaCorridaIniciada
                        open={abaMenu == "corrida iniciada"}
                        finalizarCorrida={() => {
                            operacoes.finalizarCorrida(map)
                            setAbaMenu("pagamento")
                        }}
                        cancelarCorrida={operacoes.cancelarCorrida}
                        origem={origem}
                        destino={destino}
                        passageiro={passageiro}
                        distancia={distancia}
                        duracao={duracao}
                        categoria="luxo"
                    />

                    <AbaReceberPagamento
                        open={abaMenu == "pagamento"}
                        confirmarPagamento={() => {
                            operacoes.confirmarPagamento(map)
                            setAbaMenu("principal")
                        }}
                        registrarPendencia={operacoes.registrarPendencia}
                        distancia={distancia}
                        categoria="luxo"
                    />

                </FieldGroup>

            </div>
        </div>
    );
}