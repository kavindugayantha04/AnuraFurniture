import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Toaster } from 'react-hot-toast';
import App from './App';
import { store } from './store/store';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Provider store={store}>
      <BrowserRouter>
        <HelmetProvider>
          <App />
          <Toaster
            position="top-right"
            gutter={8}
            toastOptions={{
              duration: 3000,
              style: {
                background: '#1e3a8a',
                color: '#fff',
                borderRadius: '12px',
                padding: '12px 16px',
                fontSize: '14px',
                boxShadow: '0 8px 32px rgba(30, 58, 138, 0.3)',
              },
              success: {
                iconTheme: { primary: '#22d3ee', secondary: '#fff' },
              },
              error: {
                style: { background: '#991b1b', color: '#fff' },
              },
            }}
          />
        </HelmetProvider>
      </BrowserRouter>
    </Provider>
  </React.StrictMode>
);
