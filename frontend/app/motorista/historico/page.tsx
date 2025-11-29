"use client"

import HeaderMotorista from "@/components/HeaderMotorista";
import InterfacePrincipal from "@/components/InterfacePrincipal";
import UsuarioInfo from "@/components/maps/components/UsuarioInfo";
import { Badge } from "@/components/ui/badge";
import { calcularPreco } from "@/lib/calcularPreco";
import { Categoria, Localizacao, Motorista, Passageiro, StatusCorrida } from "@/types/types";
import { useState } from "react";

type Corrida = {
    status: StatusCorrida,
    data: Date,
    origem: Localizacao,
    destino: Localizacao
    motorista?: Motorista,
    passageiro?: Passageiro,
    distancia: number,
    categoria: Categoria,
}


const corridas: Corrida[] = [
    {
        status: "finalizada",
        data: new Date("2025-11-29"),
        origem: {
            name: "Atacadista Super Adega",
            lat: -15.873722146581716,
            lng: -48.03119143287951,

        },
        destino: {
            name: "Atacadista Super Adega",
            lat: -15.873722146581716,
            lng: -48.03119143287951,

        },
        distancia: 15.3,
        categoria: "luxo",
        passageiro: {
            nome: "Rafael Laube",
            img_url: "https://github.com/laube-developer.png",
            avaliacoes: 4.9,
            telefone: "(61)982758058"
        }
    },
    {
        status: "finalizada",
        data: new Date("2025-11-29"),
        origem: {
            name: "Atacadista Super Adega",
            lat: -15.873722146581716,
            lng: -48.03119143287951,

        },
        destino: {
            name: "Atacadista Super Adega",
            lat: -15.873722146581716,
            lng: -48.03119143287951,

        },
        distancia: 15.3,
        categoria: "comum",
        passageiro: {
            nome: "Rafael Laube",
            img_url: "https://github.com/laube-developer.png",
            avaliacoes: 4.9,
            telefone: "(61)982758058"
        },
    }
]

const CardCorrida = ({ corrida, passageiro, loading }: { corrida?: Corrida, passageiro?: Passageiro, loading?: boolean }) => {
    

    if (loading) return (
        <div className="flex flex-row gap-2 justify-between border border-slate-200 rounded-lg px-5 h-30 animate-pulse bg-gray-300">

        </div>
    )

    if (!corrida){
        return
    }

    const preco = calcularPreco({
        distancia: corrida.distancia,
        categoria: corrida.categoria,
    })

    return (
        <div className="flex flex-row gap-2 justify-between border border-slate-200 rounded-lg px-5 h-30">
            <div className="w-max overflow-x-hidden py-4 self-center">
                <div className="grid grid-cols-[1rem_auto] gap-2 p-0 self-end">
                    <span className="w-4 h-4 bg-[#fdc426] border-5 border-black self-end  outline-2 outline-white z-4"></span>
                    <p className="font-bold w-full flex overflow-x-scroll truncate">{corrida.origem?.name}</p>
                </div>

                <div className="grid grid-cols-[1rem_auto] gap-2 p-0">
                    <div className="w-full flex items-center justify-center overflow-hidden">
                        <span className="w-[.40rem] h-7 bg-black border-b-2 border-b-black"></span>

                    </div>
                </div>



                <div className="grid grid-cols-[1rem_auto] gap-2 p-0 overflow-x-hidden">
                    <span className="w-4 h-4 bg-[#fdc426] border-5 border-black rounded-full self-start outline-2 outline-white z-4"></span>
                    <p className="font-bold self-start overflow-x-scroll truncate">{corrida.origem?.name}</p>
                </div>
            </div>



            <UsuarioInfo
                usuario={passageiro}
                className="self-center"
            />


            <Badge className="h-max self-center text-md font-bold">R$ {preco}</Badge>

            <span className="self-center">{corrida.data.toLocaleDateString()}</span>
        </div>
    )
}

export default function Historico() {
    const [statusCarregamento, setStatusCarregamento] = useState(false);

    return <div className="w-full h-dvh flex flex-col justify-center ">
        <HeaderMotorista />
        <div className="w-full md:w-[768px] p-4 self-center h-full">
            <h1 className="text-xl font-bold">Histórico de corridas</h1>

            <div className="py-2 w-full flex flex-col gap-4">
                {corridas.length == 0 && Array.from({ length: 5 }, (_, index) => index + 1).map(key => (
                    <CardCorrida
                        key={"card_corrida_" + key}
                        loading
                    />
                ))}
                {corridas.map((corrida, key) => (
                    <CardCorrida
                        corrida={corrida}
                        passageiro={corrida.passageiro}
                        key={"card_corrida_" + key}
                    />
                ))}
            </div>
        </div>
    </div>
}