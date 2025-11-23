import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Passageiro(){
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

            <form action={'/api/passageiro/login'} method="POST" className="flex flex-col gap-6 p-12 z-10 bg-white rounded-lg shadow-lg justify-center w-110">
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
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password" className="flex justify-between">
                            Senha
                            <a href="/passageiro/recuperar-senha" className="text-primary hover:underline cursor-pointer text-sky-700">Esqueci a senha</a>
                        </FieldLabel>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="********"
                            required
                        />
                    </Field>

                    <Field orientation={"horizontal"} className="justify-center items-center">
                        <a href="/passageiro/criar-conta" className="text-primary hover:underline cursor-pointer text-sky-700">Ainda não tenho conta</a>
                    </Field>

                    <Field orientation="horizontal">
                        <Button type="submit" className="cursor-pointer bg-[#fdc426] text-black hover:bg-[#ffcb2c] w-full">Entrar</Button>
                    </Field>
                    
                </FieldGroup>
            </form>
        </div>
    )
}