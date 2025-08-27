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
    successMessage: string,
    onReload?: () => void
) {
    return useCallback((item: T) => {
        apiAddFn(item).then((result) => {
            onEvent({ type: 'add', message: successMessage });
            if (onReload) {
                onReload();
            } else {
                setState(result);
            }
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
    successMessage: string,
    onReload?: () => void
) {
    return useCallback((item: T) => {
        apiUpdateFn(item).then((result) => {
            onEvent({ type: 'update', message: successMessage });
            if (onReload) {
                onReload();
            } else {
                setState(result);
            }
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
    successMessage: string,
    onReload?: () => void
) {
    return useCallback((id: number) => {
        apiDeleteFn(id).then((result) => {
            onEvent({ type: 'delete', message: successMessage });
            if (onReload) {
                onReload();
            } else {
                setState(result);
            }
        })
            .catch((err) => {
                window.electronAPI.logError(err);
            });
    }, [apiDeleteFn, setState, onEvent, successMessage]);
}

export function useQueryItems<T>(
    apiQueryItemsFn: (query: string) => Promise<T[]>,
    setState: (data: T[]) => void
) {

    return useCallback((query: string) => {
        apiQueryItemsFn(query).then((result) => {
            setState(result);
        })
            .catch((err) => {
                window.electronAPI.logError(err);
            });
    }, [apiQueryItemsFn, setState]);
}

export function useCrudLogic<T extends IdNom>(
    useAddApi: (item: T) => Promise<T[]>,
    useUpdateApi: (item: T) => Promise<T[]>,
    useDeleteApi: (id: number) => Promise<T[]>,
    setItems: (items: T[]) => void,
    onEvent: OnCrudEventType,
    addLabel: string,
    updateLabel: string,
    deleteLabel: string,
    onReload?: () => void
) {
    // const [queryItems, setQueryItems] = useState<string>("");
    // const [query, setQuery] = useState<string>("");

    const [item, setItem] = useState<T>();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    const addItem = useAdd(useAddApi, setItems, onEvent, addLabel, onReload);
    const updateItem = useUpdate(useUpdateApi, setItems, onEvent, updateLabel, onReload);
    const deleteItem = useDelete(useDeleteApi, setItems, onEvent, deleteLabel, onReload);
    // const queryItems = useQueryItems(useQueryItemsApi, setItems);

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

    // const reloadItems = useCallback(() => {
    //     if (options?.query && options?.apiQueryItemsFn) {
    //         options.apiQueryItemsFn(options.query)
    //             .then(setItems)
    //             .catch(window.electronAPI.logError);
    //     } else if (options?.apiQueryItemsFn) {
    //         options.apiQueryItemsFn()
    //             .then(setItems)
    //             .catch(window.electronAPI.logError);
    //     }
    // }, [options, setItems]);

    // const reloadItems = () => {
    //     if (queryItems.length === 0) {
    //         reloadContacts();
    //     } else {
    //         queryItems(queryItems);
    //     }
    // }

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
        // reloadItems
    };
};
