export type FormaPagamento = {
    nome: string;
    tipo: string;
    descricao: string;
}

type Usuario = {
    nome: string,
    telefone?: string,
    avaliacoes?: number,
    img_url: string
}
export type Motorista = & Usuario;

export type Passageiro = & Usuario;

export type Geolocalizacao = {
    lat: number,
    lng: number
} | null

export type Localizacao = Geolocalizacao & {
    name: string | undefined,
} | null

const transicao = 5000;

export type AbaMenuPassageiro = "origem" |
    "destino" |
    "categoria" |
    "buscando motorista" |
    "corrida" |
    "pagamento"

export type PagamentoStatus = "processando" | "pago" | "falha_no_pagamento" | null

export type Categoria = 'comum' | 'luxo'

export type StatusCorrida =
    null |
    'solicitada' |
    'aceita' |
    'motorista_chegou' |
    'iniciada' |
    'finalizada' |
    'cancelada'

    ;

export type StatusMotorista = "online" | "offline" | "em_corrida" | "processando";

export type Sessao = {
    userEmail: string,
    sessaoToken: string,
    nomeDeUsuario: string
}