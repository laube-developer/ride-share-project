"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuLabel, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuSub, DropdownMenuSubContent, DropdownMenuSubTrigger, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "../ui/button";
import { DropdownMenuShortcut } from "../ui/dropdown-menu";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "../ui/dialog";
import useSessionStorage from "@/hooks/useSessionStorage";
import { toast } from "sonner";
import { CNH, Sessao } from "@/types/types";
import { Field, FieldLabel } from "../ui/field";
import { Input } from "../ui/input";
import { Spinner } from "../ui/spinner";
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../ui/alert-dialog";
import useApi from "@/hooks/useApi";
import { error } from "console";

function MyBadge({ children }: { children: React.ReactNode }) {
    return (
        <div className="border-2 border-slate-200 text-[.5rem] font-semibold px-1 py-0.5 rounded-md top-0 right-0 transform translate-x-1/2 -translate-y-1/2">
            {children}
        </div>
    );
}

export default function HeaderMotorista({ session }: { session: Sessao | null }) {
    const router = useRouter();
    const [cnh, setCnh] = useState<CNH | null>(null)
    const [atualNumero, setAtualNumero] = useState<string>(cnh ? cnh.numero : "");
    const [atualValidade, setAtualValidade] = useState<string>(cnh ? cnh.validade.toISOString().split('T')[0] : "");

    const [loadingSalvarCnh, setLoadingSalvarCnh] = useState(false);
    const [openUpdateDialog, setOpenUpdateDialog] = useState(false);
    const [isEditing, setIsEditing] = useState(false);

    const [veiculo, setVeiculo] = useState<{
        modelo: string,
        placa: string,
        cor: string,
        ano: string,
        documentacaoValida: boolean,
    } | null>(null);

    const [atualModelo, setAtualModelo] = useState<string>(veiculo ? veiculo.modelo : "");
    const [atualPlaca, setAtualPlaca] = useState<string>(veiculo ? veiculo.placa : "");
    const [atualCor, setAtualCor] = useState<string>(veiculo ? veiculo.cor : "");
    const [atualAno, setAtualAno] = useState<string>(veiculo ? veiculo.ano : "");

    const [loadingSalvarVeiculo, setLoadingSalvarVeiculo] = useState(false);
    const [isEditingVeiculo, setIsEditingVeiculo] = useState(false);
    const [isVeiculoDialogOpen, setIsVeiculoDialogOpen] = useState(false);
    const [dialogView, setDialogView] = useState<'LIST' | 'FORM'>('LIST');
    const [listaVeiculos, setListaVeiculos] = useState<Array<{
        modelo: string,
        placa: string,
        cor: string,
        ano: string,
        documentacaoValida: boolean,
    }>>([])

    const [veiculoEmEdicao, setVeiculoEmEdicao] = useState<{
        modelo: string,
        placa: string,
        cor: string,
        ano: string,
        documentacaoValida: boolean,
    } | null>(null)

    const comandos = {
        irParaCorridas: () => { router.push('/motorista/corrida'); },
        irParaHistórico: () => { router.push('/motorista/historico') },
        irParaSaldo: () => { router.push('/motorista/meios-de-pagamento'); },
        irParaAlterarSenha: () => { router.push('/motorista/alterar-senha'); },
        irParaMinhasAvaliacoes: () => { router.push('/motorista/alterar-senha'); },
        salvarCNH: () => {
            setLoadingSalvarCnh(true)

            const data = {
                numero: atualNumero,
                validade: atualValidade,
            }


            fetch(`${process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN}/api/motorista/atualizar-cnh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sessao: {
                        nomeDeUsuario: session?.nomeDeUsuario,
                        sessaoToken: session?.sessaoToken,
                        email: session?.email,
                        categoria: session?.categoria,
                    },
                    cnh: data,
                })
            })
                .then(async (response) => {
                    if (response.status !== 200) {
                        const errorText = await response.text();

                        toast.error("Falha ao atualizar cnh", { position: "top-right" })
                        console.error("Resposta de Erro do Backend:", response);
                        console.log("Mensagem de Erro:", errorText);

                        setLoadingSalvarCnh(false)
                        return;
                    }

                    const dataRetornada = await response.json();
                    console.log(dataRetornada);

                    toast.success("CNH atualizada com sucesso!", { position: "top-right" })
                    setCnh({
                        numero: data.numero,
                        validade: new Date(data.validade),
                    });
                    setLoadingSalvarCnh(false)
                    setOpenUpdateDialog(false)
                })
                .catch(error => {
                    toast.error("Erro ao atualizar CNH: " + error, { position: "top-right" })
                    console.error(error)
                    setLoadingSalvarCnh(false)
                })
        },
        salvarVeiculo: () => {
            setLoadingSalvarVeiculo(true)

            const data = {
                modelo: atualModelo,
                placa: atualPlaca,
                cor: atualCor,
                ano: atualAno,
            }


            fetch(`${process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN}/api/motorista/adicionar-veiculo`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    sessao: {
                        nomeDeUsuario: session?.nomeDeUsuario,
                        sessaoToken: session?.sessaoToken,
                        email: session?.email,
                        categoria: session?.categoria,
                    },
                    veiculo: data,
                })
            })
                .then(async (response) => {
                    if (response.status !== 200) {
                        const errorText = await response.text();

                        toast.error("Falha ao atualizar veículo", { position: "top-right" })
                        console.error("Resposta de Erro do Backend:", response);
                        console.log("Mensagem de Erro:", errorText);

                        setLoadingSalvarVeiculo(false)
                        return;
                    }

                    const dataRetornada = await response.json();
                    console.log(dataRetornada);

                    toast.success("Veículo carregado com sucesso!", { position: "top-right" })
                    setVeiculo({
                        modelo: data.modelo,
                        placa: data.placa,
                        cor: data.cor,
                        ano: data.ano,
                        documentacaoValida: true,
                    });
                    setLoadingSalvarVeiculo(false)
                    setIsEditingVeiculo(false)
                }
                )
                .catch(error => {
                    toast.error("Erro ao atualizar veículo: " + error, { position: "top-right" })
                    console.error(error)
                    setLoadingSalvarVeiculo(false)
                })

        },

        sair: () => {
            router.push('/');
        }
    }

    const { fetchApi } = useApi({
        nomeDeUsuario: session?.nomeDeUsuario,
        sessaoToken: session?.sessaoToken,
        email: session?.email,
        categoria: session?.categoria,
    });

    useEffect(() => {
        return () => {
            fetchApi(
                `/api/motorista/get-veiculo-ativo`,
                {},
                "POST"
            )
                .then(async (response) => {
                    if (response.error) {
                        toast.error(response.error, { position: "top-right" })
                        return;
                    }

                    setVeiculo({
                        modelo: response.data.modelo,
                        placa: response.data.placa,
                        cor: response.data.cor,
                        ano: response.data.ano,
                        documentacaoValida: response.data.documentacaoValida,
                    });
                })
                .catch(error => {
                    toast.error("Erro ao obter veículo: " + error, { position: "top-right" })
                    console.error(error)
                })

        }
    }, [])

    useEffect(() => {
        if (!window) return;

        window.onkeydown = function (e) {
            if (e.ctrlKey && e.key === 'H') {
                comandos.irParaCorridas();
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

    useEffect(() => {
        return () => {
            const backend = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8080';

            fetch(`${backend}/api/motorista/get-cnh`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "nomeDeUsuario": session?.nomeDeUsuario,
                    "sessaoToken": session?.sessaoToken,
                    "email": session?.email,
                    "categoria": session?.categoria,
                })
            })
                .then(async (response) => {
                    if (response.status !== 200) {
                        toast.error(await response.text(), { position: "top-right" })
                        return;
                    }

                    const cnhData = await response.json();
                    console.log(cnhData);

                    setCnh({
                        numero: cnhData.numero,
                        validade: new Date(cnhData.validade),
                    });

                    // if (!cnhData || !cnhData.valid) {
                    //   alert("Sua CNH está vencida ou inválida. Por favor, atualize suas informações.");
                    //   router.push('/motorista/dados-pessoais');
                    // }
                })
        }

    }, [session]);



    return (
        <header className="w-full bg-white shadow-md p-4 flex items-center justify-start">
            <Link href={'/'} className="flex flex-row items-center">
                <>
                    <Image src={'/icon.png'} alt="Sharing Drive Icon" width={50} height={50} />
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
                    <DropdownMenuLabel className="font-bold">Conta</DropdownMenuLabel>
                    <DropdownMenuGroup>

                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Dialog>
                                <DialogTrigger asChild>
                                    <div className="flex w-full justify-between items-center">
                                        CNH
                                        <DropdownMenuShortcut>CTRL ⇧ P</DropdownMenuShortcut>
                                    </div>
                                </DialogTrigger>

                                <DialogContent>
                                    <DialogTitle>
                                        {cnh ?
                                            (isEditing ? "Atualizar CNH" : "Detalhes da CNH")
                                            : "Adicionar CNH"
                                        }
                                    </DialogTitle>
                                    <DialogDescription>Gerencie a CNH</DialogDescription>


                                    {(isEditing || !cnh) && (
                                        <div className="mt-4 flex flex-col gap-4">
                                            <p className="text-sm text-gray-500">
                                                {cnh ? "Digite o novo número e validade." : "Digite o número e a validade da sua CNH."}
                                            </p>

                                            <FieldLabel>Número:
                                                <Input
                                                    name="numero"
                                                    value={atualNumero}
                                                    onChange={e => setAtualNumero(e.target.value)}
                                                />
                                            </FieldLabel>

                                            <FieldLabel>Validade:
                                                <Input
                                                    type="date"
                                                    name="validade"
                                                    value={atualValidade}
                                                    onChange={e => setAtualValidade(e.target.value)}
                                                />
                                            </FieldLabel>
                                        </div>
                                    )}

                                    {cnh && !isEditing && (
                                        <div className="mt-4 flex flex-col gap-4">
                                            <FieldLabel>Número:
                                                <Input value={cnh.numero} readOnly />
                                            </FieldLabel>
                                            <FieldLabel>Validade:
                                                <Input value={cnh.validade.toLocaleDateString()} readOnly />
                                            </FieldLabel>
                                        </div>
                                    )}
                                    <DialogFooter className="flex justify-between items-center mt-4">

                                        {(isEditing || !cnh) ? (
                                            <Button
                                                variant="outline"
                                                onClick={() => cnh ? setIsEditing(false) : setOpenUpdateDialog(false)}
                                                disabled={loadingSalvarCnh}
                                            >
                                                {cnh ? "Voltar" : "Cancelar"}
                                            </Button>
                                        ) : (
                                            <Button
                                                onClick={() => {
                                                    setAtualNumero(cnh.numero);
                                                    const dateString = cnh.validade.toISOString().split('T')[0];
                                                    setAtualValidade(dateString);
                                                    setIsEditing(true);
                                                }}
                                            >
                                                Atualizar CNH
                                            </Button>
                                        )}

                                        {(isEditing || !cnh) && (
                                            <Button
                                                onClick={comandos.salvarCNH}
                                                disabled={loadingSalvarCnh || !atualNumero || !atualValidade}
                                            >
                                                {loadingSalvarCnh ? <Spinner /> : "Salvar CNH"}
                                            </Button>
                                        )}

                                    </DialogFooter>

                                </DialogContent>
                            </Dialog>
                        </DropdownMenuItem>


                        <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
                            <Dialog open={isVeiculoDialogOpen} onOpenChange={setIsVeiculoDialogOpen}>
                                <DialogTrigger asChild>
                                    {/* Trigger do Veículo no Menu */}
                                    <div className="flex w-full justify-between items-center">
                                        Veículo
                                        <DropdownMenuShortcut>CTRL ⇧ V</DropdownMenuShortcut>
                                    </div>
                                </DialogTrigger>

                                <DialogContent>
                                    {/* Título dinâmico: Listagem, Adição ou Edição */}
                                    <DialogTitle>
                                        {dialogView === 'LIST'
                                            ? `Meus Veículos (${listaVeiculos.length})`
                                            : veiculoEmEdicao
                                                ? "Editar Veículo"
                                                : "Adicionar Novo Veículo"
                                        }
                                    </DialogTitle>

                                    <DialogDescription>Gerencie seus veículos cadastrados</DialogDescription>

                                    {/* ------------------------------------------------------------------ */}
                                    {/* 1. MODO: LISTAGEM DE VEÍCULOS (dialogView === 'LIST') */}
                                    {/* ------------------------------------------------------------------ */}
                                    {dialogView === 'LIST' && (
                                        <div className="mt-4 flex flex-col gap-4">

                                            {listaVeiculos.length === 0 ? (
                                                // A. Não há veículos cadastrados
                                                <div className="text-center p-6 border rounded-lg">
                                                    <p className="text-gray-500 mb-4">Você não possui veículos cadastrados.</p>
                                                    <Button onClick={() => setDialogView('FORM')}>
                                                        Adicionar Primeiro Veículo
                                                    </Button>
                                                </div>
                                            ) : (
                                                // B. Listagem dos veículos (Iteração)
                                                <div className="space-y-3">
                                                    {listaVeiculos.map((v) => (
                                                        <div key={v.placa} className="p-3 border rounded-lg flex justify-between items-center">
                                                            <div>
                                                                <p className="font-semibold">{v.modelo} ({v.ano})</p>
                                                                <p className="text-sm text-gray-600">{v.placa} | {v.cor}</p>
                                                            </div>
                                                            <div className="flex gap-2">

                                                                {/* Botão de Edição */}
                                                                <Button
                                                                    variant="outline"
                                                                    size="sm"
                                                                    onClick={() => {
                                                                        // 1. Configurar estados de edição com os dados do veículo
                                                                        setVeiculoEmEdicao(v);
                                                                        setAtualModelo(v.modelo);
                                                                        setAtualPlaca(v.placa);
                                                                        setAtualCor(v.cor);
                                                                        setAtualAno(v.ano);
                                                                        // 2. Mudar para o formulário
                                                                        setDialogView('FORM');
                                                                    }}
                                                                >
                                                                    Editar
                                                                </Button>

                                                                {/* Botão de Seleção (Se houver lógica de "veículo ativo") */}
                                                                {/* <Button size="sm" onClick={() => comandos.selecionarVeiculoAtivo(v)}>Ativar</Button> */}

                                                            </div>
                                                        </div>
                                                    ))}

                                                    <hr className="my-4" />

                                                    {/* Botão para adicionar MAIS veículos */}
                                                    <Button
                                                        onClick={() => {
                                                            setVeiculoEmEdicao(null); // Limpa o veículo em edição
                                                            setDialogView('FORM');
                                                        }}
                                                        className="w-full"
                                                    >
                                                        Adicionar Novo Veículo
                                                    </Button>
                                                </div>
                                            )}
                                        </div>
                                    )}


                                    {/* ------------------------------------------------------------------ */}
                                    {/* 2. MODO: FORMULÁRIO (dialogView === 'FORM') */}
                                    {/* ------------------------------------------------------------------ */}
                                    {dialogView === 'FORM' && (
                                        <>
                                            <div className="mt-4 flex flex-col gap-4">
                                                <p className="text-sm text-gray-500">
                                                    {veiculoEmEdicao ? "Edite os detalhes do veículo." : "Preencha os dados do seu novo veículo."}
                                                </p>

                                                <FieldLabel>Modelo: <Input name="modelo" value={atualModelo} onChange={e => setAtualModelo(e.target.value)} /></FieldLabel>
                                                <FieldLabel>Placa: <Input name="placa" value={atualPlaca} onChange={e => setAtualPlaca(e.target.value)} /></FieldLabel>
                                                <FieldLabel>Cor: <Input name="cor" value={atualCor} onChange={e => setAtualCor(e.target.value)} /></FieldLabel>
                                                <FieldLabel>Ano: <Input type="number" name="ano" value={atualAno} onChange={e => setAtualAno(e.target.value)} /></FieldLabel>
                                            </div>

                                            {/* ------------------ RODAPÉ FORMULÁRIO ------------------ */}
                                            <DialogFooter className="flex justify-between items-center mt-4">
                                                <Button
                                                    variant="outline"
                                                    onClick={() => setDialogView('LIST')} // Volta para a lista
                                                    disabled={loadingSalvarVeiculo}
                                                >
                                                    Voltar
                                                </Button>

                                                <Button
                                                    onClick={comandos.salvarVeiculo} // Esta função deve lidar com adição e edição
                                                    disabled={loadingSalvarVeiculo || !atualModelo || !atualPlaca || !atualAno}
                                                >
                                                    {loadingSalvarVeiculo ? <Spinner /> : (veiculoEmEdicao ? "Salvar Alterações" : "Adicionar Veículo")}
                                                </Button>
                                            </DialogFooter>
                                        </>
                                    )}

                                </DialogContent>
                            </Dialog>
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