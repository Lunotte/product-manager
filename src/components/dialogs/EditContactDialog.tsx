import React, { useEffect, useState } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, FormControl, InputLabel, Select, MenuItem, Input, FormHelperText } from '@mui/material';
import { Contact } from '../../models/Contact';
import validator from 'validator';
import { cleanStartAndEndString } from '../divers/Utils';

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
  const [telephone, setTelephone] = useState('');
  const [email, setEmail] = useState('');

  const [edition, setEdition] = useState(true);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (contactToEdit) {
      setCivilite(contactToEdit.civilite || '');
      setNom(contactToEdit.nom || '');
      setPrenom(contactToEdit.prenom || '');
      setAdresse(contactToEdit.adresse);
      setAdresse_bis(contactToEdit.adresse_bis);
      setCp(contactToEdit.cp?.toString() || '');
      setVille(contactToEdit.ville);
      setTelephone(contactToEdit.telephone);
      setEmail(contactToEdit.email);
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
    setTelephone('');
    setEmail('');
    setEdition(false);
  }

  const onCloseDialog = () => {
    setMessage('');
    onClose();
    reset();
  }

  const handleAdd = () => {
    if(!nom.trim()){
      setMessage('Veuillez saisir le champ Nom');
      return;
    }

    
  if (email && !validator.isEmail(email)) {
    setMessage('L’adresse email n’est pas valide');
    return;
 } 

    let contact: Contact;
    const nomCleaned = cleanStartAndEndString(nom);
    const prenomCleaned = cleanStartAndEndString(prenom);
    const nomComplet = civilite.concat(' ').concat(nomCleaned.concat(' ').concat(prenomCleaned));
    if(contactToEdit) {
      contact = {...contactToEdit, civilite, nom: nomCleaned, prenom: prenomCleaned, nom_complet: nomComplet, adresse, adresse_bis, cp: parseInt(cp), ville, telephone, email};
    } else {
      contact = {id: null, civilite, nom: nomCleaned, prenom, adresse, nom_complet: nomComplet, adresse_bis, cp: parseInt(cp), ville, telephone, email};
    }
    onAdd(contact);
    reset();
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} aria-modal>

      {edition && <DialogTitle>Modifier</DialogTitle>}
      {!edition && <DialogTitle>Ajouter</DialogTitle>}
      <DialogContent>
        <p style={{color: 'red'}}>{message}</p>
        <InputLabel id="select-label-civilite" required={true}>Civilité</InputLabel>
        <Select
          style={{width: '100px'}}
          labelId="select-label-civilite"
          id="select-id-civilite"
          required={true}
          value={civilite}
          defaultValue='M'
          label="Civilite"
          onChange={(event: any) => setCivilite(event.target.value)}
        >
          <MenuItem value="M.">M.</MenuItem>
          <MenuItem value="M. et Mme">M. et Mme</MenuItem>
          <MenuItem value="Mme">Mme</MenuItem>
        </Select>
        <TextField
          required={true}
          margin="dense"
          label="Nom"
          type="text"
          fullWidth
          value={nom}
          onChange={(event: any) => setNom(event.target.value)}
        />
        <TextField
          required={false}
          margin="dense"
          label="Prénom"
          type="text"
          fullWidth
          value={prenom}
          onChange={(event: any) => setPrenom(event.target.value)}
        />
        <TextField
          required={false}
          margin="dense"
          label="Adresse"
          type="text"
          fullWidth
          value={adresse}
          onChange={(event: any) => setAdresse(event.target.value)}
        />
         <TextField
          required={false}
          margin="dense"
          label="Adresse complémentaire"
          type="text"
          fullWidth
          value={adresse_bis}
          onChange={(event: any) => setAdresse_bis(event.target.value)}
        />
         <TextField
          required={false}
          margin="dense"
          label="Code Postal"
          type="number"
          inputMode='decimal'
          fullWidth
          value={cp}
          onChange={(event: any) => setCp(event.target.value)}
        />
         <TextField
          required={false}
          margin="dense"
          label="Ville"
          type="text"
          fullWidth
          value={ville}
          onChange={(event: any) => setVille(event.target.value)}
        />
        <TextField
          required={false}
          margin="dense"
          label="Téléphone"
          type="text"
          fullWidth
          value={telephone}
          onChange={(event: any) => setTelephone(event.target.value)}
        />
        <TextField
          required={false}
          margin="dense"
          label="Email"
          type="text"
          fullWidth
          value={email}
          onChange={(event: any) => setEmail(event.target.value)}
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