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
  message: string;
  type: TypeAlert;
}

interface AlerteDialogProps {
  open: boolean;
  onClose: () => void;
  data: DataDialog;
}

const AlerteDialog: React.FC<AlerteDialogProps> = ({ open, onClose, data }) => {
  return (
    data && <Dialog open={open} onClose={onClose} aria-modal>
      <DialogTitle>Information importante</DialogTitle>
      <DialogContent>
        <Alert severity={data.type}>
          {data.message}
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
