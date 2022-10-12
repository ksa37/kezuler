import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { StyledEngineProvider } from '@mui/material/styles';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { persistStore } from 'redux-persist';
import { PersistGate } from 'redux-persist/integration/react';

import { GOOGLE_CLIENT_ID } from './constants/Auth';
import { store } from './store';

import App from './App';
import reportWebVitals from './reportWebVitals';
import KezulerIntro from './components/KezulerIntro';
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
const persistor = persistStore(store);
root.render(
  // <React.StrictMode>
  <div id={'app-wrapper'} className={'app-wrapper'}>
    <StyledEngineProvider injectFirst>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>
          <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
            <BrowserRouter>
              <KezulerIntro />
              <App />
            </BrowserRouter>
          </GoogleOAuthProvider>
        </PersistGate>
      </Provider>
    </StyledEngineProvider>
  </div>
  // </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
