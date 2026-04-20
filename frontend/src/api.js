import axios from 'axios';

export const loginRequest = (credentials) => axios.post('/api/v1/login', credentials);

export const fetchChatDataRequest = (token) => axios.get('/api/v1/data', {
  headers: {
    Authorization: `Bearer ${token}`,
  },
});