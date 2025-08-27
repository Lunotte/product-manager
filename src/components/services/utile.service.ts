import { useCallback } from "react";
import { useState } from "react";
import { IdNom } from "../../models/IdNom";

export type OnCrudEventType = (event: { type: 'add' | 'update' | 'delete'; message: string }) => void;

export interface CrudEventProps {
    onEvent: OnCrudEventType;
}

export interface CrudProps<T extends IdNom> {
    label: string;
    items: T[];
    setItems: (items: T[]) => void;
    useAddApi: (item: T) => Promise<T[]>;
    useUpdateApi: (item: T) => Promise<T[]>;
    useDeleteApi: (id: number) => Promise<T[]>;
    onEvent: OnCrudEventType;
    addLabel: string;
    updateLabel: string;
    deleteLabel: string;
}

/**
 * 
 * @param apiAddFn Il faudrait systematiquement utiliser l’objet pour être cohérent avec les autres fonctions
 * @param setState 
 * @param onEvent 
 * @param successMessage 
 * @returns 
 */
export function useAdd<T>(
    apiAddFn: (item: T) => Promise<T[]>,
    setState: (data: T[]) => void,
    onEvent: OnCrudEventType,
    successMessage: string
) {
    return useCallback((item: T) => {
        apiAddFn(item).then((result) => {
            onEvent({ type: 'add', message: successMessage });
            setState(result);
        })
            .catch((err) => {
                window.electronAPI.logError(err);
            });
    },
        [apiAddFn, setState, onEvent, successMessage]
    );
}

export function useUpdate<T>(
    apiUpdateFn: (item: T) => Promise<T[]>,
    setState: (data: T[]) => void,
    onEvent: OnCrudEventType,
    successMessage: string
) {
    return useCallback((item: T) => {
        apiUpdateFn(item).then((result) => {
            onEvent({ type: 'update', message: successMessage });
            setState(result);
        })
            .catch((err) => {
                window.electronAPI.logError(err);
            });
    }, [apiUpdateFn, setState, onEvent, successMessage]);
}

export function useDelete<T>(
    apiDeleteFn: (id: number) => Promise<T[]>,
    setState: (data: T[]) => void,
    onEvent: OnCrudEventType,
    successMessage: string
) {
    return useCallback((id: number) => {
        apiDeleteFn(id).then((result) => {
            onEvent({ type: 'delete', message: successMessage });
            setState(result);
        })
            .catch((err) => {
                window.electronAPI.logError(err);
            });
    }, [apiDeleteFn, setState, onEvent, successMessage]);
}

export function useCrudLogic<T extends IdNom>(
    useAddApi: (item: T) => Promise<T[]>,
    useUpdateApi: (item: T) => Promise<T[]>,
    useDeleteApi: (id: number) => Promise<T[]>,
    setItems: (items: T[]) => void,
    onEvent: OnCrudEventType,
    addLabel: string,
    updateLabel: string,
    deleteLabel: string
) {
    const [item, setItem] = useState<T>();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    const addItem = useAdd(useAddApi, setItems, onEvent, addLabel);
    const updateItem = useUpdate(useUpdateApi, setItems, onEvent, updateLabel);
    const deleteItem = useDelete(useDeleteApi, setItems, onEvent, deleteLabel);

    const handleAdd = (item: T) => {
        if (item.id) {
            updateItem(item);
        } else {
            addItem(item);
        }
    };

    const editItem = (cat: T) => {
        setOpenDialog(true);
        setItem(cat);
    };

    const closeDialog = () => {
        setOpenDialog(false);
        setItem(null);
    };

    const handleOpenDeleteDialog = (item: IdNom) => {
        setItemToDelete(item);
        setOpenDeleteDialog(true);
    };

    const handleCloseDeleteDialog = () => {
        setOpenDeleteDialog(false);
    };

    const handleConfirmDelete = () => {
        if (itemToDelete?.id) {
            deleteItem(itemToDelete.id);
        }
        setItemToDelete(null);
        setOpenDeleteDialog(false);
    };

    return {
        item,
        setItem,
        openDialog,
        setOpenDialog,
        openDeleteDialog,
        setOpenDeleteDialog,
        itemToDelete,
        setItemToDelete,
        handleAdd,
        editItem,
        closeDialog,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete,
    };
};
