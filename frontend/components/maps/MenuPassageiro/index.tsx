"use client"

import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLegend, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
    Item,
    ItemActions,
    ItemContent,
    ItemDescription,
    ItemHeader,
    ItemMedia,
    ItemTitle,
} from "@/components/ui/item"
import { Spinner } from "@/components/ui/spinner"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

import { useEffect, useRef, useState } from "react";
import { AutocompleteInput } from "../AutocompleteInput";
import { useMap } from "@vis.gl/react-google-maps";
import { LuArrowLeft } from "react-icons/lu";
import { FaCarSide, FaCheck } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { toast } from "sonner"
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleDemo } from "@/components/CollapsibleDemo";

import { FaLocationCrosshairs } from "react-icons/fa6";
import { IoIosCall } from "react-icons/io";
import { IoChatbox } from "react-icons/io5";
import { FaStar } from "react-icons/fa";
import { MdOutlineContentCopy, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";

type MenuPassageiroProps = {
    onSelecionarOrigem?: ({ name, lat, lng }: { name?: string; lat: number; lng: number }) => void;
    onSelecionarDestino?: ({ name, lat, lng }: { name?: string; lat: number; lng: number }) => void;
    onBuscarMotorista?: () => void;
    distancia: number | undefined;
    posicao: { lat: number; lng: number } | null;
    getPosicaoAtual: (callback: (pos: { lat: number; lng: number } | null) => void) => void;
};

type FormaPagamento = {
    nome: string;
    tipo: 'pix' | 'credito' | 'debito' | 'dinheiro' | 'saldo em conta';
    descricao: string;
}

export default function MenuPassageiro({ onSelecionarOrigem, onSelecionarDestino, onBuscarMotorista, distancia, posicao, getPosicaoAtual }: MenuPassageiroProps) {
    const [origem, setOrigem] = useState<{ name: string | undefined, lat: number, lng: number } | null>(null);
    const [destino, setDestino] = useState<{ name: string | undefined, lat: number, lng: number } | null>(null);
    const [abaMenu, setAbaMenu] = useState<
        "origem" |
        "destino" |
        "categoria" |
        "buscando motorista" |
        "corrida" |
        "pagamento" |
        "processando pagamento" |
        "pagamento realizado"
    >("corrida");
    const [categoria, setCategoria] = useState<'comum' | 'luxo'>('luxo');

    const inputOrigemRef = useRef<HTMLInputElement | null>(null);
    const inputDestinoRef = useRef<HTMLInputElement | null>(null);
    const [motorista, setMotorista] = useState({
        nome: 'Rafael',
        telefone: "(61)98855-1255",
        avaliacoes: 4.9,
        img_url: 'https://github.com/laube-developer.png'
    })

    const map = useMap();

    const [formasDePagamento, setFormasPagamento] = useState<FormaPagamento[]>([
        {
            nome: "4689",
            tipo: 'credito',
            descricao: 'MasterCard'
        },
        {
            nome: "Saldo em Conta",
            tipo: 'saldo em conta',
            descricao: 'Saldo atual R$ 67,63'
        },

    ]);

    const [formaAtualDePagamento, setFormaPagamento] = useState(0);
    const [statusCorrida, setStatusCorrida] = useState<
        null |
        'solicitada' |
        'aceita' |
        'motorista_chegou' |
        'iniciada' |
        'finalizada' |
        'cancelada'

    >('iniciada')

    useEffect(() => {
        if (statusCorrida == 'solicitada') {
            setTimeout(() => {
                setStatusCorrida('aceita');
                setAbaMenu('corrida')
                if (origem) {
                    panTo({ lat: origem?.lat, lng: origem?.lng })
                }

                setTimeout(() => {
                    setStatusCorrida('motorista_chegou');

                    setTimeout(() => {
                        setStatusCorrida('iniciada');

                        setTimeout(() => {
                            setAbaMenu('pagamento')
                            setStatusCorrida('finalizada');

                            setTimeout(() => {
                                setAbaMenu('processando pagamento')
                                setAbaMenu('pagamento realizado')

                            }, 3000)

                        }, 3000)

                    }, 3000)
                }, 3000)
            }, 3000)
        }
    }, [statusCorrida])

    const panTo = ({ lat, lng }: { lat: number, lng: number }) => {
        if (map) {
            map.panTo({ lat: lat, lng: lng });
            map.setZoom(15);
        }

    }

    const handleUpdateOrigem = ({ name, lat, lng }: { name: string | undefined, lat: number, lng: number }) => {
        setOrigem({
            name: name,
            lat: lat,
            lng: lng,
        });

        if (onSelecionarOrigem) {
            onSelecionarOrigem({
                name: name,
                lat: lat,
                lng: lng,
            });
        }

        panTo({ lat, lng })
    }

    const handleUpdateDestino = ({ name, lat, lng }: { name: string | undefined, lat: number, lng: number }) => {
        setDestino({
            name: name,
            lat: lat,
            lng: lng,
        });

        if (onSelecionarDestino) {
            onSelecionarDestino({
                name: name,
                lat: lat,
                lng: lng,
            });
        }

        panTo({ lat, lng })
        setAbaMenu('categoria')
    }

    const placeSelectedOrigem = (place: google.maps.places.PlaceResult) => {
        const loc = place.geometry?.location;
        if (!loc) return;

        handleUpdateOrigem({
            name: place.name ?? place.name,
            lat: loc.lat(),
            lng: loc.lng(),
        })
    }

    const placeSelectedDestino = (place: google.maps.places.PlaceResult) => {
        const loc = place.geometry?.location;
        if (!loc) return;

        handleUpdateDestino({
            name: place.name ?? place.name,
            lat: loc.lat(),
            lng: loc.lng(),
        })
    }

    return (
        <div className="md:p-2 items-center flex justify-start">
            <div className="bg-white bg-opacity-90 rounded-t-2xl md:rounded-2xl shadow-xl p-4 z-20 shadow-xl w-full md:w-96 lg:w-100 xl:w-110 2xl:w-120">
                <FieldGroup className="flex flex-col">

                    {abaMenu == "origem" && <>
                        <Field>
                            <FieldDescription className="text-black font-bold">Origem da viagem</FieldDescription>
                            <div className="flex flex-row gap-2">

                                <AutocompleteInput
                                    placeholder="Digite a origem"
                                    ref={inputOrigemRef}
                                    onPlaceSelected={placeSelectedOrigem}
                                    className="border px-2 py-2 rounded w-full"
                                />

                                <Button
                                    className="w-max h-full cursor-pointer"
                                    variant={'outline'}
                                    disabled={!posicao}
                                    onClick={() => {
                                        if (!posicao) return
                                        setOrigem({
                                            name: 'Localização atual',
                                            lat: posicao.lat,
                                            lng: posicao.lng
                                        })

                                        if (map) {
                                            map.panTo({ lat: posicao.lat, lng: posicao.lng });
                                            map.setZoom(15);
                                        }

                                        if (onSelecionarOrigem) {
                                            onSelecionarOrigem({
                                                name: 'Localização atual',
                                                lat: posicao.lat,
                                                lng: posicao.lng,
                                            });
                                        }

                                        setAbaMenu('destino')


                                    }}
                                >
                                    {!posicao && <Spinner />}
                                    {posicao && <FaLocationCrosshairs />}

                                </Button>

                            </div>

                        </Field>

                        <Field className="self-end">
                            <Button
                                onClick={() => {
                                    if (origem) {
                                        setAbaMenu("destino");
                                        return;
                                    }

                                    toast.warning('Selecione o ponto de origem!', { position: 'top-right' });
                                    inputOrigemRef.current?.focus();

                                }}
                                className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer">Selecionar</Button>
                        </Field>
                    </>
                    }

                    {abaMenu == "destino" && <>
                        <Field>
                            <FieldDescription className="text-black font-bold">Origem da viagem</FieldDescription>
                            <div className="flex flex-row gap-2">

                                <AutocompleteInput
                                    placeholder="Digite a origem"
                                    ref={inputOrigemRef}
                                    onPlaceSelected={placeSelectedOrigem}
                                    className="border px-2 py-2 rounded w-full"
                                    value={origem?.name}
                                    disabled
                                    disabledOnClick={() => setAbaMenu('origem')}
                                />

                            </div>

                        </Field>

                        <Field className="flex flex-col mb-10 md:mb-0">
                            <FieldDescription className="text-black font-bold">Para onde você quer ir?</FieldDescription>
                            <div className="flex flex-row gap-2 h-full">

                                <AutocompleteInput
                                    placeholder="Digite o destino"
                                    ref={inputDestinoRef}
                                    onPlaceSelected={placeSelectedDestino}
                                    className="border px-2 py-2 rounded w-full"
                                    value={destino?.name}
                                    disabled={!!destino}
                                    disabledOnClick={() => setDestino(null)}
                                />

                                <Button
                                    className="w-max h-[100%] cursor-pointer"
                                    variant={'outline'}
                                    disabled={!posicao}
                                    onClick={() => {
                                        if (!posicao) return

                                        if (
                                            posicao.lat == origem?.lat &&
                                            posicao.lng == origem?.lng
                                        ) {
                                            toast.error('Selecione uma localização diferente da origem.', {
                                                position: 'top-right',
                                                style: {
                                                    color: 'red'
                                                }
                                            })
                                            return;
                                        }

                                        handleUpdateDestino({
                                            name: 'Localização atual',
                                            lat: posicao.lat,
                                            lng: posicao.lng
                                        })
                                    }}
                                >
                                    {!posicao && <Spinner />}
                                    {posicao && <FaLocationCrosshairs />}

                                </Button>
                            </div>
                        </Field>


                    </>}

                    {abaMenu == "categoria" && <>
                        {destino && <div className="flex flex-col gap-2">
                            <Item className={`${categoria == 'comum' && 'ring-2 ring-sky-600'} cursor-pointer`} onClick={() => setCategoria('comum')}>
                                <ItemHeader>
                                    <ItemTitle>Sharing X</ItemTitle>
                                    <ItemDescription>Preços mais baixos</ItemDescription>
                                    <ItemActions><b>R$ {distancia ? (5 + distancia).toFixed(2) : 'Calculando'}</b></ItemActions>
                                </ItemHeader>
                            </Item>

                            <Item className={`${categoria == 'luxo' && 'ring-3 ring-sky-600'} cursor-pointer bg-gradient-to-br from-[#fceabb] via-[#f8d778] to-[#f59e0b]`} onClick={() => setCategoria('luxo')}>
                                <ItemHeader>
                                    <ItemTitle>Sharing Premium</ItemTitle>
                                    <ItemDescription>Mais conforto</ItemDescription>
                                    <ItemActions><b>R$ {distancia ? (5 + (distancia * 2)).toFixed(2) : 'Calculando'}</b></ItemActions>
                                </ItemHeader>
                            </Item>
                        </div>}

                        <Field className="self-end">
                            <Button
                                disabled={!destino}
                                onClick={() => {
                                    if (destino) {
                                        setAbaMenu("buscando motorista");
                                        setStatusCorrida('solicitada')
                                        if (onBuscarMotorista) onBuscarMotorista();

                                        return;
                                    }

                                    toast.warning('Selecione o ponto de destino!', { position: 'top-right' });
                                    inputDestinoRef.current?.focus();

                                }}
                                className="bg-[#fdc426] hover:bg-[<Button variant='outline'>Mais informações</Button>] text-black cursor-pointer">Buscar motorista</Button>
                        </Field>
                    </>}

                    {abaMenu == "buscando motorista" && <>
                        <div className="flex w-full flex-col gap-4 [--radius:1rem]">
                            <div className="flex flex-row gap-4 justify-between">
                                <Field orientation={'horizontal'} className="w-max">
                                    <ItemMedia className="w-max">
                                        <Spinner />
                                    </ItemMedia>
                                    <ItemContent className="w-max">
                                        <ItemTitle className="line-clamp-1">Procurando motorista</ItemTitle>
                                    </ItemContent>
                                </Field>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button className="justify-self-end cursor-pointer"><GoKebabHorizontal /></Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent className="w-56" align="start">
                                        <DropdownMenuLabel>Opções</DropdownMenuLabel>
                                        <DropdownMenuGroup>
                                            <DropdownMenuItem onClick={(e) => e.preventDefault()}>
                                                <AlertDialog>
                                                    <AlertDialogTrigger asChild>
                                                        <Button className="w-full bg-red-500 hover:bg-red-400 cursor-pointer">
                                                            Cancelar Corrida
                                                        </Button>
                                                    </AlertDialogTrigger>
                                                    <AlertDialogContent>
                                                        <AlertDialogHeader>
                                                            <AlertDialogTitle>Tem certeza que deseja cancelar a corrida?</AlertDialogTitle>
                                                            <AlertDialogDescription>
                                                                A solicitação da corrida será cancelada.
                                                                Caso solicite uma nova corrida, o preço pode ser alterado.
                                                            </AlertDialogDescription>
                                                        </AlertDialogHeader>
                                                        <AlertDialogFooter>
                                                            <AlertDialogCancel>Voltar</AlertDialogCancel>
                                                            <AlertDialogAction
                                                                className="bg-red-500 hover:bg-red-400 cursor-pointer"
                                                                onClick={() => {
                                                                    setAbaMenu('destino');
                                                                    toast.error('Corrida cancelada', {
                                                                        position: 'top-right'
                                                                    })
                                                                }}
                                                            >
                                                                Cancelar corrida
                                                            </AlertDialogAction>
                                                        </AlertDialogFooter>
                                                    </AlertDialogContent>
                                                </AlertDialog>
                                            </DropdownMenuItem>
                                        </DropdownMenuGroup>
                                    </DropdownMenuContent>
                                </DropdownMenu>

                            </div>

                            <ItemContent className="w-full gap-0 w-full overflow-x-hidden">
                                <div className="w-full flex animate-ride-car ">
                                    <FaCarSide />
                                </div>
                                <span className="border-b-2 border-black m-0 w-full"></span>
                            </ItemContent>
                        </div>

                    </>}

                    {abaMenu == "corrida" && <>
                        <div className="flex w-full flex-col gap-4 [--radius:1rem]">
                            <div className="flex flex-row gap-4 justify-between h-max">
                                <div className="line-clamp-1 text-md text-slate-500 !h-max w-full">
                                    {statusCorrida == 'aceita' && <>
                                        4 min  2,4 km
                                    </>}

                                    {statusCorrida == 'motorista_chegou' && <>
                                        <span className="bg-blue-600 h-max text-white text-xs py-1 px-2 rounded-full">Motorista chegou ao local</span>
                                    </>}

                                    {statusCorrida == 'iniciada' && <div className="w-full grid grid-cols-[auto_1fr] gap-2">
                                        <span className="bg-green-600 h-max text-white text-xs py-1 px-2 rounded-full">Corrida Iniciada</span>
                                        <Field className="w-full">
                                            <ItemContent className="w-full gap-0 w-full overflow-x-hidden">
                                                <div className="w-full flex animate-ride-car ">
                                                    <FaCarSide />
                                                </div>
                                                <span className="border-b-2 border-black m-0 w-full"></span>
                                            </ItemContent>

                                        </Field>
                                    </div>}
                                </div>

                            </div>


                            <ItemContent className="w-full flex flex-row">

                                <div className="flex flex-col w-full gap-2">
                                    <div className="flex flex-col">
                                        <div
                                            className="text-2xl font-bold"
                                        >FHA-0E19</div>
                                        <p className="font-bold">Chevrolet • Celta 1.0 • Prata</p>
                                        {distancia && <p>Distância total: <Badge>{distancia} km</Badge></p>}

                                    </div>
                                    <div className="flex flex-row">
                                        <div className="flex flex-row items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={motorista.img_url} alt="@laube-developer" />
                                                <AvatarFallback>RL</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <p className="flex flex-row gap-1 items-center font-bold hover:underline cursor-pointer">
                                                    {motorista.nome} <MdOutlineKeyboardArrowRight />
                                                </p>
                                                <div className="flex flex-row text-xs">
                                                    <FaStar /> {motorista.avaliacoes}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex flex-row gap-2">
                                            <Button><IoIosCall /></Button>



                                        </div>
                                    </div>



                                </div>
                                <Image src="/car.svg" alt="Carro chegando" width={100} height={100} className="self-start" />
                            </ItemContent>



                            <CollapsibleDemo
                                aboveContent={(
                                    <div className="flex flex-col gap-10 pt-5">
                                        <div>
                                            <h1><b>Origem</b></h1>
                                            {origem?.name}
                                        </div >
                                        <div>
                                            <h1><b>Destino</b></h1>
                                            {destino?.name}
                                        </div>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button className="w-full bg-red-500 hover:bg-red-400 cursor-pointer">
                                                    Cancelar Corrida
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>Tem certeza que deseja cancelar a corrida?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        A solicitação da corrida será cancelada.
                                                        Caso solicite uma nova corrida, o preço pode ser alterado.
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Voltar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        className="bg-red-500 hover:bg-red-400 cursor-pointer"
                                                        onClick={() => {
                                                            setAbaMenu('destino');
                                                            toast.error('Corrida cancelada', {
                                                                position: 'top-right'
                                                            })
                                                        }}
                                                    >
                                                        Cancelar corrida
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </div>
                                )}
                            >
                                <Button variant='outline'>Mais informações</Button>
                            </CollapsibleDemo>
                        </div>
                    </>}

                    {((abaMenu == "pagamento") || (abaMenu == "processando pagamento")) && <>
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
                                    {formasDePagamento[formaAtualDePagamento].tipo == 'credito' && <>
                                        <span
                                            className="w-8 h-6 rounded-sm bg-black text-xs text-white flex items-center justify-center w-max px-2"
                                        >Crédito</span>
                                    </>
                                    }
                                    <div className="flex flex-row items-center gap-4">
                                        <span>
                                            {formasDePagamento[formaAtualDePagamento].nome}
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

                                {formasDePagamento.map((forma, id) => (
                                    <Card
                                        key={id}
                                        className={`hover:ring-2 hover:ring-slate-500 hover:bg-slate-100 cursor pointer cursor-pointer ${id == formaAtualDePagamento ? 'ring-2 !ring-sky-600' : ''}`}
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

                        <Button
                            className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer"
                            disabled={abaMenu == "processando pagamento"}
                            onClick={() => setAbaMenu("processando pagamento")}
                        >
                            {abaMenu == "pagamento" ? "Realizar Pagamento" : <Spinner />}
                        </Button>
                    </>}

                    {abaMenu == "pagamento realizado" && <>
                        <div className="flex items-center justify-center gap-4">
                            <div>
                                <h1 className="text-xl font-bold">Corrida finalizada</h1>
                                <p>Pagamento Realizado</p>
                            </div>
                            <b className="bg-green-500 text-white p-2 rounded-md"><FaCheck /></b>
                        </div>

                        <Button
                            className="hover:bg-[#ffcb2c] cursor-pointer"
                            onClick={() => setAbaMenu("origem")}
                        >
                            Voltar para o início
                        </Button>
                    </>}
                </FieldGroup>

            </div>
        </div>
    );
}