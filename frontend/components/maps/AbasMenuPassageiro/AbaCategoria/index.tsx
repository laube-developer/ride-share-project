import { Field } from "@/components/ui/field";
import { ItemActions, ItemDescription, ItemHeader, ItemTitle, Item } from "@/components/ui/item";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { AbaMenuPassageiro, Categoria, StatusCorrida } from "@/types/types";
import { Button } from "@/components/ui/button";

type AbaCategoriaProps = {
    open: boolean,
    abaMenu: AbaMenuPassageiro,
    setAbaMenu: Dispatch<SetStateAction<AbaMenuPassageiro>>,
    origem: { name: string | undefined, lat: number, lng: number } | null,
    destino: { name: string | undefined, lat: number, lng: number } | null,
    categoria: Categoria,
    distancia: number | undefined,
    setCategoria: Dispatch<SetStateAction<Categoria>>
    setStatusCorrida: Dispatch<SetStateAction<StatusCorrida>>
    onBuscarMotorista?: (() => void) | undefined
}

export default function AbaCategoria({
    open,
    setAbaMenu,
    setCategoria,
    setStatusCorrida,
    onBuscarMotorista,
    abaMenu,
    destino,
    categoria,
    distancia,
}: AbaCategoriaProps) {
    if (!open) return <></>

    return <>
        <h1 className="text-lg font-bold">Selecione a Categoria</h1>
        <div className="flex flex-col gap-4">
            <Item className={`${categoria == 'comum' && 'ring-3 ring-yellow-500 ring-offset-4 ring-offset-white'} cursor-pointer bg-slate-50`} onClick={() => setCategoria('comum')}>
                <ItemHeader>
                    <ItemTitle>Sharing X</ItemTitle>
                    <ItemDescription>Preços mais baixos</ItemDescription>
                    <ItemActions><b>R$ {distancia ? (5 + distancia).toFixed(2) : 'Calculando'}</b></ItemActions>
                </ItemHeader>
            </Item>

            <Item
                className={`${categoria == 'luxo' && 'ring-3 ring-yellow-500 ring-offset-4 ring-offset-white'} cursor-pointer bg-gradient-to-br from-[#8A2BE2] via-[#4682B4] to-[#1E90FF]`}
                onClick={() => setCategoria('luxo')}
            >
                <ItemHeader className="text-white">
                    <ItemTitle>Sharing Premium</ItemTitle>
                    <ItemDescription className="text-white">Mais conforto</ItemDescription>
                    <ItemActions><b>R$ {distancia ? (5 + (distancia * 2)).toFixed(2) : 'Calculando'}</b></ItemActions>
                </ItemHeader>
            </Item>
        </div>

        <Field className="self-end">
            <Button
                onClick={() => {
                    setAbaMenu("buscando motorista");
                    setStatusCorrida('solicitada')
                    if (onBuscarMotorista) onBuscarMotorista();

                }}
                className="bg-[#fdc426] hover:bg-[<Button variant='outline'>Mais informações</Button>] text-black cursor-pointer">Buscar motorista</Button>
        </Field>
    </>
}