import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Fournisseur } from "../models/Fournisseur";
import { useEffect, useState } from "react";
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";

interface FournisseurProps {
    // fournisseurs: Fournisseur[];
} 

const Fournisseurs: React.FC<FournisseurProps> = () => {

    const [fournisseur, setFournisseur] = useState<Fournisseur>();
    const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
    const [openFournisseurDialog, setOpenFournisseurDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    useEffect(() => {
        window.electronAPI.getFournisseurs().then((result) => {
            console.log(result);
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
            <Button onClick={() => setOpenFournisseurDialog(true)}>Ajouter Fournisseur</Button>
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
                    <TableCell>Nom</TableCell>
                    <TableCell align="right">Action</TableCell>
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
                            <Button onClick={() => editFournisseur(fournisseur)}>Maj</Button>
                            <Button onClick={() => handleOpenDialog(fournisseur)}>Supprimer</Button>
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