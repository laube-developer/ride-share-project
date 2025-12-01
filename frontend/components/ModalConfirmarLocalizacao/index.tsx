import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

export default function ModalConfirmarLocalizacao({ onConfirm }: { onConfirm: () => void }) {
  const [open, setOpen] = useState(true);

  const handleConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  return (
    <Dialog open={open}>
      <DialogContent className="rounded-2xl shadow-xl p-6 max-w-sm text-center space-y-4">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Permitir Localização</DialogTitle>
          <DialogDescription className="text-base">
            Para mostrar sua distância e posição no mapa, precisamos da sua permissão para acessar a localização do dispositivo.
          </DialogDescription>
        </DialogHeader>

        <Button
          onClick={handleConfirm}
          className="w-full py-3 text-base rounded-xl"
        >
          Permitir Localização
        </Button>

        <p className="text-sm text-muted-foreground">
          Você poderá alterar essa permissão depois nas configurações do seu navegador.
        </p>
      </DialogContent>
    </Dialog>
  );
}
