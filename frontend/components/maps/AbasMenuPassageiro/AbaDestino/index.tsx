"use client"

import { Field, FieldDescription } from "@/components/ui/field";
import { AutocompleteInput } from "../../AutocompleteInput";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

import type { AbaMenuPassageiro } from "@/types/types";
import { Dispatch, RefObject, SetStateAction } from "react";
import { Spinner } from "@/components/ui/spinner";
import { FaLocationCrosshairs } from "react-icons/fa6";

type AbaDestinoProps = {
    open: boolean,
    inputOrigemRef: RefObject<HTMLInputElement | null>,
    inputDestinoRef: RefObject<HTMLInputElement | null>,
    onPlaceSelected: (place: google.maps.places.PlaceResult) => void,
    posicaoAtual: { lat: number, lng: number } | null,
    setDestino: Dispatch<SetStateAction<{
        name: string | undefined;
        lat: number;
        lng: number;
    } | null>>,
    setAbaMenu: Dispatch<SetStateAction<AbaMenuPassageiro>>,
    origem: { name: string | undefined, lat: number, lng: number } | null,
    destino: { name: string | undefined, lat: number, lng: number } | null,
    handleUpdateDestino: ({ name, lat, lng }: {
        name: string | undefined;
        lat: number;
        lng: number;
    }) => void
}

export default function AbaDestino({
    open,
    inputOrigemRef,
    inputDestinoRef,
    onPlaceSelected,
    posicaoAtual,
    setDestino,
    setAbaMenu,
    origem,
    destino,
    handleUpdateDestino
}: AbaDestinoProps) {
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
                    value={origem?.name}
                    disabled
                    disabledOnClick={() => setAbaMenu('origem')}
                />

            </div>

        </Field>

        <Field className="flex flex-col mb-10 md:mb-0">
            <FieldDescription className="text-black font-bold">Para onde você quer ir?</FieldDescription>
            <div className="flex flex-row gap-2 h-full">

                <AutocompleteInput
                    placeholder="Digite o destino"
                    ref={inputDestinoRef}
                    onPlaceSelected={onPlaceSelected}
                    className="border px-2 py-2 rounded w-full"
                    value={destino?.name}
                    disabled={!!destino}
                    disabledOnClick={() => setDestino(null)}
                />

                <Button
                    className="w-max h-[100%] cursor-pointer"
                    variant={'outline'}
                    disabled={!posicaoAtual}
                    onClick={() => {
                        if (!posicaoAtual) return

                        if (
                            posicaoAtual.lat == origem?.lat &&
                            posicaoAtual.lng == origem?.lng
                        ) {
                            toast.error('Selecione uma localização diferente da origem.', {
                                position: 'top-right',
                                style: {
                                    color: 'red'
                                }
                            })
                            return;
                        }

                        handleUpdateDestino({
                            name: 'Localização atual',
                            lat: posicaoAtual.lat,
                            lng: posicaoAtual.lng
                        })
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
                    if (destino) {
                        setAbaMenu("categoria");
                        return;
                    }

                    toast.warning('Selecione o ponto de destino!', { position: 'top-right' });
                    inputOrigemRef.current?.focus();

                }}
                className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer">Selecionar</Button>
        </Field>
    </>
}