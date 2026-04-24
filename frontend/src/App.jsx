import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ChannelModal from './components/ChannelModal/ChannelModal.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Header from './components/Header.jsx'
import SignupPage from './pages/SignupPage.jsx'
import routes from './utils/routes.js'

function App() {
  return (
    <div className="d-flex flex-column vh-100">
      <Header />
      <div className="flex-grow-1 overflow-hidden d-flex flex-column">
        <Routes>
          <Route
            path={routes.chatPath()}
            element={(
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            )}
          />
          <Route path={routes.loginPath()} element={<LoginPage />} />
          <Route path={routes.signupPath()} element={<SignupPage />} />
          <Route path={routes.notFoundPath()} element={<NotFoundPage />} />
          <Route path="*" element={<Navigate to={routes.notFoundPath()} replace />} />
        </Routes>
      </div>
      <ChannelModal />
    </div>
  )
}

export default App
