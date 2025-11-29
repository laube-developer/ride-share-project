import { Categoria } from "@/types/types";

export const calcularPreco = ({distancia, categoria}:{distancia: number | undefined, categoria: Categoria}) => {
    if (!distancia) return 5
    
    const p = categoria == "luxo" ? 2 : 1;

    return (5 + distancia*p);
}