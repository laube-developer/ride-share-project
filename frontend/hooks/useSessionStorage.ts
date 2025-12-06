import { Sessao } from '@/types/types';
import { usePathname, useRouter } from 'next/navigation';
import {useEffect, useState} from 'react'
import { toast } from 'sonner';

const useSessionStorage = (
    key: string, 
    redirectOnFail: string, 
    categoriaEsperada?: "PASSAGEIRO" | "MOTORISTA"
) => {
    const [session, setSession] = useState<Sessao | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    const router = useRouter();
    const pathName = usePathname();
    
    // Variável para armazenar a rota de redirecionamento de autorização
    // Se for PASSAGEIRO, redireciona para /motorista/viagem e vice-versa.
    const redirectOnForbidden = categoriaEsperada === 'PASSAGEIRO'
        ? '/passageiro/viagem' 
        : '/motorista/corrida';

    useEffect(() => {
        let isAuthorized = false;

        if (typeof window !== 'undefined'){
            try{
                const item = window.sessionStorage.getItem(key);
                
                if (item){
                    const objetoDaSessao: Sessao = JSON.parse(item);
                    setSession(objetoDaSessao);
                    
                    if (categoriaEsperada && objetoDaSessao.categoria !== categoriaEsperada) {
                        
                        isAuthorized = false;
                        console.log(`Acesso negado. Categoria na sessão: ${objetoDaSessao.categoria}. Esperada: ${categoriaEsperada}`);
                        toast.error("Você não tem permissão para acessar esta área.");

                        router.push(redirectOnForbidden);

                    } else {
                        isAuthorized = true;
                    }

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
    }, [key, router, redirectOnFail, categoriaEsperada, redirectOnForbidden]) 

    return {session, isLoading};
};

export default useSessionStorage;