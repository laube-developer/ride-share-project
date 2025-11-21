"use client"
import Button from "@/components/Button";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { FaGithub } from "react-icons/fa";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex flex-col gap-2 items-center h-screen  bg-linear-to-br from-[#ffcb2c] to-[#fdc426] text-black ">
      <div className="flex items-center h-full">
        <div className="grid place-items-center m-auto gap-8 grid-cols-[auto_auto]">
          <div>
            <h1 className="text-xl font-bold">Sharing Drive</h1>
            <p className="text-lg">Alcance seus destinos com alguns cliques!</p>

            <menu className="flex flex-row gap-3 mt-4">
              <Button href="/passageiro/login">Sou passageiro</Button>
              <Button href="/motorista/login" outline highlighted>Sou motorista</Button>
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

      <footer className="grid grid-cols-[auto_auto] h-max py-4 gap-2">
        <span>
          <p className="bottom-4 text-sm w-full text-center colspan-2">
            &copy; 2025 Sharing Drive. Todos os direitos reservados.
          </p>
          <p className="bottom-4 text-sm w-full text-center">
            Criado por Rafael Laube, Marco Antônio, Áquila e Luis.
          </p>
        </span>
        <span className="flex justify-center">
          <Button
            className="text-sm bg-[#4078c0] items-center flex"
            icon={FaGithub}
            href="https://github.com/laube-developer/ride-share-project"
            >Github</Button>
        </span>
        
      </footer>

    </div>
  );
}
