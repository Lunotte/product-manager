import { Navigate, Route, Routes } from 'react-router-dom';
import BarNavigation from './BarNavigation';
import Produits from './Produits';
import Configurer from './Configurer';
import { Container } from '@mui/material';
import ErrorBoundary from './divers/ErrorBoundary';

export function Home() {

  return (
    <ErrorBoundary>
      <BarNavigation/>
      <br/>
      <Container>
        <Routes>
          <Route path="/main_window" element={<Produits />} />
          <Route path="/configurer" element={<Configurer />} />
          <Route path="/" element={<Navigate to="/main_window" />} />
        </Routes>
      </Container>
    </ErrorBoundary>
  );
}