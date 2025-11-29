"use client"

import { FieldGroup } from "@/components/ui/field";

import { useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { toast } from "sonner"

import AbaCorrida from "../AbasMenuPassageiro/AbaCorrida";
import AbaReceberPagamento from "../AbasMenuPassageiro/AbaPagamento";

import { AbaMenuPassageiro, Categoria, FormaPagamento, Geolocalizacao, Localizacao, Motorista, PagamentoStatus, Passageiro, StatusCorrida, StatusMotorista } from "@/types/types";
import { handleUpdateDestino, handleUpdateOrigem } from "@/util/googleApiMethods";
import AbaPrincipal from "../AbasMenuMotorista/AbaPrincipal";
import AbaRecebendoCorrida from "../AbasMenuMotorista/AbaRecebendoCorrida";
import { OperacoesMotorista } from "@/app/motorista/corrida/page";
import AbaCorridaAceita from "../AbasMenuMotorista/AbaCorridaAceita";
import AbaCorridaIniciada from "../AbasMenuMotorista/AbaCorridaIniciada";

type MenuMotoristaProps = {
    origem: Localizacao;
    destino: Localizacao;
    distancia: number | undefined;
    duracao: number | undefined;
    statusCorridaAtual: StatusCorrida
    statusProximaCorrida: StatusCorrida | null,
    operacoes: Record<OperacoesMotorista, () => void>
    duracaoAtePassageiro: number | undefined;
    distanciaAtePassageiro: number | undefined;
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

}: MenuMotoristaProps) {
    const [abaMenu, setAbaMenu] = useState<AbaMenuMotorista>("principal");
    const [statusMotorista, setStatusMotorista] = useState<StatusMotorista>("online");
    const [recebendoCorrida, setRecebendoCorrida] = useState(true)

    const ficarOnline = () => {
        setStatusMotorista("processando");
        setTimeout(() => (setStatusMotorista("online")), 2000);
    }

    const ficarOffline = () => {
        setStatusMotorista("processando");
        setTimeout(() => (setStatusMotorista("offline")), 2000);
    }

    const map = useMap();

    return (
        <div className="md:p-2 items-center flex justify-start">
            <div className="bg-white bg-opacity-90 rounded-t-2xl md:rounded-2xl shadow-xl p-4 z-20 shadow-xl w-full md:w-96 lg:w-100 xl:w-110 2xl:w-120">
                <FieldGroup className="flex flex-col">
                    <AbaPrincipal
                        open={abaMenu == "principal"}
                        statusMotorista={statusMotorista}
                        ficarOnline={ficarOnline}
                        ficarOffline={ficarOffline}
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
                            operacoes.finalizarCorrida()
                            setAbaMenu("pagamento")
                        }}
                        cancelarCorrida={operacoes.cancelarCorrida}
                        origem={origem}
                        destino={destino}
                        passageiro={passageiro}
                        distancia={distancia}
                        duracao={duracao}
                    />

                </FieldGroup>

            </div>
        </div>
    );
}