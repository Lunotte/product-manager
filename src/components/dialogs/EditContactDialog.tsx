import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { Contact } from '../../models/Contact';

interface EditContactDialogProps {
  open: boolean;
  onClose: () => void;
  onAdd: (contact: Contact) => void;
  contactToEdit?: Contact;
}

const EditContactDialog: React.FC<EditContactDialogProps> = ({ open, onClose, onAdd, contactToEdit }) => {
  const [nom, setNom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [adresse_bis, setAdresse_bis] = useState('');
  const [cp, setCp] = useState('');
  const [ville, setVille] = useState('');

  const [edition, setEdition] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setNom(contactToEdit.nom || '');
      setAdresse(contactToEdit.adresse);
      setAdresse_bis(contactToEdit.adresse_bis);
      setCp(contactToEdit.cp.toString());
      setVille(contactToEdit.ville);
      setEdition(true);
    } else {
      reset();
    }
  }, [contactToEdit]);

  const reset = () => {
    setNom('');
    setAdresse('');
    setAdresse_bis('');
    setCp('');
    setVille('');
    setEdition(false);
  }

  const onCloseDialog = () => {
    setMessage('');
    onClose();
    reset();
  }

  const handleAdd = () => {
    if(!nom.trim() || !adresse.trim() || !cp.trim() || !ville.trim()){
      setMessage('Veuillez saisir tous les champs');
      return;
    }

    let contact: Contact;
    if(contactToEdit) {
      contact = {...contactToEdit, nom, adresse, adresse_bis, cp: parseInt(cp), ville};
    } else {
      contact = {id: null, nom, adresse, adresse_bis, cp: parseInt(cp), ville};
    }
    
    onAdd(contact);
    onClose();
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-modal>

      {edition && <DialogTitle>Modifier</DialogTitle>}
      {!edition && <DialogTitle>Ajouter</DialogTitle>}
      <DialogContent>
        <p style={{color: 'red'}}>{message}</p>
        <TextField
          autoFocus
          required={true}
          margin="dense"
          label="Nom"
          type="text"
          fullWidth
          value={nom}
          onChange={(event: any) => setNom(event.target.value)}
        />
        <TextField
          autoFocus
          required={true}
          margin="dense"
          label="Adresse"
          type="text"
          fullWidth
          value={adresse}
          onChange={(event: any) => setAdresse(event.target.value)}
        />
         <TextField
          autoFocus
          required={false}
          margin="dense"
          label="Adresse complémentaire"
          type="text"
          fullWidth
          value={adresse_bis}
          onChange={(event: any) => setAdresse_bis(event.target.value)}
        />
         <TextField
          required={true}
          margin="dense"
          label="Code Postal"
          type="number"
          inputMode='decimal'
          fullWidth
          value={cp}
          onChange={(event: any) => setCp(event.target.value)}
        />
         <TextField
          autoFocus
          required={true}
          margin="dense"
          label="Ville"
          type="text"
          fullWidth
          value={ville}
          onChange={(event: any) => setVille(event.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button variant="outlined" onClick={onCloseDialog}>Annuler</Button>
        <Button variant="outlined" onClick={handleAdd}>{edition ? <span>Modifier</span> : <span>Ajouter</span> }</Button>
      </DialogActions>
    </Dialog> 
  );
};

export default EditContactDialog;