import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CategorieDialog from './dialogs/CategorieDialog';

export function Home() {
  const [users, setUsers] = useState([]);

  const [categorie, setCategorie] = useState();
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  const handleAddCategorie = (categorie: any) => {
    // setCategorie(categorie);
    console.log(categorie);
    
    window.electronAPI.addCategorie(categorie).then((result) => {
      console.log(result);
      
    }).catch((err) => {
      console.error(err);
    });
  };

  // useEffect(() => {
  //   console.log(categorie);
    
  //   window.electronAPI.addCategorie(categorie).then((result) => {
  //     console.log(result);
      
  // }).catch((err) => {
  //   console.error(err);
  // });
  // }, [categorie]);

  useEffect(() => {
    if (window.electronAPI) {        
        window.electronAPI.getData().then((result) => {
            console.log(result);
            
          setUsers(result);
        }).catch((err) => {
          console.error(err);
        });
      } else {
        console.error("electronAPI n'est pas défini");
      }

    window.electronAPI.getCategories().then((result) => {
        console.log(result);
        
      setUsers(result);
    }).catch((err) => {
      console.error(err);
    });
      
  }, []);

  return (
    <div>
      <Button onClick={() => setOpenCategoryDialog(true)}>Ajouter Catégorie</Button>
      <h1>Liste des utilisateurs</h1>
      <ul>
        {users?.map((user) => (
          <li key={user.id}>{user.name}</li>
        ))}
      </ul>

      <CategorieDialog
        open={openCategoryDialog}
        onClose={() => setOpenCategoryDialog(false)}
        onAdd={handleAddCategorie}
      />
    </div>
  );
}