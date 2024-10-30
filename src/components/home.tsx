import { Navigate, Route, Routes } from 'react-router-dom';
import BarNavigation from './BarNavigation';
import Produits from './Produits';
import Configurer from './Configurer';
import { Container } from '@mui/material';
import ErrorBoundary from './divers/ErrorBoundary';
// import InvoicePageNg from './facture/InvoicePageNg';
import { Invoice } from './facture/data/types';
import { Panier } from './Panier';
import { createContext, useState } from 'react';

export const ProduitContext = createContext(null);

export function Home() {
 
  const [produitsGlobal, setProduitsGlobal ] = useState([]);
  // const [factureGlobal, setFactureGlobal ] = useState(null);

  const savedInvoice = window.localStorage.getItem('invoiceData')
  let data = null

  try {
    if (savedInvoice) {
      data = JSON.parse(savedInvoice)
    }
  } catch (_e) {}

  const onInvoiceUpdated = (invoice: Invoice) => {
    window.localStorage.setItem('invoiceData', JSON.stringify(invoice))
  }

  return (
    <ErrorBoundary>
       <ProduitContext.Provider
          value={{
            produitsGlobal,
            setProduitsGlobal,
            // factureGlobal,
            // setFactureGlobal
          }}
        >
      <BarNavigation/>
        <br/>
        <Container>
          <Routes>
            <Route path="/main_window" element={<Produits />} />
            <Route path="/configurer" element={<Configurer />} />
            <Route path="/panier" element={<Panier />} />
            {/* <Route path="/facture" element={<InvoicePageNg data={data} onChange={onInvoiceUpdated} />
              <div style={{width: '800px'}}>
                <InvoicePageNg data={data} onChange={onInvoiceUpdated} />
              </div>
            } /> */}
            <Route path="/" element={<Navigate to="/main_window" />} />
          </Routes>
        </Container>
      </ProduitContext.Provider>
    </ErrorBoundary>
  );
}