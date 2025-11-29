import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Field } from "@/components/ui/field";
import { ItemContent, ItemMedia } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import Image from "next/image";
import { FaCarSide } from "react-icons/fa";
import { GoKebabHorizontal } from "react-icons/go";
import { toast } from "sonner";
import { AbaMenuPassageiro } from "@/types/types";

type AbaBuscaMotoristaProps = {
    open: boolean,
    cancelarCorrida: () => void
}

export default function AbaBuscaMotorista({
    open,
    cancelarCorrida,
}: AbaBuscaMotoristaProps) {
    if (!open) return <></>

    return <>
        <div className="flex w-full flex-col gap-4 [--radius:1rem]">
            <div className="flex flex-row gap-4 justify-between">
                <span className="bg-slate-600 flex flex-row gap-2 text-nowrap items-center text-white text-xs py-1 px-2 rounded-full">
                    <ItemMedia>
                        <Spinner />
                    </ItemMedia>
                    <b>Buscando motorista</b>
                </span>
                <Field className="w-full">
                    <ItemContent className="w-full gap-0 w-full">
                        <div className="w-full flex animate-ride-car ">
                            <FaCarSide />
                        </div>
                        <span className="border-b-2 border-black m-0 w-full"></span>
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
                                                onClick={cancelarCorrida}
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

            <div className="w-full h-max flex justify-center">
                <Image
                    src={'/location.svg'}
                    width={100}
                    height={100}
                    alt="Location cellphone and a user."
                />
            </div>
        </div>

    </>
}