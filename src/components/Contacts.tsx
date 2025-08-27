import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import { Contact } from "../models/Contact";
import { useEffect, useState } from "react";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditContactDialog from "./dialogs/EditContactDialog";
import { useContacts } from "./services/contact.service";
import { CrudEventProps, useAdd, useDelete, useUpdate } from "./services/utile.service";

const Contacts: React.FC<CrudEventProps> = ({ onEvent }) => {

    const [contact, setContact] = useState<Contact>();
    const [rechercheContact, setRechercheContact] = useState<string>("");
    const [query, setQuery] = useState("");
    const { contacts, setContacts, reloadContacts } = useContacts();
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);


    const addContact = useAdd(window.electronAPI.addContact, setContacts, onEvent, "Contact ajouté");
    const updateContact = useUpdate(window.electronAPI.updateContact, setContacts, onEvent, "Contact modifié");
    const deleteItem = useDelete(window.electronAPI.deleteContact, setContacts, onEvent, "Contact supprimé");

    const rechercherContacts = (query: string) => {
        setRechercheContact(query);

        window.electronAPI.rechercherContacts(query).then((result) => {
            setContacts(result);
        }).catch((err) => {
            window.electronAPI.logError(err);
        });
    };

    const rechargerContacts = () => {
        if (rechercheContact.length === 0) {
            reloadContacts();
        } else {
            rechercherContacts(rechercheContact);
        }
    }

    const handleAddContact = (contact: Contact) => {
        if (contact.id) {
            window.electronAPI.updateContact(contact).then(() => {
                onEvent({ type: 'update', message: "Contact modifié" });
                rechargerContacts();
            }).catch((err) => {
                window.electronAPI.logError(err);
            });
        } else {
            window.electronAPI.addContact(contact).then(() => {
                onEvent({ type: 'add', message: "Contact ajouté" });
                rechargerContacts();
            }).catch((err) => {
                window.electronAPI.logError(err);
            });
        }
    };

    const editContact = (contact: Contact) => {
        setOpenContactDialog(true);
        setContact(contact);
    }

    const closeContact = () => {
        setOpenContactDialog(false)
        setContact(null);
    }

    const handleOpenDialog = (item: IdNom) => {
        setItemToDelete(item);
        setOpenConfirmationDelete(true);
    };

    const handleCloseDialog = () => {
        setOpenConfirmationDelete(false);
    };

    const handleConfirmDelete = () => {
        window.electronAPI.deleteContact(itemToDelete.id).then(() => {
            rechargerContacts();
            onEvent({ type: 'delete', message: "Contact supprimé" });
        }).catch((err) => {
            window.electronAPI.logError(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
    };

    useEffect(() => {
        const timeOutId = setTimeout(() => rechercherContacts(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    return (
        <div>
            <div className={'right mr-20'}>
                <Tooltip title="Ajouter une unité" arrow>
                    <IconButton aria-label="add" size="large" onClick={() => setOpenContactDialog(true)}>
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
                open={openContactDialog}
                onClose={() => closeContact()}
                onAdd={handleAddContact}
                contactToEdit={contact}
            />
            <ConfirmDeleteDialog
                open={openConfirmationDelete}
                onClose={handleCloseDialog}
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
                        {contacts.map((contact) => (
                            <TableRow
                                key={contact.nom}
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
                                        <IconButton aria-label="update" size="large" onClick={() => editContact(contact)}>
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                    </Tooltip>
                                    <Tooltip title="Supprimer une unité" arrow>
                                        <IconButton aria-label="delete" size="large" onClick={() => handleOpenDialog(contact)}>
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
