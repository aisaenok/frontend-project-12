const storageKey = 'token';

export const getToken = () => localStorage.getItem(storageKey);

export const setToken = (token) => {
  localStorage.setItem(storageKey, token);
};

export const removeToken = () => {
  localStorage.removeItem(storageKey);
};

export const isAuthenticated = () => Boolean(getToken());