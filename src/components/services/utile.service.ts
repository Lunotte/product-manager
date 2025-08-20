import { useCallback } from "react";

export function useAdd<T>(
    apiAddFn: (nom: string) => Promise<T[]>,
    setState: (data: T[]) => void,
    onAction: (event: { type: 'add'; message: string }) => void,
    successMessage: string
) {
    return useCallback((nom: string) => {
        apiAddFn(nom).then((result) => {
            onAction({ type: 'add', message: successMessage });
            setState(result);
        })
            .catch((err) => {
                window.electronAPI.logError(err);
            });
    },
        [apiAddFn, setState, onAction, successMessage]
    );
}

export function useUpdate<T>(
    apiUpdateFn: (id: number, nom: string) => Promise<T[]>,
    setState: (data: T[]) => void,
    onAction: (event: { type: 'update'; message: string }) => void,
    successMessage: string
) {
    return useCallback((id: number, nom: string) => {
        apiUpdateFn(id, nom).then((result) => {
            onAction({ type: 'update', message: successMessage });
            setState(result);
        })
            .catch((err) => {
                window.electronAPI.logError(err);
            });
    }, [apiUpdateFn, setState, onAction, successMessage]);
}
