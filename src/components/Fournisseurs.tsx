import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Fournisseur } from "../models/Fournisseur";
import { useEffect, useState } from "react";
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface FournisseurProps {} 

const Fournisseurs: React.FC<FournisseurProps> = () => {

    const [fournisseur, setFournisseur] = useState<Fournisseur>();
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [openFournisseurDialog, setOpenFournisseurDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    useEffect(() => {
        window.electronAPI.getFournisseurs().then((result) => {
            setFournisseurs(result);
        }).catch((err) => {
          console.error(err);
        });
    }, []);

    const handleAddFournisseur = (fournisseur: Fournisseur) => {
        if(fournisseur.id){
            window.electronAPI.updateFournisseur(fournisseur.id, fournisseur.nom).then((result) => {
                setFournisseurs(result);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            window.electronAPI.addFournisseur(fournisseur.nom).then((result) => {
                setFournisseurs(result);
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const editFournisseur = (cat: Fournisseur) => {
        setOpenFournisseurDialog(true);
        setFournisseur(cat);
    }

    const closeFournisseur = () => {
        setOpenFournisseurDialog(false)
        setFournisseur(null);
    }

    const handleOpenDialog = (item: IdNom) => {
        setItemToDelete(item);
        setOpenConfirmationDelete(true);
      };
    
      const handleCloseDialog = () => {
        setOpenConfirmationDelete(false);
      };
    
      const handleConfirmDelete = () => {
        window.electronAPI.deleteFournisseur(itemToDelete.id).then((result) => {
            setFournisseurs(result);
        }).catch((err) => {
            console.error(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
      };
      
    return (
        <div>
            <IconButton aria-label="add" size="large" onClick={() => setOpenFournisseurDialog(true)}>
                <AddIcon fontSize="inherit" />
            </IconButton>
            <IdNomDialog
                open={openFournisseurDialog}
                onClose={() => closeFournisseur()}
                onAdd={handleAddFournisseur}
                objetToEdit={fournisseur}
            />
            <ConfirmDeleteDialog
                open={openConfirmationDelete}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete}
            />
            {fournisseurs && <TableContainer component={Paper}>
                <Table sx={{ minWidth: 650 }} aria-label="simple table">
                <TableHead>
                    <TableRow>
                        <TableCell style={{ fontWeight: 600}}>Nom</TableCell>
                        <TableCell align="right"></TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {fournisseurs.map((fournisseur) => (
                    <TableRow
                        key={fournisseur.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {fournisseur.nom}
                        </TableCell>
                        <TableCell align="right">
                            <IconButton aria-label="add" size="large" onClick={() => editFournisseur(fournisseur)}>
                                <EditIcon fontSize="inherit" />
                            </IconButton>
                            <IconButton aria-label="add" size="large" onClick={() => handleOpenDialog(fournisseur)}>
                                <DeleteIcon fontSize="inherit" />
                            </IconButton>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>}
        </div>
    );
  }

  export default Fournisseurs;