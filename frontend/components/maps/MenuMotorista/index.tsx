"use client"

import { FieldGroup } from "@/components/ui/field";

import { use, useEffect, useRef, useState } from "react";
import { useMap } from "@vis.gl/react-google-maps";

import { toast } from "sonner"


import { AbaMenuPassageiro, Categoria, FormaPagamento, Geolocalizacao, Localizacao, Motorista, PagamentoStatus, Passageiro, Sessao, StatusCorrida, StatusMotorista } from "@/types/types";
import { handleUpdateDestino, handleUpdateOrigem } from "@/util/googleApiMethods";
import AbaPrincipal from "../AbasMenuMotorista/AbaPrincipal";
import AbaRecebendoCorrida from "../AbasMenuMotorista/AbaRecebendoCorrida";
import { OperacoesMotorista } from "@/app/motorista/corrida/page";
import AbaCorridaAceita from "../AbasMenuMotorista/AbaCorridaAceita";
import AbaCorridaIniciada from "../AbasMenuMotorista/AbaCorridaIniciada";
import AbaReceberPagamento from "../AbasMenuMotorista/AbaReceberPagamento";
import AvaliacaoEstrelas from "@/components/AvaliacaoEstrelas";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Item, ItemHeader } from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaStar } from "react-icons/fa";

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
    session: Sessao
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
    "pagamento" |
    "finalizada"
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
    session,

}: MenuMotoristaProps) {
    const [abaMenu, setAbaMenu] = useState<AbaMenuMotorista>("principal");
    const [recebendoCorrida, setRecebendoCorrida] = useState(false)

    const [corrida, setCorrida] = useState<{
        localPartida: Geolocalizacao;
        localDestino: Geolocalizacao;
        precoEstimado: number;
        categoria: Categoria;
        status: StatusCorrida;
        motorista: Motorista;
        passageiro: Passageiro;
    } | null>(null);

    const [avaliacao, setAvaliacao] = useState<1 | 2 | 3 | 4 | 5>(5);

    const map = useMap();

    useEffect(() => {
        if (abaMenu != "principal" || !recebendoCorrida) return

        const timeout = setTimeout(() => {
            fetch(`${process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN}/api/motorista/receber-solicitacoes`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "nomeDeUsuario": motorista.nome,
                    "sessaoToken": session.sessaoToken,
                    "email": session.email,
                    "categoria": session.categoria
                })
            })
                .then(async response => {

                    console.log("Resposta ao receber corrida:", await response.text());

                    return;

                    toast.success(await response.json() ? "Nova corrida recebida!" : "Nenhuma nova corrida no momento.")
                    return response.json()
                })
                .then(data => {
                    if (data) {
                        console.log(data)
                        // toast.success("Corrida recebida com sucesso!")
                        // setRecebendoCorrida(false)
                        // setAbaMenu("corrida aceita")
                        // setCorrida({
                        //     localPartida: data.localPartida,
                        //     localDestino: data.localDestino,
                        //     precoEstimado: data.precoEstimado,
                        //     categoria: data.categoria,
                        //     status: "solicitada",
                        //     motorista: motorista,
                        //     passageiro: passageiro,
                        // })
                        // operacoes.aceitarCorrida()

                    } else {
                        toast.error("Erro ao receber corrida: " + data)
                    }
                })
                .catch(error => {

                    console.error("Erro ao receber corrida:", error, "\nStatus: " + error);
                    toast.error("Erro ao receber corrida.")
                });
        }, 3000)

    }, [abaMenu]);

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
                            setAbaMenu("finalizada")
                        }}
                        registrarPendencia={operacoes.registrarPendencia}
                        distancia={distancia}
                        categoria="luxo"
                    />


                    {abaMenu == "finalizada" && <div>
                        <Button
                            className="cursor-pointer"
                            onClick={() => {
                                setAbaMenu("principal")
                            }}
                        >
                            Voltar para o início
                        </Button>

                        <AlertDialog defaultOpen>
                            <AlertDialogContent>
                                <AlertDialogHeader>
                                    <AlertDialogTitle>Avalie o motorista</AlertDialogTitle>
                                    <Item>
                                        <ItemHeader className="flex items-center justify-center">
                                            <Avatar className="w-10 h-10">
                                                <AvatarImage src={motorista.img_url} alt="@laube-developer" />
                                                <AvatarFallback>RL</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="flex flex-row gap-1 items-center font-bold hover:underline cursor-pointer">
                                                    {motorista.nome}
                                                </p>
                                                <div className="flex flex-row text-xs">
                                                    <FaStar /> {motorista.avaliacoes}
                                                </div>
                                            </div>
                                        </ItemHeader>
                                    </Item>

                                    <AlertDialogDescription>
                                        <AvaliacaoEstrelas
                                            state={avaliacao}
                                            setState={setAvaliacao}
                                        />
                                    </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter className="flex flex-row justify-center">
                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                    <AlertDialogAction
                                        onClick={() => {
                                            toast.success("Motorista avaliado com " + avaliacao + " estrelas!")
                                            // if (onAvaliarMotorista) onAvaliarMotorista(seletorEstrela);
                                        }}
                                    >Avaliar Passageiro</AlertDialogAction>
                                </AlertDialogFooter>
                            </AlertDialogContent>
                        </AlertDialog>

                    </div>}


                </FieldGroup>

            </div>
        </div>
    );
}