import Categories from './components/Categories';
import Fournisseurs from './components/Fournisseurs';
import Unites from './components/Unites';

export function Home() {

  return (
    <div>
      { <Categories/> }
      { <Fournisseurs/> }
      { <Unites/> }
    </div>
  );
}