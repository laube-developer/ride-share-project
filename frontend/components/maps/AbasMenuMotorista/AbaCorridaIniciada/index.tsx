import { OperacoesMotorista } from "@/app/motorista/corrida/page";
import { Button } from "@/components/ui/button";
import { AbaMenuMotorista } from "../../MenuMotorista";
import { Categoria, Localizacao, Passageiro } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import CancelarCorridaMenu from "../../CancelarCorridaMenu";
import { CollapsibleDemo } from "@/components/CollapsibleDemo";
import UsuarioInfo from "../../components/UsuarioInfo";
import { formatarSegundos } from "@/lib/formatTime";
import { calcularPreco } from "@/lib/calcularPreco";

type AbaCorridaIniciadaProps = {
    open?: boolean;
    origem: Localizacao;
    destino: Localizacao;
    passageiro: Passageiro;
    distancia: number | undefined;
    duracao: number | undefined;
    categoria: Categoria;
    finalizarCorrida: () => void;
    cancelarCorrida: () => void
    registrarPendencia: (x:number) => void
    confirmarPagamento: () => void
}

export default function AbaCorridaIniciada({
    origem,
    destino,
    distancia,
    passageiro,
    open,
    duracao,
    categoria,
    cancelarCorrida,
    finalizarCorrida,
    registrarPendencia,
    confirmarPagamento
}: AbaCorridaIniciadaProps) {
    if (!open) return <></>

    const tempo = formatarSegundos(duracao ?? 60)
    const tempoAtePassageiroFormatado = tempo.value+" "+tempo.text

    return <div className="flex flex-col gap-2">

        <h1 className="text-xl font-bold">Total:</h1>

        {/* Informações da corrida */}

        <UsuarioInfo
            usuario={passageiro}
            badge={distancia + " km - "+tempoAtePassageiroFormatado}
            badgeSize="lg"
        />

        <div className="w-full overflow-x-hidden py-4">
            <div className="grid grid-cols-[1rem_auto] gap-2 p-0 self-end">
                <span className="w-4 h-4 bg-[#fdc426] border-5 border-black self-end  outline-2 outline-white z-4"></span>
                <p className="font-bold w-full flex overflow-x-scroll truncate">{destino?.name}</p>
            </div>

            <div className="grid grid-cols-[1rem_auto] gap-2 p-0">
                <div className="w-full flex items-center justify-center overflow-hidden">
                    <span className={`w-[.40rem] h-7 bg-[#fdc426] animate-line-trail`}></span>

                </div>
            </div>


            <div className="grid grid-cols-[1rem_auto] gap-2 p-0 overflow-x-hidden">
                <span className="w-4 h-4 bg-[#fdc426] border-5 border-black rounded-full self-start outline-2 outline-white z-4"></span>
                <p className="font-bold self-start overflow-x-scroll truncate">{origem?.name}</p>
            </div>
        </div>

        <CollapsibleDemo
            aboveContent={(
                <div className="py-5">
                    <CancelarCorridaMenu
                        cancelarCorrida={cancelarCorrida}
                    />
                </div>
            )}
        >
            <Button variant='outline' className="w-full">Mais opções</Button>
        </CollapsibleDemo>

        <Button onClick={()=>registrarPendencia(calcularPreco(distancia, categoria))}>Passageiro não pagou</Button>
        <Button onClick={confirmarPagamento}>Confirmar Pagamento</Button>
    </div>
}