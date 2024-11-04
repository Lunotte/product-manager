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
  const [civilite, setCivilite] = useState('M');
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [adresse, setAdresse] = useState('');
  const [adresse_bis, setAdresse_bis] = useState('');
  const [cp, setCp] = useState('');
  const [ville, setVille] = useState('');

  const [edition, setEdition] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setCivilite(contactToEdit.civilite || '');
      setNom(contactToEdit.nom || '');
      setPrenom(contactToEdit.prenom || '');
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
    setCivilite('');
    setNom('');
    setPrenom('');
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
    if(!civilite.trim() || !nom.trim() || !prenom.trim() || !adresse.trim() || !cp.trim() || !ville.trim()){
      setMessage('Veuillez saisir tous les champs');
      return;
    }

    let contact: Contact;
    const nomComplet = civilite.concat(' ').concat(nom.concat(' ').concat(prenom));
    if(contactToEdit) {
      contact = {...contactToEdit, civilite, nom, prenom, nom_complet: nomComplet, adresse, adresse_bis, cp: parseInt(cp), ville};
    } else {
      contact = {id: null, civilite, nom, prenom, adresse, nom_complet: nomComplet, adresse_bis, cp: parseInt(cp), ville};
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
        <InputLabel id="select-label-civilite">Civilité</InputLabel>
        <Select
          style={{width: '100px'}}
          labelId="select-label-civilite"
          id="select-id-civilite"
          value={civilite}
          defaultValue='M'
          label="Civilite"
          onChange={(event: any) => setCivilite(event.target.value)}
        >
          <MenuItem value="M">M</MenuItem>
          <MenuItem value="Mme">Mme</MenuItem>
        </Select>
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
          label="Prénom"
          type="text"
          fullWidth
          value={prenom}
          onChange={(event: any) => setPrenom(event.target.value)}
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