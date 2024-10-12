import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { IdNom } from '../../models/IdNom';

interface IdNomDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (objet: IdNom) => void;
  objetToEdit?: IdNom;
}

const IdNomDialog: React.FC<IdNomDialogProps> = ({ open, onClose, onAdd, objetToEdit }) => {
  const [objetName, setObjetName] = useState('');
  const [edition, setEdition] = useState(false);

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
    onClose();
    setObjetName('');
    setEdition(false);
  };

  return (
    <Dialog open={open} onClose={onClose} aria-modal>
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
        <Button variant="outlined" onClick={onClose}>Annuler</Button>
        <Button variant="outlined" type="submit" onClick={handleAdd}>{edition ? <span>Modifier</span> : <span>Ajouter</span> }</Button>
      </DialogActions>
    </Dialog>
  );
};

export default IdNomDialog;