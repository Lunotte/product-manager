import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Produit } from "../models/Produit";
import { useEffect, useState } from "react";
import { IdNom } from "../models/IdNom";
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import EditProduitDialog from "./dialogs/EditProduitDialog";

interface ProduitProps {}

const Produits: React.FC<ProduitProps> = () => {

    const [query, setQuery] = useState("");
    const [produit, setProduit] = useState<Produit>();
    const [produits, setProduits] = useState<Produit[]>([]);
    const [openProduitDialog, setOpenProduitDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    useEffect(() => {
        window.electronAPI.getProduits().then((result) => {
            setProduits(result);
        }).catch((err) => {
            console.error(err);
        });
    }, []);

    const handleAddProduit = (produit: Produit) => {
        if(produit.id){
            window.electronAPI.updateProduit(produit).then((result) => {
                setProduits(result);
            }).catch((err) => {
                console.error(err);
            });
        } else {
            window.electronAPI.addProduit(produit).then((result) => {
                setProduits(result);
            }).catch((err) => {
                console.error(err);
            });
        }
    };

    const editProduit = (cat: Produit) => {
        setOpenProduitDialog(true);
        setProduit(cat);
    }

    const closeProduit = () => {
        setOpenProduitDialog(false)
        setProduit(null);
    }

    const handleOpenDialog = (item: IdNom) => {
        setItemToDelete(item);
        setOpenConfirmationDelete(true);
    };
  
    const handleCloseDialog = () => {
        setOpenConfirmationDelete(false);
    };
  
    const handleConfirmDelete = () => {
        window.electronAPI.deleteProduit(itemToDelete.id).then((result) => {
            setProduits(result);
        }).catch((err) => {
            console.error(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
    };

    const rechercherProduits = (query: string) => {
        window.electronAPI.rechercherProduits(query).then((result) => {
            setProduits(result);
        }).catch((err) => {
            console.error(err);
        });
    };
    
    useEffect(() => {
        const timeOutId = setTimeout(() => rechercherProduits(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    return (
        <div>
            <Button onClick={() => setOpenProduitDialog(true)}>Ajouter Produit</Button>
            <TextField 
                margin="dense"
                label="Rechercher"
                type="text"
                fullWidth
                onChange={event => setQuery(event.target.value)} />
            <EditProduitDialog
                open={openProduitDialog}
                onClose={() => closeProduit()}
                onAdd={handleAddProduit}
                produitToEdit={produit}
            />
            <ConfirmDeleteDialog
                open={openConfirmationDelete}
                onClose={handleCloseDialog}
                onConfirm={handleConfirmDelete}
                itemName={itemToDelete}
            />
            <TableContainer component={Paper}>
                <Table stickyHeader sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                        <TableRow>
                            <TableCell>Nom</TableCell>
                            <TableCell align="right" >Prix achat</TableCell>
                            <TableCell align="right">Taux</TableCell>
                            <TableCell align="right">Prix vente</TableCell>
                            <TableCell align="right">Fournisseur</TableCell>
                            <TableCell align="right">Unité</TableCell>
                            <TableCell align="right">Categorie</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {produits.length > 0 && produits.map((produit) => (
                            <TableRow
                                key={produit.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell component="th" scope="row">{produit.nom}</TableCell>
                                <TableCell align="right">{produit.prixAchat.toString()}</TableCell>
                                <TableCell align="right">{produit.taux.toString()}</TableCell>
                                <TableCell align="right">{produit.prixVente.toString()}</TableCell>
                                <TableCell align="right">{produit.fournisseurNom}</TableCell>
                                <TableCell align="right">{produit.uniteNom}</TableCell>
                                <TableCell align="right">{produit.categorieNom}</TableCell>
                                <TableCell align="right">
                                    <Button onClick={() => editProduit(produit)}>Maj</Button>
                                    <Button onClick={() => handleOpenDialog(produit)}>Supprimer</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                        {produits.length === 0 && 
                        <TableRow
                            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                            <TableCell component="th" scope="row">Aucun produit</TableCell>
                        </TableRow>}
                    </TableBody>
                </Table>
            </TableContainer>
        </div>
  );
}
  
export default Produits;