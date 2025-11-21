import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function RecuperarSenhaPassageiro(){
    return (
        <div className="w-full h-screen flex flex-col py-5 px-3 justify-center items-center bg-white">
            <div className="flex w-full h-full absolute left-0 top-0">
                <Image 
                    width={1920}
                    height={1500}
                    src="/login_background.jpg"
                    alt="Sharing Drive Logo"
                    className="object-cover h-full"
                />
            </div>

            <form className="flex flex-col gap-6 p-12 z-10 bg-white rounded-lg shadow-lg justify-center w-110">
                <FieldGroup>
                    <div>
                        <h2 className="text-2xl mb-5 border-b-3 border-[#fdc426] w-max">Passageiro</h2>
                        <h1 className="text-4xl">Recuperar a senha</h1>
                        <p className="text-gray-500 mt-2">Acesso o link no seu email para recuparar a senha</p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="username">
                        Email
                        </FieldLabel>
                        <Input
                            id="username"
                            name="username"
                            placeholder="Enzo123"
                            required
                        />
                    </Field>

                    <Field orientation={"horizontal"} className="justify-center items-center">
                        Lembrou de sua senha? <a href="/passageiro/login" className="text-primary hover:underline cursor-pointer text-sky-700">Entrar</a>
                    </Field>

                    <Field orientation="horizontal">
                        <Button type="submit" className="cursor-pointer bg-[#fdc426] text-black hover:bg-[#ffcb2c] w-full">Enviar solicitação</Button>
                    </Field>

                    
                </FieldGroup>
            </form>
        </div>
    )
}