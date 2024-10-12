import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Categorie } from '../../models/Categorie';
import { IdNom } from '../../models/IdNom';
import { Fournisseur } from '../../models/Fournisseur';
import { Unite } from '../../models/Unite';
import { Produit } from '../../models/Produit';

interface EditProduitDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (produit: Produit) => void;
  produitToEdit?: Produit;
}

const IdNomDialog: React.FC<EditProduitDialogProps> = ({ open, onClose, onAdd, produitToEdit }) => {
  const [nom, setNom] = useState('');
  const [prixAchat, setPrixAchat] = useState('');
  const [prixVente, setPrixVente] = useState('');
  const [taux, setTaux] = useState(5.5);
  const [categorie, setCategorie] = useState('');
  const [fournisseur, setFournisseur] = useState('');
  const [unite, setUnite] = useState('');

  const [categories, setCategories] = useState<Categorie[]>([]);
  const [fournisseurs, setFournisseurs] = useState<Fournisseur[]>([]);
  const [unites, setUnites] = useState<Unite[]>([]);

  const [edition, setEdition] = useState(true);
  const [message, setMessage] = useState('');

  console.log(produitToEdit);

  useEffect(() => {
    window.electronAPI.getCategories().then((result) => {
      console.log(result);
      setCategories(result);
    }).catch((err) => {
      console.error(err);
    });

    window.electronAPI.getFournisseurs().then((result) => {
      console.log(result);
      setFournisseurs(result);
    }).catch((err) => {
      console.error(err);
    });

    window.electronAPI.getUnites().then((result) => {
      console.log(result);
      setUnites(result);
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  useEffect(() => {
    if (produitToEdit) {
      setNom(produitToEdit.nom || '');
      setPrixAchat(produitToEdit.prixAchat.toString());
      setPrixVente(produitToEdit.prixVente.toString());
      setCategorie(produitToEdit.categorieId.toString());
      setFournisseur(produitToEdit.fournisseurId.toString());
      setUnite(produitToEdit.uniteId.toString());
      setEdition(true);
    } else {
      reset();
    }
  }, [produitToEdit]);

  const reset = () => {
    setNom('');
    setPrixAchat('');
    setPrixVente('');
    setCategorie('');
    setFournisseur('');
    setUnite('');
    setEdition(false);
  }


  const onCloseDialog = () => {
    setMessage('');
    onClose();
  }

  const handleAdd = () => {
    if(!nom.trim() || !prixAchat || !prixVente || !taux || !categorie || !fournisseur || !unite){
      setMessage('Veuillez saisir tous les champs');
      return;
    }

    console.log(nom);
    console.log(prixAchat);
    console.log(prixVente);
    console.log(taux);
    console.log(categorie);
    console.log(fournisseur);
    console.log(unite);

    let produit: Produit;
    if(produitToEdit) {
      produit = {...produitToEdit, nom, prixAchat: parseInt(prixAchat), prixVente: parseInt(prixVente),
        categorieId: parseInt(categorie), fournisseurId: parseInt(fournisseur), uniteId: parseInt(unite)};
    } else {
      produit = {id: null, nom, prixAchat: parseInt(prixAchat), prixVente: parseInt(prixVente),
        categorieId: parseInt(categorie), fournisseurId: parseInt(fournisseur), uniteId: parseInt(unite)};
    }
    console.log(produit);
    
    onAdd(produit);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>

      {edition && <DialogTitle>Modifier</DialogTitle>}
      {!edition && <DialogTitle>Ajouter</DialogTitle>}
      <DialogContent>

      {message}


        <TextField
          required={true}
          autoFocus
          margin="dense"
          label="Nom"
          type="text"
          fullWidth
          value={nom}
          onChange={(event: any) => setNom(event.target.value)}
        />
        <TextField
          required={true}
          margin="dense"
          label="Prix d’achat"
          type="number"
          inputMode='decimal'
          fullWidth
          value={prixAchat}
          onChange={(event: any) => setPrixAchat(event.target.value)}
        />
        <TextField
          required={true}
          margin="dense"
          label="Prix de vente"
          type="number"
          inputMode='decimal'
          fullWidth
          value={prixVente}
          onChange={(event: any) => setPrixVente(event.target.value)}
        />
        <TextField
          required={true}
          margin="dense"
          label="Taux"
          type="number"
          inputMode='decimal'
          fullWidth
          value={taux}
          onChange={(event: any) => setTaux(event.target.value)}
        />
        <FormControl margin="normal" fullWidth>
          <InputLabel id="categorie-select-label">Categorie</InputLabel>
          <Select
            required={true}
            labelId="categorie-label"
            id="categorie-select"
            value={categorie}
            label="Categorie"
            onChange={(event: any) => setCategorie(event.target.value)}
          >
            {categories.map((categorie) => (
              <MenuItem key={categorie.id} value={categorie.id}>{categorie.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="fournisseur-select-label">Fournisseur</InputLabel>
          <Select
            required={true}
            labelId="fournisseur-label"
            id="fournisseur-select"
            value={fournisseur}
            label="Fournisseur"
            onChange={(event: any) => setFournisseur(event.target.value)}
          >
             {fournisseurs.map((fournisseur) => (
              <MenuItem key={fournisseur.id} value={fournisseur.id}>{fournisseur.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <FormControl margin="normal" fullWidth>
          <InputLabel id="unite-select-label">Unite</InputLabel>
          <Select
            required={true}
            labelId="unite-label"
            id="unite-select"
            value={unite}
            label="Unite"
            onChange={(event: any) => setUnite(event.target.value)}
          >
            {unites.map((unite) => (
              <MenuItem key={unite.id} value={unite.id}>{unite.nom}</MenuItem>
            ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCloseDialog}>Annuler</Button>
        <Button onClick={handleAdd}>{edition ? <span>Modifier</span> : <span>Ajouter</span> }</Button>
      </DialogActions>
    </Dialog> 
  );
};

export default IdNomDialog;