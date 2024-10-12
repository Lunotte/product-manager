import BarNavigation from './components/BarNavigation';
import Categories from './components/Categories';
import Fournisseurs from './components/Fournisseurs';
import Produits from './components/Produits';
import Unites from './components/Unites';

export function Home() {

  return (
    
    <div>
      <BarNavigation/>
      <Produits/>
      {/* { <Categories/> }
      { <Fournisseurs/> }
      { <Unites/> } */}
    </div>
  );
}