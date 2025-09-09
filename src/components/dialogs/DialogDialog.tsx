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
  message: string;
  type: string;
}

const ConfirmDeleteDialog: React.FC<ConfirmDeleteDialogProps> = ({ open, onClose, message, type }) => {
  return (
    message && <Dialog open={open} onClose={onClose} aria-modal>
      <DialogTitle>Message d’information</DialogTitle>
      <DialogContent>
        <DialogContentText>
          {message}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDeleteDialog;
