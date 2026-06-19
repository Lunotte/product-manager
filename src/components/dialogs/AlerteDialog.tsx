import React from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button
} from '@mui/material';
import Alert from '@mui/material/Alert';

export type TypeAlert = "success" | "info" | "warning" | "error";

export type DataDialog = {
  // `message` peut être un texte unique ou une liste d'erreurs à afficher
  message: string | string[];
  type: TypeAlert;
}

interface AlerteDialogProps {
  open: boolean;
  onClose: () => void;
  data: DataDialog | null;
}

const AlerteDialog: React.FC<AlerteDialogProps> = ({ open, onClose, data }) => {
  return (
    data && <Dialog open={open} onClose={onClose} aria-modal>
      <DialogTitle>Information importante</DialogTitle>
      <DialogContent>
        <Alert severity={data.type}>
          {Array.isArray(data.message) ? (
            <div>
              <div>Liste des erreurs :</div>
              <ul>
                {data.message.map((msg, idx) => <li key={idx}>{msg}</li>)}
              </ul>
            </div>
          ) : (
            data.message
          )}
        </Alert>
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onClose} color="secondary">
          Fermer
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AlerteDialog;
