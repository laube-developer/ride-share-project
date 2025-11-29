import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Avatar, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { DialogHeader } from "@/components/ui/dialog";
import { Item, ItemHeader } from "@/components/ui/item";
import { Categoria, Localizacao, Passageiro } from "@/types/types";
import { AlertDialog } from "@radix-ui/react-alert-dialog";
import { useEffect } from "react";
import { FaStar } from "react-icons/fa";
import { IoLocateSharp } from "react-icons/io5";
import { IoLocation } from "react-icons/io5";
import UsuarioInfo from "../../components/UsuarioInfo";
import { calcularPreco } from "@/lib/calcularPreco";

type AbaRecebendoCorridaProps = {
    open?: boolean;
    passageiro: Passageiro;
    origem: Localizacao;
    destino: Localizacao;
    aceitarCorrida: () => void
    declinarCorrida?: () => void,
    distancia: number | undefined,
    categoria?: Categoria

}

export default function AbaRecebendoCorrida({
    open,
    passageiro,
    aceitarCorrida,
    declinarCorrida,
    origem,
    destino,
    distancia,
    categoria,
}: AbaRecebendoCorridaProps) {
    if (!open) return <></>

    useEffect(() => {
        //calcular preço da corrida

    }, [])

    return <>
        <AlertDialog defaultOpen>

            <AlertDialogContent>
                <DialogHeader>
                    <AlertDialogTitle>Nova solicitação de corrida.</AlertDialogTitle>

                </DialogHeader>

                <UsuarioInfo
                    usuario={passageiro}
                    badge={`R$ ${distancia ? calcularPreco({distancia: distancia, categoria: categoria}).toFixed(2) : 'Calculando'}`}
                    badgeSize="xl"
                />

                <div className="w-full overflow-x-hidden py-4">
                    <div className="grid grid-cols-[1rem_auto] gap-2 p-0 self-end">
                        <span className="w-4 h-4 bg-[#fdc426] border-5 border-black self-end  outline-2 outline-white z-4"></span>
                        <p className="font-bold w-full flex overflow-x-scroll truncate">{destino?.name}</p>
                    </div>

                    <div className="grid grid-cols-[1rem_auto] gap-2 p-0">
                        <div className="w-full flex items-center justify-center overflow-hidden">
                            <span className="w-[.40rem] h-7 bg-black border-b-2 border-b-black animate-line-trail"></span>

                        </div>
                    </div>


                    <div className="grid grid-cols-[1rem_auto] gap-2 p-0 overflow-x-hidden">
                        <span className="w-4 h-4 bg-[#fdc426] border-5 border-black rounded-full self-start outline-2 outline-white z-4"></span>
                        <p className="font-bold self-start overflow-x-scroll truncate">{origem?.name}</p>
                    </div>
                </div>



                <AlertDialogFooter className="grid grid-rows-2 sm:grid-rows-1 sm:grid-cols-2">
                    <AlertDialogCancel onClick={declinarCorrida} className="cursor-pointer">Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={aceitarCorrida} className="cursor-pointer">Aceitar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    </>
}