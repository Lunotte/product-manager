import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { useState } from "react";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";
import { CrudProps, useAdd, useDelete, useUpdate } from "./services/utile.service";

export function CrudTable<T extends IdNom>({
    label,
    items,
    setItems,
    useAddApi,
    useUpdateApi,
    useDeleteApi,
    onEvent,
    addLabel,
    updateLabel,
    deleteLabel
}: CrudProps<T>) {
    const [item, setItem] = useState<T>();
    const [openDialog, setOpenDialog] = useState(false);
    const [openDeleteDialog, setOpenDeleteDialog] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    const addItem = useAdd(useAddApi, setItems, onEvent, addLabel);
    const updateItem = useUpdate(useUpdateApi, setItems, onEvent, updateLabel);
    const deleteItem = useDelete(useDeleteApi, setItems, onEvent, deleteLabel);

    const handleAdd = (item: T) => {
        if (item.id) {
            updateItem(item.id, item.nom);
        } else {
            addItem(item.nom);
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

    return (
        <div>
            <div className={'right mr-20'}>
                <Tooltip title={`Ajouter ${label}`} arrow>
                    <IconButton aria-label="add" size="large" onClick={() => setOpenDialog(true)}>
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </div>
            <IdNomDialog
                open={openDialog}
                onClose={closeDialog}
                onAdd={handleAdd}
                objetToEdit={item}
            />
            <ConfirmDeleteDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete}
            />
            {items && <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 600 }}>Nom</TableCell>
                            <TableCell align="right"></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {items.map((item) => (
                            <TableRow
                                key={item.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {item.nom}
                                </TableCell>
                                <TableCell align="right">
                                    <Tooltip title={`Modifier ${label}`} arrow>
                                        <IconButton aria-label="update" size="large" onClick={() => editItem(item)}>
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title={`Supprimer ${label}`} arrow>
                                        <IconButton aria-label="delete" size="large" onClick={() => handleOpenDeleteDialog(item)}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>}
        </div>
    );
}

export default CrudTable;