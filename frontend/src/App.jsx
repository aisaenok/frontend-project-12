import { Routes, Route, Navigate } from 'react-router-dom';
import ChatPage from './pages/ChatPage.jsx';
import LoginPage from './pages/LoginPage.jsx';
import NotFoundPage from './pages/NotFoundPage.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={(
          <ProtectedRoute>
            <ChatPage />
          </ProtectedRoute>
        )}
      />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/404" element={<NotFoundPage />} />
      <Route path="*" element={<Navigate to="/404" replace />} />
    </Routes>
  );
}

export default App;