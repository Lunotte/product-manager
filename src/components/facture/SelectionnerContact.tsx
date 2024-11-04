import { FC, useCallback, useContext, useEffect, useState } from 'react'
import { Autocomplete, TextField } from '@mui/material'
import { Contact } from '../../models/Contact'
import { ContactContext } from '../home'

const SelectionnerContact: FC<{}> = () => {

  const {setContactGlobal} = useContext(ContactContext);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [contactsOptions, setContactsOptions] = useState<any[]>([]);

  useEffect(() => {
    window.electronAPI.getContacts().then((resultats) => {
      setContacts(resultats);
      selectedValues(resultats);
    }).catch((err) => {
      window.electronAPI.logError(err);
    });
  }, []);

  const selectedValues = useCallback((contacts: Contact[]) => {
      const contactsOptions = contacts.map((contact) => ({label: contact.nom_complet, value: contact.id}))
      setContactsOptions(contactsOptions);
    },
    [contactsOptions],
  );

  const handleChange = (value: any) => {
    if(value){
      const contactTmp = contacts.find(contact => value.value == contact.id);
      setContactGlobal({options: value, contact: contactTmp});
    }
  }

  return (
    <>
        <Autocomplete
          style={{backgroundColor:"white", height:"55px", width: "300px", margin: "130px 0 0 -330px"}}
          disablePortal
          options={contactsOptions}
          onChange={(_, newValue) => handleChange(newValue)}
          renderInput={(params) => <TextField {...params} label="Adresse client" />}
        />
    </>
  )
}

export default SelectionnerContact
