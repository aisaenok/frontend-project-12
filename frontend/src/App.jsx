import { Routes, Route, Navigate } from 'react-router-dom'
import ChatPage from './pages/ChatPage.jsx'
import LoginPage from './pages/LoginPage.jsx'
import NotFoundPage from './pages/NotFoundPage.jsx'
import ChannelModal from './components/ChannelModal.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Header from './components/Header.jsx'
import SignupPage from './pages/SignupPage.jsx'
import routes from './routes.js'

function App() {
  return (
    <div className="h-100 d-flex flex-column">
      <Header />
      <div className="flex-grow-1 overflow-hidden">
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
