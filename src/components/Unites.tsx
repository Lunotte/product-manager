import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Unite } from "../models/Unite";
import { useEffect, useState } from "react";
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";

interface UniteProps {
    // unites: Unite[];
} 

const Unites: React.FC<UniteProps> = () => {

    const [unite, setUnite] = useState<Unite>();
    const [unites, setUnites] = useState<Unite[]>([]);
    const [openUniteDialog, setOpenUniteDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    useEffect(() => {
        window.electronAPI.getUnites().then((result) => {
            console.log(result);
            setUnites(result);
        }).catch((err) => {
          console.error(err);
        });
    }, []);

    const handleAddUnite = (unite: Unite) => {
        if(unite.id){
            window.electronAPI.updateUnite(unite.id, unite.nom).then((result) => {
                setUnites(result);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            window.electronAPI.addUnite(unite.nom).then((result) => {
                setUnites(result);
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const editUnite = (cat: Unite) => {
        setOpenUniteDialog(true);
        setUnite(cat);
    }

    const closeUnite = () => {
        setOpenUniteDialog(false)
        setUnite(null);
    }

    const handleOpenDialog = (item: IdNom) => {
        setItemToDelete(item);
        setOpenConfirmationDelete(true);
      };
    
      const handleCloseDialog = () => {
        setOpenConfirmationDelete(false);
      };
    
      const handleConfirmDelete = () => {
        window.electronAPI.deleteUnite(itemToDelete.id).then((result) => {
            setUnites(result);
        }).catch((err) => {
            console.error(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
      };
      
    return (
        <div>
            <Button onClick={() => setOpenUniteDialog(true)}>Ajouter Unite</Button>
            <IdNomDialog
                open={openUniteDialog}
                onClose={() => closeUnite()}
                onAdd={handleAddUnite}
                objetToEdit={unite}
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
                    <TableCell>Nom</TableCell>
                    <TableCell align="right">Action</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {unites.map((unite) => (
                    <TableRow
                        key={unite.nom}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {unite.nom}
                        </TableCell>
                        <TableCell align="right">
                            <Button onClick={() => editUnite(unite)}>Maj</Button>
                            <Button onClick={() => handleOpenDialog(unite)}>Supprimer</Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
  }

  export default Unites;