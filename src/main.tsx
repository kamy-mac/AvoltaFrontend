/**
 * Main Application Entry Point
 * 
 * This is the entry point for the React application.
 * It sets up the application with React Router, i18next, and the AuthProvider.
 * 
 * @module main
 */

import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { I18nextProvider } from 'react-i18next';
import { AuthProvider } from './context/AuthContext';
import i18n from './i18n';
import App from './App';
import './index.css';

// Create root element
const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('Failed to find the root element');

// Remove initial loader
const initialLoader = document.querySelector('.initial-loader');
if (initialLoader) {
  // Fade out the loader
  initialLoader.classList.add('fade-out');
  
  // Remove it after animation completes
  setTimeout(() => {
    initialLoader.remove();
  }, 500);
}

// Create React root
const root = createRoot(rootElement);

// Render application
root.render(
  <StrictMode>
    <I18nextProvider i18n={i18n}>
      <BrowserRouter>
        <AuthProvider>
          <App />
        </AuthProvider>
      </BrowserRouter>
    </I18nextProvider>
  </StrictMode>
);

// Register service worker for offline capabilities
if ('serviceWorker' in navigator && import.meta.env.PROD) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(registration => {
        console.log('SW registered: ', registration);
      })
      .catch(registrationError => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}