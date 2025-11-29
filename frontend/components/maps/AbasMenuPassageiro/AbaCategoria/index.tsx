import { Field } from "@/components/ui/field";
import { ItemActions, ItemDescription, ItemHeader, ItemTitle, Item } from "@/components/ui/item";
import { Dispatch, SetStateAction } from "react";
import { toast } from "sonner";
import { AbaMenuPassageiro, Categoria, FormaPagamento, StatusCorrida } from "@/types/types";
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

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
    onBuscarMotorista?: (() => void) | undefined;
    formasPagamento: FormaPagamento[],
    setFormaPagamento: (id: number) => void,
    indiceFormaPagamento: number,
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
    formasPagamento,
    setFormaPagamento,
    indiceFormaPagamento,
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

        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className="flex flex-start gap-3 justify-between items-center cursor-pointer bg-slate-100 h-15 p-2">
                    {formasPagamento[indiceFormaPagamento].tipo == 'credito' && <>
                        <span
                            className="w-8 h-6 rounded-sm bg-black text-xs text-white flex items-center justify-center w-max px-2"
                        >Crédito</span>
                    </>
                    }
                    <div className="flex flex-row items-center gap-4">
                        <span>
                            {formasPagamento[indiceFormaPagamento].nome}
                        </span>
                        <MdOutlineKeyboardArrowRight />
                    </div>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Selecione uma forma de pagamento:</AlertDialogTitle>
                </AlertDialogHeader>

                {formasPagamento.map((forma, id) => (
                    <Card
                        key={id}
                        className={`hover:ring-2 hover:ring-slate-500 hover:bg-slate-100 cursor pointer cursor-pointer ${id == indiceFormaPagamento ? 'ring-2 !ring-sky-600' : ''}`}
                        onClick={() => setFormaPagamento(id)}
                    >
                        <CardHeader>
                            <CardTitle><Badge>{forma.nome}</Badge></CardTitle>
                            <CardDescription>{forma.descricao}</CardDescription>
                            <CardAction>
                                {forma.tipo == 'credito' && <Image
                                    alt="Cartão"
                                    width={60}
                                    height={60}
                                    src={'/card.svg'}
                                />}
                            </CardAction>
                        </CardHeader>
                    </Card>
                ))}


                <AlertDialogFooter>
                    <AlertDialogCancel className="cursor-pointer">Cancel</AlertDialogCancel>
                    <AlertDialogAction className="cursor-pointer">Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>

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