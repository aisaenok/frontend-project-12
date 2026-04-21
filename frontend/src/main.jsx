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
import rollbar, { rollbarConfig } from './rollbar.js'

const renderApp = i18n => (
  <React.StrictMode>
    <Provider store={store}>
      <I18nextProvider i18n={i18n}>
        <BrowserRouter>
          <App />
          <ToastContainer />
        </BrowserRouter>
      </I18nextProvider>
    </Provider>
  </React.StrictMode>
)

initI18n().then((i18n) => {
  const app = renderApp(i18n)
  const root = ReactDOM.createRoot(document.getElementById('root'))

  if (rollbarConfig.accessToken) {
    root.render(
      <RollbarProvider config={rollbarConfig} instance={rollbar}>
        <ErrorBoundary>
          {app}
        </ErrorBoundary>
      </RollbarProvider>,
    )
    return
  }

  root.render(app)
})
