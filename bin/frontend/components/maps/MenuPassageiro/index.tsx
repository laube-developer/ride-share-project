import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { useRef, useState } from "react";
import { AutocompleteInput } from "../AutocompleteInput";
import { useMap } from "@vis.gl/react-google-maps";

type MenuPassageiroProps = {
    onSelecionarOrigem?: ({name, lat, lng}: {name?: string; lat: number; lng: number}) => void;
    onSelecionarDestino?: ({name, lat, lng}: {name?: string; lat: number; lng: number}) => void;
    onBuscarMotorista?: () => void;
};

export default function MenuPassageiro({onSelecionarOrigem, onSelecionarDestino, onBuscarMotorista}: MenuPassageiroProps) {
  const [origem, setOrigem] = useState<any>(null);
  const [destino, setDestino] = useState<any>(null);
  const map = useMap();

  return (
    <div className="items-center flex justify-center">
        <div className="bg-white bg-opacity-90 rounded-md shadow-xl p-4 z-20 w-[60%]">
            <FieldGroup className="flex flex-row">

                <Field>
                    <FieldDescription className="text-black font-bold">Origem da viagem</FieldDescription>
                    <AutocompleteInput
                        placeholder="Digite a origem"
                        onPlaceSelected={(place) => {
                            const loc = place.geometry?.location;
                                if (!loc) return;

                                setOrigem({
                                    name: place.formatted_address ?? place.name,
                                    lat: loc.lat(),
                                    lng: loc.lng(),
                                });

                                if (map){
                                    map.panTo({ lat: loc.lat(), lng: loc.lng() });
                                    map.setZoom(15);
                                }

                                if (onSelecionarOrigem){
                                    onSelecionarOrigem({
                                        name: place.formatted_address ?? place.name,
                                        lat: loc.lat(),
                                        lng: loc.lng(),
                                    });
                                }
                                
                        }}
                        className="border px-2 py-2 rounded w-full"
                    />
                        
                </Field>

                <Field>
                    <FieldDescription className="text-black font-bold">Para onde você quer ir?</FieldDescription>
                    <AutocompleteInput
                        placeholder="Digite o destino"
                        onPlaceSelected={(place) => {
                            const loc = place.geometry?.location;
                                if (!loc) return;

                                setDestino({
                                    name: place.formatted_address ?? place.name,
                                    lat: loc.lat(),
                                    lng: loc.lng(),
                                });

                                if (map){
                                    map.panTo({ lat: loc.lat(), lng: loc.lng() });
                                    map.setZoom(15);
                                }

                                if (onSelecionarDestino){
                                    onSelecionarDestino({
                                        name: place.formatted_address ?? place.name,
                                        lat: loc.lat(),
                                        lng: loc.lng(),
                                    });
                                }


                        }}
                        className="border px-2 py-2 rounded w-full"
                    />
                </Field>

                <Field className="self-end">
                    <Button
                        onClick={onBuscarMotorista}
                        className="bg-[#fdc426] hover:bg-[#ffcb2c] text-black cursor-pointer">Buscar motorista</Button>
                </Field>
            </FieldGroup>

        </div>
    </div>
  );
}