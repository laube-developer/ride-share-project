import { OperacoesMotorista } from "@/app/motorista/corrida/page";
import { Button } from "@/components/ui/button";
import { AbaMenuMotorista } from "../../MenuMotorista";
import { Localizacao, Passageiro } from "@/types/types";
import { Badge } from "@/components/ui/badge";
import CancelarCorridaMenu from "../../CancelarCorridaMenu";
import { CollapsibleDemo } from "@/components/CollapsibleDemo";
import UsuarioInfo from "../../components/UsuarioInfo";
import { formatarSegundos } from "@/lib/formatTime";

type AbaCorridaAceitaProps = {
    open?: boolean;
    abaMenu: AbaMenuMotorista;
    origem: Localizacao;
    destino: Localizacao;
    passageiro: Passageiro;
    distanciaAtePassageiro: number | undefined;
    duracaoAtePassageiro: number | undefined;
    seguirAtePassageiro: () => void;
    iniciarCorrida: () => void;
    cancelarCorrida: () => void
}

export default function AbaCorridaAceita({
    abaMenu,
    origem,
    destino,
    iniciarCorrida,
    seguirAtePassageiro,
    cancelarCorrida,
    passageiro,
    open,
    distanciaAtePassageiro,
    duracaoAtePassageiro
}: AbaCorridaAceitaProps) {
    if (!open) return <></>

    const tempo = formatarSegundos(duracaoAtePassageiro ?? 60)
    const tempoAtePassageiroFormatado = tempo.value+" "+tempo.text

    return <div className="flex flex-col gap-2">
        <Badge
            className="font-bold bg-[#fdc426] text-black"
        >{abaMenu == "corrida aceita" ? "Corrida Aceita" : "Encontre o passageiro"}</Badge>

        <h1 className="text-xl font-bold">{
            abaMenu == "corrida aceita" ?
                "Siga até o passageiro" :
                "Encontre o passageiro e inicie a corrida"
        }</h1>

        {/* Informações da corrida */}

        <UsuarioInfo
            usuario={passageiro}
            badge={distanciaAtePassageiro + " km - "+tempoAtePassageiroFormatado}
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

        <Button onClick={seguirAtePassageiro} hidden={abaMenu != "corrida aceita"}>Mostrar rota até o passageiro</Button>
        <Button onClick={iniciarCorrida} hidden={abaMenu != "deslocando ao passageiro"}>Iniciar Corrida</Button>
    </div>
}