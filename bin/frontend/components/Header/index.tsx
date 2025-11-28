import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Header() {
  const router = useRouter();

  useEffect(() => {
    if (!window) return;

    window.onkeydown = function (e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'V') {
        router.push('/passageiro/minhas-viagens');
      };
      if (e.shiftKey && e.key === 'P') {
        router.push('/motorista/dados-pessoais');
      };
      if (e.shiftKey && e.key === 'P') {
        router.push('/motorista/dados-pessoais');
      };
    }
  }, []);

  return (
    <header className="w-full bg-white shadow-md p-4 flex items-center justify-start">
      <Link href={'/'} className="flex flex-row items-center">
        <>
          <Image src={'/icon.png'} alt="Sharing Drive Icon" width={50} height={50}/>
          <h1 className="ml-4 text-2xl font-bold text-gray-800 hover:underline decoration-[#fdc426] cursor-pointer">
          Sharing Drive
          </h1>

        </>
      </Link>

       <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div className="rounded-full overflow-hidden hover:ring-2 hover:ring-blue-500 hover:cursor-pointer ml-auto w-10 h-10">
            <Avatar className="w-10 h-10 rounded-full ">
              <AvatarImage src="https://github.com/shadcn.png" alt="@shadcn" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Viagem</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => {router.push('/passageiro/minhas-viagens')}}>
              Minhas viagens
              <DropdownMenuShortcut>⇧⌘V</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuLabel>Conta</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={() => {alert('Abrir dados pessoais.')}}>
              Dados pessoais
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Meios de Pagamento
              <DropdownMenuShortcut>⌘M</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Alterar senha
              <DropdownMenuShortcut>⇧⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Minhas Avaliações
              <DropdownMenuShortcut>⌘A</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}