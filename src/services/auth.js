// services/auth.js
import api from './api';

export const authService = {
  login: (credentials) => {
    return api.post('/auth/login/', credentials)
      .then(response => {
        if (response.data.token) {
          localStorage.setItem('token', response.data.token);
        }
        return response;
      });
  },

  register: (userData) => {
    return api.post('/auth/register/', userData)
      .then(response => {
        // Don't store token yet, wait for email verification
        console.log('Registration successful:', response.data);
        return response;
      });
  },

  /* Verifies email */
// Update in your authService:
verifyEmail: (key) => {
  console.log('Verifying with key:', key); // Debug log
  return api.get(`/auth/verify-email/${key}/`);
},

  logout: () => {
    return api.post('/auth/logout/')
      .finally(() => {
        localStorage.removeItem('token');
        localStorage.removeItem('tempToken');
      });
  },

  validateToken: () => {
    return api.get('/auth/validate-token/');
  }
};