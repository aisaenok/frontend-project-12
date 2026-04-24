import { useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { logIn, logOut } from '../app/authSlice.js'
import {
  setToken,
  setUsername,
  removeToken,
  removeUsername,
} from '../utils/auth.js'
import { AuthContext } from './AuthContext.js'

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
