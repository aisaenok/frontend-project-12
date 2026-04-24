import axios from 'axios'
import routes from './utils/routes.js'

export const loginRequest = credentials => axios.post(routes.loginApiPath(), credentials)

export const signupRequest = credentials => axios.post(routes.signupApiPath(), credentials)

export const fetchChatDataRequest = token => axios.get(routes.dataApiPath(), {
  headers: {
    Authorization: `Bearer ${token}`,
  },
})
