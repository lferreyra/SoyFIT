import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import {Raiz} from './simple/Raiz';
import './index.css';

// Version simple: embudo en "/" y app en "/app". La version completa sigue en App.tsx.
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Raiz />
  </StrictMode>,
);
