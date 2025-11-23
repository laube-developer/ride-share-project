import { Button } from "@/components/ui/button";
import { Field, FieldContent, FieldDescription, FieldGroup, FieldLegend, FieldTitle } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

import {
  Item,
  ItemContent,
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
import { FaCarSide } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

import { toast } from "sonner"
import Image from "next/image";
import { Avatar } from "@/components/ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import { MdOutlineContentCopy, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { FaStar } from "react-icons/fa";
import { IoChatbox } from "react-icons/io5";
import { IoIosCall } from "react-icons/io";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CollapsibleDemo } from "@/components/CollapsibleDemo";

type MenuPassageiroProps = {
    onSelecionarOrigem?: ({name, lat, lng}: {name?: string; lat: number; lng: number}) => void;
    onSelecionarDestino?: ({name, lat, lng}: {name?: string; lat: number; lng: number}) => void;
    onBuscarMotorista?: () => void;
    distancia: number | undefined
};

type FormaPagamento = {
    nome: string;
    tipo: 'pix' | 'credito' | 'debito' | 'dinheiro' | 'saldo em conta';
    descricao: string;
}

export default function MenuPassageiro({onSelecionarOrigem, onSelecionarDestino, onBuscarMotorista, distancia}: MenuPassageiroProps) {
  const [origem, setOrigem] = useState<{name: string | undefined,lat: number, lng: number} | null>(null);
  const [destino, setDestino] = useState<any>(null);
  const [abaMenu, setAbaMenu] = useState<"origem" | "destino" | "buscando motorista" | "motorista a caminho">("origem");

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
        nome: "Cartão de Crédito",
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
  const [statusCorrida, setStatusCorrida] = useState<null | 'solicitada' | 'aceita' | 'motorista_chegou' | 'iniciada' | 'finalizada' | 'cancelada'>(null)

  useEffect(() => {
    if (statusCorrida == 'solicitada'){
        setTimeout(() => {
            setStatusCorrida('aceita');
            setAbaMenu('motorista a caminho')


            setTimeout(() => {
                setStatusCorrida('motorista_chegou');
            }, 3000)
        }, 3000)
    }
  }, [statusCorrida])

  return (
    <div className="items-center flex justify-center">
        <div className="bg-white bg-opacity-90 rounded-md shadow-xl p-4 z-20 w-[calc(100%-2rem)] md:w-96 lg:w-110 xl:w-120 2xl:w-140">
            <FieldGroup className="flex sm:flex-row flex-col">

                {abaMenu == "origem" && <>
                    <Field>
                        <FieldDescription className="text-black font-bold">Origem da viagem</FieldDescription>
                        <AutocompleteInput
                            placeholder="Digite a origem"
                            ref={inputOrigemRef}
                            onPlaceSelected={(place) => {
                                const loc = place.geometry?.location;
                                    if (!loc) return;

                                    setOrigem({
                                        name: place.formatted_address ?? place.name,
                                        lat: loc.lat(),
                                        lng: loc.lng(),
                                    });

                                    if (map){
                                        map.panTo({ lat: loc.lat(), lng: loc.lng() });
                                        map.setZoom(15);
                                    }

                                    if (onSelecionarOrigem){
                                        onSelecionarOrigem({
                                            name: place.formatted_address ?? place.name,
                                            lat: loc.lat(),
                                            lng: loc.lng(),
                                        });
                                    }
                                    
                            }}
                            className="border px-2 py-2 rounded w-full"
                        />
                            
                    </Field>

                    <Field className="self-end">
                        <Button
                            onClick={() => {
                                if (origem){
                                    setAbaMenu("destino");
                                    return;
                                }
                                
                                toast.warning('Selecione o ponto de origem!', {position: 'top-right'});
                                inputOrigemRef.current?.focus();

                            }}
                            className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer">Selecionar</Button>
                    </Field>
                </>}
                
                {abaMenu == "destino" && <>
                    <Field className="flex flex-col">
                        <Button className="cursor-pointer !w-max" onClick={() => setAbaMenu("origem")}>
                            <LuArrowLeft/>
                            <p>Voltar</p>
                        </Button>
                        <FieldDescription className="text-black font-bold">Para onde você quer ir?</FieldDescription>
                        <AutocompleteInput
                            placeholder="Digite o destino"
                            ref={inputDestinoRef}
                            onPlaceSelected={(place) => {
                                const loc = place.geometry?.location;
                                    if (!loc) return;

                                    setDestino({
                                        name: place.formatted_address ?? place.name,
                                        lat: loc.lat(),
                                        lng: loc.lng(),
                                    });

                                    if (map){
                                        map.panTo({ lat: loc.lat(), lng: loc.lng() });
                                        map.setZoom(15);
                                    }

                                    if (onSelecionarDestino){
                                        onSelecionarDestino({
                                            name: place.formatted_address ?? place.name,
                                            lat: loc.lat(),
                                            lng: loc.lng(),
                                        });
                                    }


                            }}
                            className="border px-2 py-2 rounded w-full"
                        />
                    </Field>

                    <div>
                        {distancia}
                    </div>

                    <Field className="self-end">
                        <Button
                            onClick={() => {
                                if (destino){
                                    setAbaMenu("buscando motorista");
                                    setStatusCorrida('solicitada')
                                    if (onBuscarMotorista) onBuscarMotorista();
                                    
                                    return;
                                }

                                toast.warning('Selecione o ponto de destino!', {position: 'top-right'});
                                inputDestinoRef.current?.focus();
                                
                            }}
                            className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer">Buscar motorista</Button>
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
                                    <Button className="justify-self-end cursor-pointer"><GoKebabHorizontal/></Button>
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

                {abaMenu == "motorista a caminho" && <>
                    <div className="flex w-full flex-col gap-4 [--radius:1rem]">
                        <div className="flex flex-row gap-4 justify-between">
                            <Field orientation={'horizontal'} className="w-max">
                                
                                <ItemContent className="w-max">
                                    <ItemTitle className="line-clamp-1 text-md text-slate-500 !h-max">
                                        {statusCorrida == 'aceita' && <>
                                            4 min  2,4 km
                                        </>}

                                        {statusCorrida == 'motorista_chegou' && <>
                                            <Badge className="bg-blue-600 h-max">Motorista chegou ao local</Badge>
                                        </>}
                                    </ItemTitle>
                                </ItemContent>
                            </Field>
                            
                        </div>

                        <ItemContent className="w-full flex flex-row">
                            
                            <div className="flex flex-col w-full gap-2">
                                <div className="flex flex-col">
                                    <div
                                        className="text-2xl font-bold"
                                    >FHA-0E19</div>
                                    <p className="font-bold">Chevrolet • Onix 1.4 • Prata</p>
                                    {distancia && <p>Distância total: <Badge>{Number(distancia/1000).toFixed(2)} km</Badge></p>}
                                    
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
                                                <FaStar/> {motorista.avaliacoes}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex flex-row gap-2">
                                        <Button><IoIosCall/></Button>
                                        
                                        
                                        
                                    </div>
                                </div>

                                

                            </div>
                            <Image src="/car.svg" alt="Carro chegando" width={100} height={100} className="self-start"/>
                        </ItemContent>

                        <AlertDialog>
                            <AlertDialogTrigger asChild>
                                <Card  className="hover:bg-slate-100 cursor-pointer">
                                    <CardContent>
                                        <div className="flex flex-start gap-3">
                                            Pagamento: <Badge>{formasDePagamento[formaAtualDePagamento].nome}</Badge>
                                        </div>
                                    </CardContent>
                                </Card>
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

                        <CollapsibleDemo
                            aboveContent={(
                                <div  className="flex flex-col gap-10 pt-5">
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
                
            </FieldGroup>

        </div>
    </div>
  );
}