import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { performanceService } from './services/performance.service';

// Start performance monitoring
performanceService.trackPageLoad();

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

// Track initial render
const renderStart = performance.now();
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
performanceService.trackRender('app', renderStart);

// Register service worker for PWA
if ('serviceWorker' in navigator && process.env.NODE_ENV === 'production') {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then(registration => {
        console.log('ServiceWorker registered: ', registration);
      })
      .catch(error => {
        console.log('ServiceWorker registration failed: ', error);
      });
  });
}
