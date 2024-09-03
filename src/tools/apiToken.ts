const API_TOKEN_KEY = 'token';

export const getToken = () => {
  return localStorage.getItem(API_TOKEN_KEY);
};

export const saveToken = (token: string) => {
  localStorage.setItem(API_TOKEN_KEY, token);
};

export const removeToken = () => {
  localStorage.removeItem(API_TOKEN_KEY);
};

