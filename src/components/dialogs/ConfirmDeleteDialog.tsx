import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button
} from '@mui/material';
import { IdNom } from '../../models/IdNom';

interface ConfirmDeleteDialogProps {
    open: boolean;
    onClose: () => void;
    onConfirm: () => void;
    itemName: IdNom;
}

const ConfirmDeleteDialog : React.FC<ConfirmDeleteDialogProps> = ({ open, onClose, onConfirm, itemName }) => {
  return (
    itemName && <Dialog open={open} onClose={onClose} aria-modal>
      <DialogTitle>Confirmer la suppression</DialogTitle>
      <DialogContent>
        <DialogContentText>
          Êtes-vous sûr de vouloir supprimer <strong>{itemName.nom}</strong> ? Cette action est irréversible.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Annuler
        </Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Supprimer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
