import { Badge, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from "@mui/material";
import { Produit } from "../models/Produit";
import { useEffect, useState } from "react";
import { IdNom } from "../models/IdNom";
import AddIcon from '@mui/icons-material/Add';
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import EditProduitDialog from "./dialogs/EditProduitDialog";
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import BookmarkBorderIcon from '@mui/icons-material/BookmarkBorder';
import { useNavigate } from "react-router-dom";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import BookmarkIcon from '@mui/icons-material/Bookmark';

interface ProduitProps {}

const Produits: React.FC<ProduitProps> = () => {

    const [modeEdition, setModeEdition] = useState(false);
    const [query, setQuery] = useState("");
    const [produit, setProduit] = useState<Produit>();
    const [produits, setProduits] = useState<Produit[]>([]);
    const [openProduitDialog, setOpenProduitDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);
    const [panier, setPanier] = useState<Produit[]>([]);

    const navigate = useNavigate();

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

    const changeModeEdition = () => {
        setModeEdition(!modeEdition);
    }

    const ajouterPanier = (produit: Produit) => {
        setPanier([...panier, produit]);
    }

    const goPageFacture = () => {
        navigate('/panier', { state: {panier} });
    }

    const produitSelected = (id: number) => {
        return panier.find(produit => produit.id === id) !== undefined;
    }
    
    useEffect(() => {
        const timeOutId = setTimeout(() => rechercherProduits(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    return (
        <div>
            <div className="flex">
                <div className={'w-50 panier'}>
                    <Badge badgeContent={panier.length} color="primary" style={{cursor: "pointer"}}>
                        <Inventory2OutlinedIcon color="action" onClick={() => goPageFacture()}/>
                    </Badge>
                </div>
                <div className={'w-50 right'}>
                    <IconButton aria-label="add" size="large" onClick={() => setOpenProduitDialog(true)}>
                        <AddIcon fontSize="inherit" />
                    </IconButton>
                </div>
            </div>
          
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
            <TableContainer component={Paper} style={{ overflowX: "initial" }}>
                <Table stickyHeader={true} sx={{ minWidth: 650 }} aria-label="sticky table">
                    <TableHead>
                        <TableRow>
                            <TableCell style={{ fontWeight: 600, minWidth: 200}} >Nom</TableCell>
                            <TableCell style={{ fontWeight: 600}} align="right">Prix achat</TableCell>
                            <TableCell style={{ fontWeight: 600}} align="right">Taux</TableCell>
                            <TableCell style={{ fontWeight: 600}} align="right">Prix vente</TableCell>
                            <TableCell style={{ fontWeight: 600}} align="right">Fournisseur</TableCell>
                            <TableCell style={{ fontWeight: 600}} align="right">Categorie</TableCell>
                            <TableCell style={{ fontWeight: 600}} align="right">Unité</TableCell>
                            <TableCell style={{ maxWidth: 100 }} align="right">
                                <Button variant="outlined" onClick={() => changeModeEdition()}>{modeEdition ? <>Sélection</> : <>Édition</>}</Button>
                            </TableCell>
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
                                <TableCell align="right">{produit.categorieNom}</TableCell>
                                <TableCell align="right">{produit.uniteNom}</TableCell>
                                <TableCell align="right">
                                    {modeEdition && 
                                    <>
                                        <IconButton aria-label="add" size="large" onClick={() => editProduit(produit)}>
                                            <EditIcon fontSize="inherit" />
                                        </IconButton>
                                        <IconButton aria-label="add" size="large" onClick={() => handleOpenDialog(produit)}>
                                            <DeleteIcon fontSize="inherit" />
                                        </IconButton>
                                    </>}
                                    {!modeEdition && 
                                    <>
                                        <IconButton aria-label="add" size="large" onClick={() => ajouterPanier(produit)}>
                                            {produitSelected(produit.id) ? <BookmarkIcon fontSize="inherit" /> : <BookmarkBorderIcon fontSize="inherit" />}
                                        </IconButton>
                                    </>}
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