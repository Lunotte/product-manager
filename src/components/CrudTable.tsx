import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";
import { CrudProps, useCrudLogic } from "./services/utile.service";

/**
 * Composant générique affichant une table CRUD pour des entités `IdNom`.
 * @param props Propriétés de configuration et callbacks fournis par `CrudProps`.
 */
export function CrudTable<T extends IdNom>(props: CrudProps<T>) {
    const {
        label, items, setItems,
        useAddApi, useUpdateApi, useDeleteApi,
        onEvent, addLabel, updateLabel, deleteLabel
    } = props;

    const {
        item,
        openDialog,
        setOpenDialog,
        openDeleteDialog,
        itemToDelete,
        handleAdd,
        editItem,
        closeDialog,
        handleOpenDeleteDialog,
        handleCloseDeleteDialog,
        handleConfirmDelete
    } =
        useCrudLogic(
            useAddApi,
            useUpdateApi,
            useDeleteApi,
            setItems,
            onEvent,
            addLabel,
            updateLabel,
            deleteLabel
        );

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
                        {items.map((item, index) => (
                            <TableRow
                                key={`${item.nom}-${index}`}
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