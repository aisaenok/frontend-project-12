import { Navigate } from 'react-router-dom'
import { useSelector } from 'react-redux'
import routes from '../routes.js'

function ProtectedRoute({ children }) {
  const token = useSelector(state => state.auth.token)

  if (!token) {
    return <Navigate to={routes.loginPath()} replace />
  }

  return children
}

export default ProtectedRoute
