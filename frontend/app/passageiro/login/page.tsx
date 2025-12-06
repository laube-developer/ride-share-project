"use client"
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

export default function Passageiro() {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");

    const router = useRouter()

    const login = () => {
        const backend = process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN;

        fetch(`${backend}/api/passageiro/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "email": email,
                "senha": senha,
            })
        })
        .then(async (data) => {
            if (data.status != 200) {
                toast.error(await data.text(), {
                    position: "top-right"
                })
                return
            }

            const sessionData = await data.json();
            console.log(sessionData);
            sessionStorage.setItem('SESSION', JSON.stringify(sessionData));
            router.push('/passageiro/viagem')
        })
        .catch(reason => {
            toast.error("Falha ao realizar login\n"+ reason, {position: "top-right"});
        })
    }

    return (
        <div className="w-full h-screen flex py-5 px-3 justify-center items-center bg-white">
            <div className="flex w-full h-full absolute left-0 top-0">
                <Image
                    width={1920}
                    height={1500}
                    src="/login_background.jpg"
                    alt="Sharing Drive Logo"
                    className="object-cover h-full"
                />
            </div>

            <form action={`${process.env.NEXT_PUBLIC_SPRING_BOOT_URL}/motorista/`} method="POST" className="flex flex-col gap-6 p-12 z-10 bg-white rounded-lg shadow-lg justify-center w-110">
                <FieldGroup>
                    <div>
                        <h2 className="text-2xl mb-5 border-b-3 border-[#fdc426] w-max">Passageiro</h2>
                        <h1 className="text-4xl font-wheith">Entre em sua conta</h1>
                        <p className="text-gray-500">Realize o login para continuar</p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="email">
                            Email
                        </FieldLabel>
                        <Input
                            id="email"
                            name="email"
                            placeholder="exemplo@mail.com"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            autoCapitalize="none"
                        />
                    </Field>

                    <Field className="flex flex-col-reverse">
                        
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="********"
                            required
                            value={senha}
                            onChange={(e) => setSenha(e.target.value)}
                            autoCapitalize="none"

                        />
                        <FieldLabel htmlFor="password" className="flex justify-between">
                            Senha
                            <a href="/passageiro/recuperar-senha" className="text-primary hover:underline cursor-pointer text-sky-700">Esqueci a senha</a>
                        </FieldLabel>
                    </Field>

                    <Field orientation={"horizontal"} className="justify-center items-center">
                        <a href="/passageiro/criar-conta" className="text-primary hover:underline cursor-pointer text-sky-700">Ainda não tenho conta</a>
                    </Field>

                    <Field orientation="horizontal" onClick={login}>
                        <Button type="button" className="cursor-pointer bg-[#fdc426] text-black hover:bg-[#ffcb2c] w-full">Entrar</Button>
                    </Field>

                </FieldGroup>
            </form>
        </div>
    )
}