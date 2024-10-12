import { BrowserRouter, Route, Routes } from 'react-router-dom';
import BarNavigation from './components/BarNavigation';
import Categories from './components/Categories';
import Fournisseurs from './components/Fournisseurs';
import Produits from './components/Produits';
import Unites from './components/Unites';
import Configurer from './components/Configurer';

export function Home() {

  return (
    <>
      <BarNavigation/>
      <Routes>
        <Route path="/main_window" element={<Produits />} />
        <Route path="/configurer" element={<Configurer />} />
      </Routes>
    </>
  );
}