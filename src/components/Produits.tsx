import { Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow } from "@mui/material";
import { Produit } from "./models/Produit";

interface ProduitProps {
    produits: Produit[];
  }

const Produits: React.FC<ProduitProps> = ({ produits }) => {
//export default function Produits(produits: Produit[]) {
    return (
      <TableContainer component={Paper}>
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
                key={produit.nom}
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
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    );
  }

export default Produits;