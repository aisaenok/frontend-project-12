const tokenKey = 'token'
const usernameKey = 'username'

export const getToken = () => localStorage.getItem(tokenKey)

export const setToken = (token) => {
  localStorage.setItem(tokenKey, token)
}

export const removeToken = () => {
  localStorage.removeItem(tokenKey)
}

export const getUsername = () => localStorage.getItem(usernameKey)

export const setUsername = (username) => {
  localStorage.setItem(usernameKey, username)
}

export const removeUsername = () => {
  localStorage.removeItem(usernameKey)
}
