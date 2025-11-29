import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Field } from "@/components/ui/field";
import { ItemContent } from "@/components/ui/item";
import { FaCarSide, FaStar } from "react-icons/fa";
import { IoIosCall } from "react-icons/io";
import { Geolocalizacao, Localizacao, Motorista, StatusCorrida } from "@/types/types";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { CollapsibleDemo } from "@/components/CollapsibleDemo";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import CancelarCorridaMenu from "../../CancelarCorridaMenu";

type AbaCorridaProps = {
    open: boolean,
    statusCorrida: StatusCorrida,
    motorista: Motorista
    distancia: number | undefined,
    origem: Localizacao
    destino: Localizacao,
    cancelarCorrida: () => void
}

export default function AbaCorrida({
    open,
    statusCorrida,
    motorista,
    distancia,
    origem,
    destino,
    cancelarCorrida
}: AbaCorridaProps) {
    if (!open) return <></>

    return <>
        <div className="flex w-full flex-col gap-4 [--radius:1rem]">
            <div className="flex flex-row gap-4 justify-between pb-2">
                <div className="text-md text-slate-500 !h-max w-full">
                    {statusCorrida == 'aceita' && <div className="w-full grid grid-cols-[auto_1fr] gap-2">
                        <span className="bg-slate-600 h-max text-white text-xs py-1 px-2 rounded-full">motorista a <b>4 min  2,4 km</b></span>
                        <Field className="w-full">
                            <ItemContent className="w-full gap-0 w-full">
                                <div className="w-full flex animate-ride-car ">
                                    <FaCarSide />
                                </div>
                                <span className="border-b-2 border-black m-0 w-full"></span>
                            </ItemContent>

                        </Field>
                    </div>}

                    {statusCorrida == 'motorista_chegou' && <>
                        <span className="bg-blue-600 h-max text-white text-xs py-1 px-2 rounded-full font-bold">Motorista chegou ao local</span>
                    </>}

                    {statusCorrida == 'iniciada' && <div className="w-full grid grid-cols-[auto_1fr] gap-2">
                        <span className="bg-green-600 h-max text-white text-xs py-1 px-2 rounded-full">Corrida Iniciada</span>
                        <Field className="w-full">
                            <ItemContent className="w-full gap-0 w-full">
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

                        <CancelarCorridaMenu
                            cancelarCorrida={cancelarCorrida}
                        />
                        
                    </div>
                )}
            >
                <Button variant='outline'>Mais informações</Button>
            </CollapsibleDemo>
        </div>
    </>
}