import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BarNavigation from './components/BarNavigation';
import Categories from './components/Categories';
import Fournisseurs from './components/Fournisseurs';
import Produits from './components/Produits';
import Unites from './components/Unites';
import Configurer from './components/Configurer';
import { Container } from '@mui/material';

export function Home() {

  return (
    <>
      <BarNavigation/>
      <br/>
      <Container>
        <Routes>
          <Route path="/main_window" element={<Produits />} />
          <Route path="/configurer" element={<Configurer />} />
        </Routes>
      </Container>
    </>
  );
}