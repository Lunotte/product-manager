import { IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Tooltip } from "@mui/material";
import { Unite } from "../models/Unite";
import { useEffect, useState } from "react";
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

interface UniteProps {} 

const Unites: React.FC<UniteProps> = () => {

    const [unite, setUnite] = useState<Unite>();
    const [unites, setUnites] = useState<Unite[]>([]);
    const [openUniteDialog, setOpenUniteDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    useEffect(() => {
        window.electronAPI.getUnites().then((result) => {
            setUnites(result);
        }).catch((err) => {
            window.electronAPI.logError(err);
        });
    }, []);

    const handleAddUnite = (unite: Unite) => {
        if(unite.id){
            window.electronAPI.updateUnite(unite.id, unite.nom).then((result) => {
                setUnites(result);
            }).catch((err) => {
                window.electronAPI.logError(err);
            });
        } else {
            window.electronAPI.addUnite(unite.nom).then((result) => {
                setUnites(result);
            }).catch((err) => {
                window.electronAPI.logError(err);
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
            window.electronAPI.logError(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
    };
      
    return (
        <div>
             <div className={'right mr-20'}>
                <Tooltip title="Ajouter une unité" arrow>
                    <IconButton aria-label="add" size="large" onClick={() => setOpenUniteDialog(true)}>
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </Tooltip>
            </div>
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
                        <TableCell style={{ fontWeight: 600}}>Nom</TableCell>
                        <TableCell align="right"></TableCell>
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
                            <Tooltip title="Modifier une unité" arrow>
                                <IconButton aria-label="update" size="large" onClick={() => editUnite(unite)}>
                                    <EditIcon fontSize="inherit" />
                                </IconButton>
                            </Tooltip>
                            <Tooltip title="Supprimer une unité" arrow>
                                <IconButton aria-label="delete" size="large" onClick={() => handleOpenDialog(unite)}>
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

  export default Unites;