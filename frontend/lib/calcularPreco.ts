import { Categoria } from "@/types/types";

export const calcularPreco = ({distancia, categoria}:{distancia: number, categoria: Categoria}) => {
    const p = categoria == "luxo" ? 2 : 1;

    return (5 + distancia*p);
}