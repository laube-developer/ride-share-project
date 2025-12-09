import { Sessao } from '@/types/types';
import { usePathname, useRouter } from 'next/navigation';
import {useEffect, useState} from 'react'
import { toast } from 'sonner';

const useSessionStorage = (
    key: string, 
    redirectOnFail: string, 
    // O parâmetro categoriaEsperada agora é opcional ou pode ser removido
    // Deixei-o opcional por compatibilidade, mas ele não é mais usado na lógica
    categoriaEsperada?: "PASSAGEIRO" | "MOTORISTA" 
) => {
    const [session, setSession] = useState<Sessao | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const pathName = usePathname();
    
    // VARIÁVEL REDUNDANTE APÓS A REMOÇÃO DA LÓGICA DE CATEGORIA.
    // Ela não afeta a lógica principal agora.
    const redirectOnForbidden = categoriaEsperada === 'PASSAGEIRO'
        ? '/passageiro/viagem' 
        : '/motorista/corrida';

    useEffect(() => {
        // Removida a variável isAuthorized, pois não é mais necessária para a lógica de categoria.

        if (typeof window !== 'undefined'){
            try{
                const item = window.sessionStorage.getItem(key);
                
                if (item){
                    const objetoDaSessao: Sessao = JSON.parse(item);
                    setSession(objetoDaSessao);
                    
                } else {
                    console.log("Falha (Chave não encontrada): " + key);
                    setSession(null);
                    router.push(redirectOnFail);
                }

            } catch (error) {
                console.error("Falha ao processar a chave " + key + " no banco de sessão:", error);
                setSession(null);
                router.push(redirectOnFail);
            } finally {
                setIsLoading(false);
            }
        }
    }, [key, router, redirectOnFail]) 

    return {session, isLoading};
};

export default useSessionStorage;