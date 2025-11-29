import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

function MyBadge({children}: {children: React.ReactNode}) {
  return (
    <div className="border-2 border-slate-200 text-[.5rem] font-semibold px-1 py-0.5 rounded-md top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
      {children}
    </div>
  );
}

export default function HeaderMotorista() {
  const router = useRouter();

  const comandos = {
    irParaCorridas: () => { router.push('/motorista/corrida'); },
    irParaHistórico: () => {router.push('/motorista/historico')},
    irParaDadosPessoais: () => { router.push('/motorista/dados-pessoais'); },
    irParaSaldo: () => { router.push('/motorista/meios-de-pagamento'); },
    irParaAlterarSenha: () => { router.push('/motorista/alterar-senha'); },
    irParaMinhasAvaliacoes: () => { router.push('/motorista/alterar-senha'); },
    
    sair: () => { 
      // Implementar lógica de logout aqui (ex: limpar tokens, chamar API de logout, etc.)
      router.push('/'); 
    }
  }

  useEffect(() => {
    if (!window) return;

    window.onkeydown = function (e) {
      if (e.ctrlKey && e.key === 'H') {
        comandos.irParaCorridas();
      };
      if (e.ctrlKey && e.key === 'P') {
        comandos.irParaDadosPessoais();
      };
      if (e.ctrlKey && e.key === 'M') {
        comandos.irParaSaldo();
      };
      if (e.ctrlKey && e.key === 'S') {
        comandos.irParaAlterarSenha();
      };
      if (e.ctrlKey && e.key === 'E') {
        comandos.irParaMinhasAvaliacoes();
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
        <DropdownMenuContent className="w-64" align="start">
          <DropdownMenuLabel className="font-bold">Corridas</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={comandos.irParaCorridas}>
              Corrida
              <DropdownMenuShortcut>⌘⇧H</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={comandos.irParaHistórico}>
              Histórico
              <DropdownMenuShortcut>⌘⇧H</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuLabel  className="font-bold">Conta</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem onClick={comandos.irParaDadosPessoais}>
              Dados pessoais
              <DropdownMenuShortcut>CTRL ⇧ P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={comandos.irParaSaldo}>
              Saldo
              <DropdownMenuShortcut>CTRL ⇧ M</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={comandos.irParaAlterarSenha}>
              Alterar senha
              <DropdownMenuShortcut>CTRL ⇧ S</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={comandos.irParaMinhasAvaliacoes}>
              Minhas Avaliações
              <DropdownMenuShortcut>CTRL ⇧ E</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={comandos.sair}>
            Log out
            <DropdownMenuShortcut>CTRL ⇧ Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  );
}