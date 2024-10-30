import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Contact } from "../models/Contact";
import { useEffect, useState } from "react";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import EditContactDialog from "./dialogs/EditContactDialog";

const Contacts = () => {

    const [contact, setContact] = useState<Contact>();
    const [contacts, setContacts] = useState<Contact[]>([]);
    const [openContactDialog, setOpenContactDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    useEffect(() => {
        window.electronAPI.getContacts().then((result) => {
            setContacts(result);
        }).catch((err) => {
          console.error(err);
        });
    }, []);

    const handleAddContact = (contact: Contact) => {
        
        if(contact.id){
            window.electronAPI.updateContact(contact).then((result) => {
                setContacts(result);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            window.electronAPI.addContact(contact).then((result) => {
                setContacts(result);
            }).catch((err) => {
                console.error(err);
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
        window.electronAPI.deleteContact(itemToDelete.id).then((result) => {
            setContacts(result);
        }).catch((err) => {
            console.error(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
      };
      
    return (
        <div>
             <div className={'right mr-20'}>
                <Tooltip title="Ajouter une unité" arrow>
                    <IconButton aria-label="add" size="large" onClick={() => setOpenContactDialog(true)}>
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </div>
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
                        <TableCell style={{ fontWeight: 600}}>Nom</TableCell>
                        <TableCell style={{ fontWeight: 600}}>Adresse</TableCell>
                        <TableCell style={{ fontWeight: 600}}>Adresse Complémentaire</TableCell>
                        <TableCell style={{ fontWeight: 600}}>Code Postal</TableCell>
                        <TableCell style={{ fontWeight: 600}}>Ville</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {contacts.map((contact) => (
                    <TableRow
                        key={contact.nom}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                            {contact.nom}
                        </TableCell>
                        <TableCell align="right">{contact.adresse}</TableCell>
                        <TableCell align="right">{contact.adresse_bis}</TableCell>
                        <TableCell align="right">{contact.cp.toString()}</TableCell>
                        <TableCell align="right">{contact.ville}</TableCell>
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