import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { Categorie } from '../models/Categorie';
import { IdNom } from '../models/IdNom';

interface IdNomDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (objet: IdNom) => void;
  objetToEdit?: IdNom; // Optionnel pour l'édition
}

const IdNomDialog: React.FC<IdNomDialogProps> = ({ open, onClose, onAdd, objetToEdit }) => {
  const [objetName, setObjetName] = useState('');
  const [edition, setEdition] = useState(false);

  console.log(objetToEdit);

  useEffect(() => {
    if (objetToEdit) {
      setObjetName(objetToEdit.nom || '');
      setEdition(true);
    } else {
      setObjetName('');
      setEdition(false);
    }
  }, [objetToEdit]);
  

  const handleAdd = () => {
    let objet: IdNom;
    if(objetToEdit) {
      objet = {...objetToEdit, nom: objetName}
    } else {
      objet = {id: null, nom: objetName};
    }
    onAdd(objet);
    setObjetName('');
    setEdition(false);
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      {edition && <DialogTitle>Modifier</DialogTitle>}
      {!edition && <DialogTitle>Ajouter</DialogTitle>}
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom"
          type="text"
          fullWidth
          value={objetName}
          onChange={(event: any) => setObjetName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleAdd}>{edition ? <span>Ajouter</span> : <span>Modifier</span> }</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdNomDialog;