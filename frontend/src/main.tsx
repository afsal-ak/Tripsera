import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import { GoogleOAuthProvider } from '@react-oauth/google';

import App from './App.tsx';
import { store } from './redux/store.ts';
import { Provider } from 'react-redux';
import { AuthModalProvider } from './context/AuthModalContext.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

createRoot(document.getElementById('root')!).render(
  <StrictMode>
<ErrorBoundary>

    <GoogleOAuthProvider clientId={clientId}>
      <AuthModalProvider>

        <Provider store={store}>
          <BrowserRouter>
            <App />
          </BrowserRouter>
        </Provider>
      </AuthModalProvider>

    </GoogleOAuthProvider>
</ErrorBoundary>

  </StrictMode>
);
