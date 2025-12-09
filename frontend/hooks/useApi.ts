import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface SessionData {
    nomeDeUsuario?: string;
    sessaoToken?: string;
    email?: string;
    categoria?: string;
}

interface RespostaBackend<T = any> {
    status: boolean; 
    mensagem: string;
    operacao: string;
    [key: string]: any; 
}


type ApiFetcher<T> = (
    path: string, 
    bodyData?: object | null
) => Promise<{ data: T | null; error: string | null }>;


/**
 * Hook customizado para chamadas de API que segue o padrão de Resposta do Spring Boot.
 *
 * @param sessionData Os dados da sessão a serem incluídos no body de todas as requisições.
 * @returns A função 'fetchApi' para realizar requisições padronizadas.
 */
const useApi = (sessionData: SessionData) => {
    
    const backendUrl = process.env.NEXT_PUBLIC_SPRIGBOOT_DOMAIN;

    const fetchApi = useCallback(async <T,>(
        path: string, 
        bodyData: object | null = null,
        method: 'POST' | 'GET' = 'POST'
    ): Promise<{ data: T | null; error: string | null }> => {
        
        if (!backendUrl) {
            const err = "URL do backend não configurada.";
            toast.error(err);
            return { data: null, error: err };
        }

        const config: RequestInit = {
            method: method,
            headers: {
                'Content-Type': 'application/json',
            },
        };

        if (method === 'POST') {
            const fullBody = {
                sessao: sessionData, 
                ...bodyData, 
            };
            config.body = JSON.stringify(fullBody);
        }
        
        try {
            const response = await fetch(`${backendUrl}${path}`, config);
            
            if (!response.ok) {
                let errorData: RespostaBackend = { status: false, mensagem: "Erro desconhecido ou de rede.", operacao: "ERRO_HTTP" };
                
                try {
                    errorData = await response.json();
                } catch (e) {
                    const errorText = await response.text();
                    errorData.mensagem = `Erro HTTP ${response.status}: ${errorText.substring(0, 100)}...`;
                }

                toast.error(`[${errorData.operacao}] ${errorData.mensagem}`, { position: 'top-right' });
                return { data: null, error: errorData.mensagem };
            }

            const jsonResponse: RespostaBackend<T> = await response.json();

            if (!jsonResponse.status) {
                toast.error(`[${jsonResponse.operacao}] ${jsonResponse.mensagem}`, { position: 'top-right' });
                return { data: null, error: jsonResponse.mensagem };
            }

            return { data: jsonResponse as T, error: null };

        } catch (error) {
            const errorMsg = "Erro de conexão ou servidor: " + (error as Error).message;
            toast.error(errorMsg, { position: 'top-right' });
            return { data: null, error: errorMsg };
        }
    }, [backendUrl, sessionData]);

    return { fetchApi };
};

export default useApi;