"use client"
import Button from "@/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  return (
    <div className="bg-linear-to-br from-[#ffcb2c] to-[#fdc426] text-black h-screen flex items-center">
      <div className="grid place-items-center m-auto gap-8 grid-cols-[auto_auto]">
        <div>
          <h1 className="text-xl font-bold">Sharing Drive</h1>
          <p className="text-lg">Alcance seus destinos com alguns cliques!</p>

          <menu className="flex flex-row gap-2 mt-4">
            <Button onClick={()=>router.push("/passageiro")}>Sou passageiro</Button>
            <Button outline>Sou motorista</Button>
          </menu>
        
        </div>
        
        <Image
          src="/banner_transparent.png"
          alt="Sharing Drive Logo"
          width={200}
          height={200}
        />
      </div>
    </div>
  );
}
