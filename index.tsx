import './index.css';

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from '@shell/App';

// Lazy load fonts to improve initial load time
const loadFonts = () => {
  import('@fontsource/plus-jakarta-sans');
  import('@fontsource/jetbrains-mono');
  import('@fontsource/noto-sans');
  import('material-symbols/outlined.css');
};

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

// Load fonts after initial render
if (typeof window !== 'undefined') {
  if (document.readyState === 'complete') {
    loadFonts();
  } else {
    window.addEventListener('load', loadFonts);
  }
  
  // Service worker registration is now handled by AuthContext
  // It will only be registered when a user is authenticated
}
