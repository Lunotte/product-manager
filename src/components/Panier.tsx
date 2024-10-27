import { useLocation } from 'react-router-dom';
import InvoicePageNg from './facture/InvoicePageNg';
import { ProductLine } from './facture/data/types';
import { Produit } from '../models/Produit';
import { initialInvoice } from './facture/data/initialData';

export function Panier() {

  const location = useLocation();
  
  const produits: Produit[] = location.state?.panier || [];
  const produitsInvoice = produits.map(produit => ({
    date: '',
    description: produit.nom,
    quantity: '1',
    unite: produit.uniteNom.toString(),
    rate: produit.prixVente.toString()
 } as ProductLine))

  const facture = {...initialInvoice, productLines: produitsInvoice}

  return (
     <div style={{width: '800px'}}>
      <InvoicePageNg data={facture}/>
    </div>
  );
}