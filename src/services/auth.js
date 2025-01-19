// services/auth.js
import api from './api';

class AuthService {
  setToken(token) {
    localStorage.setItem('token', token);
  }

  getToken() {
    return localStorage.getItem('token');
  }

  async login(credentials) {
    try {
      const response = await api.post('/auth/login/', credentials);
      if (response.data.token) {
        this.setToken(response.data.token);
      }
      return response;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  }

  async register(userData) {
    try {
      const response = await api.post('/auth/register/', userData);
      if (response.data.tempToken) {
        localStorage.setItem('tempToken', response.data.tempToken);
      }
      return response;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  }

  async verifyEmail(key) {
    try {
      const response = await api.get(`/auth/verify-email/${key}/`);
      return response;
    } catch (error) {
      console.error('Email verification error:', error);
      throw error;
    }
  }

  // Simplified token validation - just check if token exists
  async validateToken() {
    const token = this.getToken();
    if (!token) {
      throw new Error('No token found');
    }
    // Return a mock response that matches your expected structure
    return {
      data: {
        user: JSON.parse(localStorage.getItem('user') || '{}'),
        token: token
      }
    };
  }

  async logout() {
    try {
      await api.post('/auth/logout/');
    } finally {
      this.clearAuth();
    }
  }

  clearAuth() {
    localStorage.removeItem('token');
    localStorage.removeItem('tempToken');
    localStorage.removeItem('user');
  }

  isAuthenticated() {
    return !!this.getToken();
  }

  // Save user data
  setUser(userData) {
    localStorage.setItem('user', JSON.stringify(userData));
  }

  // Get user data
  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }
}

export const authService = new AuthService();