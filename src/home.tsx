import { Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import CategorieDialog from './components/dialogs/IdNomDialog';
import Categories from './components/Categories';
import { Categorie } from './components/models/Categorie';

export function Home() {
  // const [users, setUsers] = useState([]);

  // const [categorie, setCategorie] = useState();
  const [categories, setCategories] = useState([]);
  const [openCategoryDialog, setOpenCategoryDialog] = useState(false);

  return (
    <div>
      { <Categories/> }
    </div>
  );
}