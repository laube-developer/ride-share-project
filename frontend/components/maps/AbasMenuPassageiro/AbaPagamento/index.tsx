import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Categoria, FormaPagamento, Motorista, PagamentoStatus, StatusCorrida } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import { Dispatch, SetStateAction, useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Item, ItemHeader } from "@/components/ui/item";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { FaCheck, FaStar } from "react-icons/fa";
import AvaliacaoEstrelas from "@/components/AvaliacaoEstrelas";

type AbaPagamentoProps = {
    open: boolean
    statusCorrida: StatusCorrida,
    formasPagamento: FormaPagamento[],
    distancia?: number,
    categoria: Categoria,
    indiceFormaPagamento: number,
    setFormaPagamento: Dispatch<SetStateAction<number>>
    statusPagamento: PagamentoStatus,
    realizarPagamento: () => void,
    voltarParaInicio: () => void,
    motorista: Motorista,
    onAvaliarMotorista?: (valor: 1 | 2 | 3 | 4 | 5) => void
}

export default function AbaPagamento({
    open,
    statusCorrida,
    formasPagamento,
    indiceFormaPagamento,
    setFormaPagamento,
    distancia,
    categoria,
    realizarPagamento,
    statusPagamento,
    voltarParaInicio,
    motorista,
    onAvaliarMotorista
}: AbaPagamentoProps) {
    if (!open) return <></>

    const [seletorEstrela, setSeletorEstrela] = useState<1 | 2 | 3 | 4 | 5>(5)

    if (statusPagamento != "pago") return <>
        <div className="grid grid-cols-[auto_6rem]">
            <div>
                <h1 className="text-xl font-bold">Corrida finalizada</h1>
                <p>Realize o pagamento</p>
            </div>
            <b className="text-right text-xl">R$ {distancia ? 5 + distancia * (categoria == "comum" ? 1 : 2) : 5}</b>
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
                {/* <Card className="hover:bg-slate-100 cursor-pointer">
                                    <CardContent>
                                        
                                    </CardContent>
                                </Card> */}
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

                {statusPagamento}

        <Button
            className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer"
            disabled={statusPagamento == "processando"}
            onClick={realizarPagamento}
        >
            {statusPagamento == "processando" ? <Spinner /> : "Realizar Pagamento"}

        </Button>
    </>

    if (statusPagamento == "pago") return <>

        <div className="flex items-center justify-center gap-4">
            <div>
                <h1 className="text-xl font-bold">Corrida finalizada</h1>
                <p>Pagamento Realizado</p>
            </div>
            <b className="bg-green-500 text-white p-2 rounded-md"><FaCheck /></b>
        </div>



        <Button
            className="cursor-pointer"
            onClick={voltarParaInicio}
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
                            state={seletorEstrela}
                            setState={setSeletorEstrela}
                        />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row justify-center">
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={() => {
                            if (onAvaliarMotorista) onAvaliarMotorista(seletorEstrela);
                        }}
                    >Avaliar Motorista</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
}