import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import React from 'react';
import { Home } from './components/home';

// Capturer les erreurs non gérées dans le processus renderer
window.onerror = (message, source, lineno, colno, error) => {
   const errorLog = `Erreur capturée par window.onerror :
   Message: ${message}
   Source: ${source}
   Ligne: ${lineno}
   Colonne: ${colno}
   Erreur: ${error?.stack || error}`;  // Si `error` est défini, affiche le stack trace sinon juste l'objet error.

   console.error(errorLog);
   window.electronAPI.logError(errorLog);
 };
 
 window.onunhandledrejection = (event) => {
   const rejectionLog = `Rejet de promesse non géré :
   Raison: ${event.reason?.message || event.reason}`;
 
   console.error(rejectionLog);
   window.electronAPI.logError(rejectionLog);
 };

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
   <HashRouter>
      <Home />
   </HashRouter>
 </React.StrictMode>
);