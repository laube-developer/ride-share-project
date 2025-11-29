import { Button } from "@/components/ui/button";
import { Card, CardAction, CardHeader, CardTitle } from "@/components/ui/card";
import { Item, ItemActions, ItemContent, ItemDescription, ItemHeader, ItemTitle } from "@/components/ui/item";
import { Spinner } from "@/components/ui/spinner";
import { Motorista, StatusMotorista } from "@/types/types";
import { Dispatch, SetStateAction, useState } from "react";

type AbaPrincipal = {
    open?: boolean;
    statusMotorista: StatusMotorista;
    ficarOnline: () => void,
    ficarOffline: () => void,
    motorista: Motorista
}

const StatusIndicador = ({ status }: { status: StatusMotorista }) => {

    if (status == "offline" || status == "processando") {
        return <Item className="bg-slate-100 h-15">
            <ItemHeader>
                <ItemTitle className={`w-3 h-3 bg-slate-500 rounded-full`}></ItemTitle>
                <ItemDescription className={`font-bold text-slate-500`}>{status == "processando" ? <Spinner /> : status}</ItemDescription>
            </ItemHeader>
        </Item>
    }

    return <Item className="bg-green-100 h-15">
        <ItemHeader>
            <ItemTitle className={`w-3 h-3 bg-green-500 rounded-full bg-green-500`}></ItemTitle>
            <ItemDescription className={`font-bold text-green-500`}>{status}</ItemDescription>
        </ItemHeader>
    </Item>
}

export default function AbaPrincipal({
    open,
    statusMotorista,
    ficarOnline,
    ficarOffline,
    motorista,
}: AbaPrincipal) {

    if (!open) return <></>

    return <>
        <StatusIndicador
            status={statusMotorista}
        />

        <div className="flex flex-col gap-1">
            <h1 className="text-xl">Bem vindo de volta, <b>{motorista.nome}</b></h1>
            {statusMotorista == "offline" && <p className="text-slate-500">Comece agora a receber corridas.</p>}
        </div>

        <Button
            onClick={statusMotorista == "online" ? ficarOffline : ficarOnline}
        >Ficar {statusMotorista == "online" ? "Offline" : "Online"}</Button>
    </>

}