import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Field, FieldDescription, FieldGroup, FieldLabel, FieldLegend } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";

export default function Passageiro(){
    return (
        <div className="w-full h-screen flex flex-col py-5 px-3 justify-center items-center bg-white h-full">
            <div className="flex w-full h-full absolute left-0 top-0">
                <Image 
                    width={1920}
                    height={1500}
                    src="/login_background.jpg"
                    alt="Sharing Drive Logo"
                    className="object-cover h-full"
                />
            </div>

            <form className="flex flex-col p-10 z-10 bg-white rounded-lg shadow-lg justify-start overflow-y-auto max-h-full w-110">
                <FieldGroup className="">
                    <div>
                        <h2 className="text-2xl mb-5 border-b-3 border-[#fdc426] w-max">Passageiro</h2>
                        <h1 className="text-4xl font-wheith">Comece agora mesmo</h1>
                        <p className="text-gray-500">Realize o login para continuar</p>
                    </div>
                    <Field>
                        <FieldLabel htmlFor="nome">
                        Nome
                        </FieldLabel>
                        <Input
                            id="nome"
                            name="nome"
                            placeholder="Enzo"
                            required
                            autoComplete="false"
                        />
                    </Field>

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
                        </FieldLabel>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="********"
                            required
                        />
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="confirm-password" className="flex justify-between">
                            Confirme a senha
                        </FieldLabel>
                        <Input
                            id="confirm-password"
                            name="confirm-password"
                            type="password"
                            placeholder="********"
                            required
                        />
                    </Field>

                    <Field orientation="horizontal">
                        <Checkbox
                        id="concordo_com_termos"
                        />
                        <FieldLabel
                        htmlFor="concordo_com_termos"
                        className="font-normal"
                        >
                        Concordo com os <a className="font-bold">Termos de serviço</a>
                        </FieldLabel>
                    </Field>

                    <Field orientation={"horizontal"} className="justify-center items-center">
                        <a href="/passageiro/login">Já tenho conta</a>
                    </Field>


                    <Field orientation="horizontal" className="justify-end">
                        <Button type="submit" className="cursor-pointer bg-[#fdc426] text-black hover:bg-[#ffcb2c] w-full">Cadastrar</Button>
                    </Field>

                    



                    
                </FieldGroup>
            </form>
        </div>
    )
}