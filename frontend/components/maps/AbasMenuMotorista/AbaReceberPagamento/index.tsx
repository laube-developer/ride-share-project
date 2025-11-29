import { Button } from "@/components/ui/button";
import { Categoria } from "@/types/types";
import { calcularPreco } from "@/lib/calcularPreco";
import { Badge } from "@/components/ui/badge";
import { CollapsibleDemo } from "@/components/CollapsibleDemo";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

type AbaReceberPagamentoProps = {
    open?: boolean;
    distancia: number | undefined;
    categoria: Categoria;
    confirmarPagamento: () => void;
    registrarPendencia: (x: number) => void
}

export default function AbaReceberPagamento({
    open,
    distancia,
    categoria,
    confirmarPagamento,
    registrarPendencia
}: AbaReceberPagamentoProps) {
    if (!open) return <></>

    const precoTotal = calcularPreco({ distancia: distancia, categoria: categoria })

    return <div className="flex flex-col gap-2">

        <h1 className="text-xl">Receba o pagamento</h1>

        <div className="w-full flex justify-center text-4xl font-bold py-6">
            <h2>R$ {precoTotal.toFixed(2)}</h2>
        </div>


        <AlertDialog>
            <AlertDialogTitle hidden>Mais opções</AlertDialogTitle>
            <AlertDialogTrigger asChild>
                <Button variant={"outline"} className="w-full">Mais opções</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <>
                    <h3>Opções</h3>
                    <Button onClick={() => registrarPendencia(precoTotal)} className="w-full">Passageiro não pagou</Button>
                </>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
            </AlertDialogContent>
            <AlertDialogFooter>
            </AlertDialogFooter>
        </AlertDialog>
       


        <Button onClick={confirmarPagamento}>Confirmar pagamento</Button>
    </div>
}