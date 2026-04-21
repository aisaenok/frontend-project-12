import { Provider as RollbarProvider, ErrorBoundary } from '@rollbar/react'
import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { ToastContainer } from 'react-toastify'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import App from './App.jsx'
import store from './app/store.js'
import initI18n from './i18n.js'
import rollbarConfig from './rollbar.js'
import { AuthProvider } from './contexts/AuthProvider.jsx'
import { ChatApiProvider } from './contexts/ChatApiProvider.jsx'

initI18n().then((i18n) => {
  ReactDOM.createRoot(document.getElementById('root')).render(
    <React.StrictMode>
      <RollbarProvider config={rollbarConfig}>
        <ErrorBoundary>
          <Provider store={store}>
            <I18nextProvider i18n={i18n}>
              <BrowserRouter>
                <AuthProvider>
                  <ChatApiProvider>
                    <App />
                    <ToastContainer />
                  </ChatApiProvider>
                </AuthProvider>
              </BrowserRouter>
            </I18nextProvider>
          </Provider>
        </ErrorBoundary>
      </RollbarProvider>
    </React.StrictMode>,
  )
})
