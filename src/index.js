import './index.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { LoadingProvider } from './context/LoadingContext';
import App from './App';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <LoadingProvider> {/* ✅ Aquí envuelves toda la app */}
      <App />
    </LoadingProvider>
  </BrowserRouter>
);
