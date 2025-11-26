"use client"

import { Field, FieldDescription } from "@/components/ui/field";
import { AutocompleteInput } from "../../AutocompleteInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type { AbaMenuPassageiro, Localizacao } from "@/types/types";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FaLocationCrosshairs } from "react-icons/fa6";

type AbaOrigemProps = {
    open: boolean,
    abaAtual: AbaMenuPassageiro,
    inputOrigemRef: RefObject<HTMLInputElement | null>,
    onPlaceSelected: (place: google.maps.places.PlaceResult) => void,
    posicaoAtual: { lat: number, lng: number } | null,
    setOrigem: Dispatch<SetStateAction<{
        name: string | undefined;
        lat: number;
        lng: number;
    } | null>>,
    map: google.maps.Map | null,
    onSelecionarOrigem: ((loc: Localizacao) => void) | undefined,
    setAbaMenu: Dispatch<SetStateAction<AbaMenuPassageiro>>
    origem: { name: string | undefined, lat: number, lng: number } | null
}

export default function AbaOrigem({
    open,
    inputOrigemRef,
    onPlaceSelected,
    posicaoAtual,
    setOrigem,
    map,
    onSelecionarOrigem,
    setAbaMenu,
    origem
}: AbaOrigemProps) {
    if (!open) return <></>

    return <>
        <Field>
            <FieldDescription className="text-black font-bold">Origem da viagem</FieldDescription>
            <div className="flex flex-row gap-2">

                <AutocompleteInput
                    placeholder="Digite a origem"
                    ref={inputOrigemRef}
                    onPlaceSelected={onPlaceSelected}
                    className="border px-2 py-2 rounded w-full"
                />

                <Button
                    className="w-max h-full cursor-pointer"
                    variant={'outline'}
                    disabled={!posicaoAtual}
                    onClick={() => {
                        if (!posicaoAtual) return
                        setOrigem({
                            name: 'Localização atual',
                            lat: posicaoAtual.lat,
                            lng: posicaoAtual.lng
                        })

                        if (map) {
                            map.panTo({ lat: posicaoAtual.lat, lng: posicaoAtual.lng });
                            map.setZoom(15);
                        }

                        if (onSelecionarOrigem) {
                            onSelecionarOrigem({
                                name: 'Localização atual',
                                lat: posicaoAtual.lat,
                                lng: posicaoAtual.lng,
                            });
                        }

                        setAbaMenu('destino')


                    }}
                >
                    {!posicaoAtual && <Spinner />}
                    {posicaoAtual && <FaLocationCrosshairs />}

                </Button>

            </div>

        </Field>

        <Field className="self-end">
            <Button
                onClick={() => {
                    if (origem) {
                        setAbaMenu("destino");
                        return;
                    }

                    toast.warning('Selecione o ponto de origem!', { position: 'top-right' });
                    inputOrigemRef.current?.focus();

                }}
                className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer">Selecionar</Button>
        </Field>
    </>
}