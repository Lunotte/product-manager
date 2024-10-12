import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import React from 'react';
import { Home } from './home';

const root = createRoot(document.getElementById('root'));
root.render(<React.StrictMode>
    <BrowserRouter>
       <Home />
    </BrowserRouter>
 </React.StrictMode>
);