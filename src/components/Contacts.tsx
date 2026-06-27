import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import { useCallback, useEffect, useRef, useState } from "react";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditContactDialog from "./dialogs/EditContactDialog";
import { useContacts } from "./services/contact.service";
import { CrudEventProps, useCrudLogic } from "./services/utile.service";

const Contacts: React.FC<CrudEventProps> = ({ onEvent }) => {

    const [rechercheContact, setRechercheContact] = useState<string>("");
    const rechercheContactRef = useRef<string>("");

    const [query, setQuery] = useState<string>("");
    const { contacts, setContacts, reloadContacts } = useContacts();

    useEffect(() => {
        const timeOutId = setTimeout(() => rechercherContacts(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    useEffect(() => {
        // Pour garder la valeur actuelle de rechercheContact dans la ref, sinon problème avec le callback du hook
        rechercheContactRef.current = rechercheContact;
    }, [rechercheContact]);

    const rechercherContacts = (query: string) => {
        setRechercheContact(query);
        window.electronAPI.rechercherContacts(query).then((result) => {
            setContacts(result);
        }).catch((err) => {
            window.electronAPI.logError(err);
        });
    };

    /**
     * Recharge les contacts en fonction de la valeur actuelle de rechercheContact.
     * Si rechercheContact est vide, recharge tous les contacts.
     */
    const rechargerContacts = useCallback(() => {

        const currentRecherche = rechercheContactRef.current;

        if (!!currentRecherche) {
            rechercherContacts(currentRecherche);
        } else {
            reloadContacts();
        }
    }, [reloadContacts, rechercherContacts, query]);

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
        handleConfirmDelete,
    } =
        useCrudLogic(
            window.electronAPI.addContact,
            window.electronAPI.updateContact,
            window.electronAPI.deleteContact,
            setContacts,
            onEvent,
            "Contact ajouté",
            "Contact modifié",
            "Contact supprimé",
            rechargerContacts
        );

    return (
        <div>
            <div className={'right mr-20'}>
                <Tooltip title="Ajouter une unité" arrow>
                    <IconButton aria-label="add" size="large" onClick={() => setOpenDialog(true)}>
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </div>
            <TextField
                style={{ backgroundColor: "white" }}
                margin="dense"
                label="Rechercher par nom / prénom"
                type="text"
                fullWidth
                onChange={event => setQuery(event.target.value)} />
            <EditContactDialog
                open={openDialog}
                onClose={() => closeDialog()}
                onAdd={handleAdd}
                contactToEdit={item}
            />
            <ConfirmDeleteDialog
                open={openDeleteDialog}
                onClose={handleCloseDeleteDialog}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete}
            />
            <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 600, width: "10%" }}>Civilité</TableCell>
                            <TableCell style={{ fontWeight: 600, width: "20%" }}>Nom</TableCell>
                            <TableCell style={{ fontWeight: 600, width: "20%" }}>Prénom</TableCell>
                            <TableCell style={{ fontWeight: 600, width: "20%" }}>Téléphone</TableCell>
                            <TableCell style={{ fontWeight: 600, width: "15%" }}>Ville</TableCell>
                            <TableCell style={{ width: "15%" }}></TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {contacts.map((contact, index) => (
                            <TableRow
                                key={`${contact.nom}-${index}`}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">
                                    {contact.civilite}
                                </TableCell>
                                <TableCell>{contact.nom}</TableCell>
                                <TableCell>{contact.prenom}</TableCell>
                                <TableCell>{contact.telephone}</TableCell>
                                <TableCell>{contact.ville}</TableCell>
                                <TableCell align="right">
                                    <Tooltip title="Modifier une unité" arrow>
                                        <IconButton aria-label="update" size="large" onClick={() => editItem(contact)}>
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Supprimer une unité" arrow>
                                        <IconButton aria-label="delete" size="large" onClick={() => handleOpenDeleteDialog(contact)}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
}

export default Contacts;
