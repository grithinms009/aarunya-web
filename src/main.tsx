import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { loadStorefront } from './data/storefront';
import './styles/global.css';

/* The store's settings, categories, colours and home-page content come from the API.
   Rendering after they arrive means the first paint already shows the real shop rather
   than flashing empty placeholders. loadStorefront() never rejects — if the API is
   unreachable it logs and the app renders with whatever defaults config.ts carries. */
void loadStorefront().then(() => {
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <App />
    </StrictMode>,
  );
});
