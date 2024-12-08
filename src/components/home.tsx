import { Navigate, Route, Routes } from 'react-router-dom';
import BarNavigation from './BarNavigation';
import Produits from './Produits';
import Configurer from './Configurer';
import { Container } from '@mui/material';
import ErrorBoundary from './divers/ErrorBoundary';
import { Panier } from './Panier';
import { createContext, useState } from 'react';

export const ProduitContext = createContext(null);
export const ProduitFactureContext = createContext(null);
export const ContactContext = createContext(null);

export function Home() {
 
  const [produitsGlobal, setProduitsGlobal ] = useState([]);
  const [produitsFactureGlobal, setProduitsFactureGlobal ] = useState([]);
  const [contactGlobal, setContactGlobal ] = useState(null);

  const savedInvoice = window.localStorage.getItem('invoiceData')
  let data = null

  try {
    if (savedInvoice) {
      data = JSON.parse(savedInvoice)
    }
  } catch (_e) {}

  // const onInvoiceUpdated = (invoice: Invoice) => {
  //   window.localStorage.setItem('invoiceData', JSON.stringify(invoice))
  // }

  return (
    <ErrorBoundary>
      <ProduitContext.Provider
        value={{
          produitsGlobal,
          setProduitsGlobal,
        }}
      >
        <ProduitFactureContext.Provider
          value={{
            produitsFactureGlobal,
            setProduitsFactureGlobal,
          }}
        >
          <ContactContext.Provider
            value={{
              contactGlobal,
              setContactGlobal,
            }}
          >
            <BarNavigation/>
            <br/>
            <Container>
              <Routes>
                <Route path="/main_window" element={<Produits />} />
                <Route path="/configurer" element={<Configurer />} />
                <Route path="/panier" element={<Panier />} />
                <Route path="/" element={<Navigate to="/main_window" />} />
              </Routes>
            </Container>
          </ContactContext.Provider>
        </ProduitFactureContext.Provider>
      </ProduitContext.Provider>
    </ErrorBoundary>
  );
}