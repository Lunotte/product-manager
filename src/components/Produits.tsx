import { Button, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Produit } from "../models/Produit";
import { useEffect, useState } from "react";
import { IdNom } from "../models/IdNom";
import IdNomDialog from "./dialogs/IdNomDialog";
import ConfirmDeleteDialog from "./dialogs/ConfirmDeleteDialog";
import EditProduitDialog from "./dialogs/EditProduitDialog";

interface ProduitProps {
   // produits: Produit[];
  }

const Produits: React.FC<ProduitProps> = () => {


  const [produit, setProduit] = useState<Produit>();
  const [produits, setProduits] = useState<Produit[]>([]);
  const [openProduitDialog, setOpenProduitDialog] = useState(false);
  const [openConfirmationDelete, setOpenConfirmationDelete] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<IdNom>(null);

  useEffect(() => {
      window.electronAPI.getProduits().then((result) => {
          console.log(result);
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
          window.electronAPI.addProduit(produit.nom).then((result) => {
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
    
  return (
      <div>
          <Button onClick={() => setOpenProduitDialog(true)}>Ajouter Produit</Button>
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
          {produits && <TableContainer component={Paper}>
              <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
              <TableRow>
                <TableCell>Nom</TableCell>
                <TableCell align="right">Prix achat</TableCell>
                <TableCell align="right">Prix vente</TableCell>
                <TableCell align="right">Fournisseur</TableCell>
                <TableCell align="right">Unité</TableCell>
                <TableCell align="right">Categorie</TableCell>
            </TableRow>
              </TableHead>
              <TableBody>
                  {produits.map((produit) => (
                  <TableRow
                      key={produit.id}
                      sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                  >
                      <TableCell component="th" scope="row">
                      {produit.nom}
                      </TableCell>
                      <TableCell align="right">{produit.prixAchat}</TableCell>
                      <TableCell align="right">{produit.prixVente}</TableCell>
                      <TableCell align="right">{produit.fournisseurId}</TableCell>
                      <TableCell align="right">{produit.uniteId}</TableCell>
                      <TableCell align="right">{produit.categorieId}</TableCell>
                      <TableCell align="right">
                          <Button onClick={() => editProduit(produit)}>Maj</Button>
                          <Button onClick={() => handleOpenDialog(produit)}>Supprimer</Button>
                      </TableCell>
                  </TableRow>
                  ))}
              </TableBody>
              </Table>
          </TableContainer>}
      </div>
  );
}
  
  //   return (
  //     <TableContainer component={Paper}>
  //       <Table sx={{ minWidth: 650 }} aria-label="simple table">
  //         <TableHead>
  //           <TableRow>
  //             <TableCell>Nom</TableCell>
  //             <TableCell align="right">Prix achat</TableCell>
  //             <TableCell align="right">Prix vente</TableCell>
  //             <TableCell align="right">Produit</TableCell>
  //             <TableCell align="right">Unité</TableCell>
  //             <TableCell align="right">Categorie</TableCell>
  //           </TableRow>
  //         </TableHead>
  //         <TableBody>
  //           {produits.map((produit) => (
  //             <TableRow
  //               key={produit.nom}
  //               sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
  //             >
  //               <TableCell component="th" scope="row">
  //                 {produit.nom}
  //               </TableCell>
  //               <TableCell align="right">{produit.prixAchat}</TableCell>
  //               <TableCell align="right">{produit.prixVente}</TableCell>
  //               <TableCell align="right">{produit.produitId}</TableCell>
  //               <TableCell align="right">{produit.uniteId}</TableCell>
  //               <TableCell align="right">{produit.categorieId}</TableCell>
  //             </TableRow>
  //           ))}
  //         </TableBody>
  //       </Table>
  //     </TableContainer>
  //   );
  // }

export default Produits;