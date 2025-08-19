import { Badge, Button, IconButton, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField, Tooltip } from "@mui/material";
import { Produit } from "../models/Produit";
import { useContext, useEffect, useState } from "react";
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
import ClearIcon from '@mui/icons-material/Clear';
import { ProduitContext, ProduitFactureContext } from "./home";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { formatCustomDateFR } from "../tool";
import Snackbars from "./hooks/utilitaires/Snackbars";
import { useProduits } from "./services/produit.service";

interface ProduitProps {}

const Produits: React.FC<ProduitProps> = () => {

    const {produitsGlobal, setProduitsGlobal} = useContext(ProduitContext);
    const {setProduitsFactureGlobal} = useContext(ProduitFactureContext);

    const [modeEdition, setModeEdition] = useState(false);
    const [rechercheProduit, setRechercheProduit] = useState<string>(""); 
    const [query, setQuery] = useState("");
    const [produit, setProduit] = useState<Produit>();
    const {produits, setProduits, reloadProduits} = useProduits();
    const [openProduitDialog, setOpenProduitDialog] = useState(false);
    const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
    const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

    const [snackbar, setSnackbar] = useState<{ open: boolean; message: string }>({ open: false, message: "" });

    const navigate = useNavigate();

    const afficherSnackbar = (message: string) => {
        setSnackbar({ open: true, message });
    }   

    useEffect(() => {
        const timeOutId = setTimeout(() => rechercherProduits(query), 500);
        return () => clearTimeout(timeOutId);
    }, [query]);

    const handleAddProduit = (produit: Produit) => {
        if(produit.id){
            window.electronAPI.updateProduit(produit).then(() => {
                afficherSnackbar("Produit mis à jour");
                rechargerProduits();
            }).catch((err) => {
                window.electronAPI.logError(err);
            });
        } else {
            window.electronAPI.addProduit(produit).then(() => {
                afficherSnackbar("Produit enregistré");
                rechargerProduits();
            }).catch((err) => {
                window.electronAPI.logError(err);
            });
        }
    };

    /**
     * Duplique un produit en créant une nouvelle entrée avec les mêmes données
     * @param produit Produit à dupliquer
     */
    const duplicateProduit = (produit: Produit) => {
        const produitACreer: Produit = {...produit, id: null};
        handleAddProduit(produitACreer);
    }

    /**
     * Modifie un produit existant en ouvrant le dialog d'édition
     * @param produit Produit à éditer
     */
    const editProduit = (produit: Produit) => {
        setOpenProduitDialog(true);
        setProduit(produit);
    }

    /**
     * Ferme le dialog d'édition de produit
     */
    const closeProduit = () => {
        setOpenProduitDialog(false)
        setProduit(null);
    }

    /**
     * Ouvre le dialog de confirmation de suppression
     * @param item Item à supprimer
     */
    const handleOpenDialog = (item: IdNom) => {
        setItemToDelete(item);
        setOpenConfirmationDelete(true);
    };
  
    /**
     * Ferme le dialog de confirmation de suppression
     */
    const handleCloseDialog = () => {
        setOpenConfirmationDelete(false);
    };
  
    /**
     * Supprime un produit après confirmation de l'utilisateur puis recharge la liste des produits
     */
    const handleConfirmDelete = () => {
        window.electronAPI.deleteProduit(itemToDelete.id).then(() => {
            afficherSnackbar("Produit supprimé");
            rechargerProduits();
        }).catch((err) => {
            window.electronAPI.logError(err);
        });
        setItemToDelete(null);
        setOpenConfirmationDelete(false);
    };

    /**
     * Recherche des produits en fonction de la requête
     * @param query Requête de recherche
     */
    const rechercherProduits = (query: string) => {
        setRechercheProduit(query);

        window.electronAPI.rechercherProduits(query).then((result) => {
            setProduits(result);
        }).catch((err) => {
            window.electronAPI.logError(err);
        });
    };

    /**
     * Recharger la liste des produits ou effectuer une recherche si une chaîne est spécifiée
     */
    const rechargerProduits = () => {
        if(rechercheProduit.length === 0) {
            reloadProduits();
        } else {
            rechercherProduits(rechercheProduit);
        }
    }

    /**
     * Change le mode d'édition des produits
     */
    const changeModeEdition = () => {
        setModeEdition(!modeEdition);
    }

    /**
     * Ajoute un produit au panier ou le retire s'il est déjà présent
     * @param produit Produit à ajouter ou retirer du panier
     */
    const ajouterPanier = (produit: Produit) => {
        const indexProduit = produitsGlobal.findIndex((produitPanier: Produit) => produitPanier.id === produit.id);

        if (indexProduit !== -1) {
            const nouveauPanier = [...produitsGlobal];
            nouveauPanier.splice(indexProduit, 1);
            setProduitsGlobal(nouveauPanier);
        } else {
            const produits = [...produitsGlobal, produit];
            setProduitsGlobal(produits);
        }
    }

    /**
     * Vide le panier en supprimant tous les produits du panier
     * et les produits de la facture
     */
    const viderPanier = () => {
        setProduitsGlobal([]);
        setProduitsFactureGlobal([]);
    }

    /**
     * Navigue vers la page de la facture
     */
    const goPageFacture = () => {
        navigate('/panier');
    }

    /**
     * Vérifie si un produit est déjà sélectionné dans le panier
     * @param id Identifiant du produit à vérifier
     * @returns 
     */
    const produitSelected = (id: number): boolean => {
        return produitsGlobal.find((produit: Produit) => produit.id === id) !== undefined;
    }
    
    return (
        <div>
            <div className="flex">
                <div className={'w-50 panier'}>
                    <Tooltip title="Panier" arrow>
                        <Badge badgeContent={produitsGlobal.length} color="primary" style={{cursor: "pointer"}} onClick={() => goPageFacture()}>
                            <Inventory2OutlinedIcon color="action"/>
                        </Badge>
                    </Tooltip>
                </div>
                <div className={'w-50 right'}>
                    <Tooltip title="Vider le panier" arrow>
                        <IconButton aria-label="panier" size="large" onClick={() => viderPanier()}>
                           <ClearIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                    <Tooltip title="Ajouter un produit" arrow>
                        <IconButton aria-label="add" size="large" onClick={() => setOpenProduitDialog(true)}>
                            <AddIcon fontSize="inherit" />
                        </IconButton>
                    </Tooltip>
                </div>
            </div>
          
            <TextField 
                style={{backgroundColor:"white"}}
                margin="dense"
                label="Rechercher par produit / catégorie / fournisseur"
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
                               
                                <TableCell align="right">
                                    <Tooltip title={formatCustomDateFR(produit.dateMajPrix)} arrow placement="left"> 
                                        <span>
                                            {produit.prixAchat?.toFixed(2)}
                                       </span>
                                    </Tooltip>
                                </TableCell>
                               
                                <TableCell align="right">{produit.taux?.toString()}</TableCell>
                                <TableCell align="right">{produit.prixVente?.toFixed(2)}</TableCell>
                                <TableCell align="right">{produit.fournisseurNom}</TableCell>
                                <TableCell align="right">{produit.categorieNom}</TableCell>
                                <TableCell align="right">{produit.uniteNom}</TableCell>
                                <TableCell align="right">
                                    {modeEdition && 
                                    <>
                                        <Tooltip title="Dupliquer un produit" arrow>
                                            <IconButton aria-label="duplicate" size="large" onClick={() => duplicateProduit(produit)}>
                                                <ContentCopyIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Modifier un produit" arrow>
                                            <IconButton aria-label="update" size="large" onClick={() => editProduit(produit)}>
                                                <EditIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Supprimer un produit" arrow>
                                            <IconButton aria-label="delete" size="large" onClick={() => handleOpenDialog(produit)}>
                                                <DeleteIcon fontSize="inherit" />
                                            </IconButton>
                                        </Tooltip>
                                    </>}
                                    {!modeEdition && 
                                    <>
                                        <Tooltip title="Ajouter au panier" arrow>
                                            <IconButton aria-label="panier" size="large" onClick={() => ajouterPanier(produit)}>
                                                {produitSelected(produit.id) ? <BookmarkIcon fontSize="inherit" /> : <BookmarkBorderIcon fontSize="inherit" />}
                                            </IconButton>
                                        </Tooltip>
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
            <Snackbars
                open={snackbar.open}
                message={snackbar.message}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                />
        </div>
  );
}
  
export default Produits;