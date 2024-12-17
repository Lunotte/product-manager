import InvoicePageNg from './facture/InvoicePageNg';
import { ProductLine } from './facture/data/types';
import { Produit } from '../models/Produit';
import { initialInvoice } from './facture/data/initialData';
import { useContext, useEffect, useState } from 'react';
import { ContactContext, ProduitContext, ProduitFactureContext } from './home';
import SelectionnerContact from './facture/SelectionnerContact';

export function Panier() {

  const {produitsGlobal} = useContext(ProduitContext);
  const {produitsFactureGlobal, setProduitsFactureGlobal} = useContext(ProduitFactureContext);
  const {contactGlobal} = useContext(ContactContext);
  
  const produitsInvoice = produitsGlobal.map((produit: Produit) => ({
    id: produit.id,
    date: '',
    description: produit.nom,
    quantity: '1',
    unite: produit?.uniteNom?.toString(),
    rate: produit?.prixVente?.toFixed(2)
 } as ProductLine))
  const facture = {...initialInvoice, productLines: produitsInvoice}
  
  return (
    <div style={{display: 'flex'}}>
      <div style={{width: '800px'}}>
        <InvoicePageNg 
          data={facture}
          contact={contactGlobal?.contact}
          produitsFactureGlobal={produitsFactureGlobal}
          setProduitsFactureGlobal={setProduitsFactureGlobal}/>
      </div>
      <SelectionnerContact />
    </div>
  );
}