import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

export default function CancelarCorridaMenu({cancelarCorrida}:{cancelarCorrida: () => void}) {
    return (<AlertDialog>
        <AlertDialogTrigger asChild>
            <Button className="w-full bg-red-500 hover:bg-red-400 cursor-pointer">
                Cancelar Corrida
            </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
            <AlertDialogHeader>
                <AlertDialogTitle>Tem certeza que deseja cancelar a corrida?</AlertDialogTitle>
                <AlertDialogDescription>
                    Esta corrida será cancelada.
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
    </AlertDialog>)
}