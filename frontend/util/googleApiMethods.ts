import { Geolocalizacao, Localizacao } from "@/types/types";
import { Dispatch, SetStateAction } from "react";

export const panTo = (loc: Geolocalizacao, map: google.maps.Map | null) => {
    if (map && loc) {
        map.panTo({ lat: loc.lat, lng: loc.lng });
        map.setZoom(15);
    }

}

export const handleUpdateOrigem = (loc: Localizacao, setOrigem: Dispatch<SetStateAction<Localizacao>>, onSelecionarOrigem: ((loc: Localizacao) => void) | undefined, map: google.maps.Map | null) => {
    updateLocalizacao(
        loc,
        setOrigem,
        onSelecionarOrigem,
        map
    )
}

export const handleUpdateDestino = (loc: Localizacao, setDestino: Dispatch<SetStateAction<Localizacao>>, onSelecionarDestino: ((loc: Localizacao) => void) | undefined, map: google.maps.Map | null) => {
    updateLocalizacao(
        loc,
        setDestino,
        onSelecionarDestino,
        map
    )
}

export const updateLocalizacao = (
    loc: Localizacao,
    setState: Dispatch<SetStateAction<any>>,
    onSelecionarLocalizacao: ((loc: Localizacao) => void) | undefined,
    map: google.maps.Map | null
) => {
    if (!loc) return

    setState({
        name: loc.name,
        lat: loc.lat,
        lng: loc.lng,
    });

    if (onSelecionarLocalizacao) {
        onSelecionarLocalizacao({
            name: loc.name,
            lat: loc.lat,
            lng: loc.lng,
        });
    }

    panTo({ lat: loc.lat, lng: loc.lng }, map)
}