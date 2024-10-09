import React, { useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';

const CategorieDialog = ({ open, onClose, onAdd }: any) => {
  const [categoryName, setCategoryName] = useState('');

  const handleAdd = () => {
    onAdd(categoryName);
    setCategoryName('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Ajouter une Catégorie</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Nom de la Catégorie"
          type="text"
          fullWidth
          value={categoryName}
          onChange={(event: any) => setCategoryName(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Annuler</Button>
        <Button onClick={handleAdd}>Ajouter</Button>
      </DialogActions>
    </Dialog>
  );
};

export default CategorieDialog;