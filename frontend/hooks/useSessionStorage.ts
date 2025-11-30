import { Sessao } from '@/types/types';
import {useEffect, useState} from 'react'

const useSessionStorage = (key: string) => {
    const [session, setSession] = useState<Sessao | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        if (typeof window != 'undefined'){
            try{
                const item = window.sessionStorage.getItem(key);
                if (item){
                    const objetoDaSessao: Sessao = JSON.parse(item);
                    setSession(objetoDaSessao);
                } else {
                    setSession(null);
                }
            } catch (error) {
                console.log("Falha ao encontrar a chave " + key + " no banco de sessão.");
                setSession(null);
            } finally {
                setIsLoading(false);
            }
        }
    }, [key])

    return {session, isLoading};
};

export default useSessionStorage;