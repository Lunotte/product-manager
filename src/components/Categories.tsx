import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Categorie } from "../models/Categorie";
import { useEffect, useState } from "react";
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import { IdNom } from "../models/IdNom";

interface CategorieProps {
} 

const Categories: React.FC<CategorieProps> = () => {

    const [categorie, setCategorie] = useState<Categorie>();
    const [categories, setCategories] = useState<Categorie[]>([]);
    const [openCategorieDialog, setOpenCategorieDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    useEffect(() => {
        window.electronAPI.getCategories().then((result) => {
            console.log(result);
            setCategories(result);
        }).catch((err) => {
          console.error(err);
        });
    }, []);

    const handleAddCategorie = (categorie: Categorie) => {
        if(categorie.id){
            window.electronAPI.updateCategorie(categorie.id, categorie.nom).then((result) => {
                setCategories(result);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            window.electronAPI.addCategorie(categorie.nom).then((result) => {
                setCategories(result);
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const editCategorie = (cat: Categorie) => {
        setOpenCategorieDialog(true);
        setCategorie(cat);
    }

    const closeCategorie = () => {
        setOpenCategorieDialog(false)
        setCategorie(null);
    }

    const handleOpenDialog = (item: IdNom) => {
        setItemToDelete(item);
        setOpenConfirmationDelete(true);
      };
    
      const handleCloseDialog = () => {
        setOpenConfirmationDelete(false);
      };
    
      const handleConfirmDelete = () => {
        window.electronAPI.deleteCategorie(itemToDelete.id).then((result) => {
            setCategories(result);
        }).catch((err) => {
            console.error(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
      };
      
    return (
        <div>
            <Button onClick={() => setOpenCategorieDialog(true)}>Ajouter Catégorie</Button>
            <IdNomDialog
                open={openCategorieDialog}
                onClose={() => closeCategorie()}
                onAdd={handleAddCategorie}
                objetToEdit={categorie}
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
                    {categories.map((categorie) => (
                    <TableRow
                        key={categorie.id}
                        sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                    >
                        <TableCell component="th" scope="row">
                        {categorie.nom}
                        </TableCell>
                        <TableCell align="right">
                            <Button onClick={() => editCategorie(categorie)}>Maj</Button>
                            <Button onClick={() => handleOpenDialog(categorie)}>Supprimer</Button>
                        </TableCell>
                    </TableRow>
                    ))}
                </TableBody>
                </Table>
            </TableContainer>
        </div>
    );
  }

  export default Categories;