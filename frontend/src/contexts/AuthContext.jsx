import { createContext, useContext, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { logIn, logOut } from '../slices/authSlice.js'
import {
  setToken,
  setUsername,
  removeToken,
  removeUsername,
} from '../utils/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const dispatch = useDispatch()

  const value = useMemo(() => ({
    signIn: ({ token, username }) => {
      setToken(token)
      setUsername(username)

      dispatch(logIn({
        token,
        username,
      }))
    },

    signOut: () => {
      removeToken()
      removeUsername()
      dispatch(logOut())
    },
  }), [dispatch])

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }

  return context
}
