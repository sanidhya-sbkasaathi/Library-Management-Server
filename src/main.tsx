import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { initGlobalApiLogger } from './utils/apiLogger';

// Initialize unified API console logger & fetch interceptor
initGlobalApiLogger();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

