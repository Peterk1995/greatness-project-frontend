// src/services/campaignService.js
import api from './api'; // Your axios instance with baseURL & token config

export const campaignService = {
  create: (data) => api.post('/campaigns/', data),
  getAll: () => api.get('/campaigns/'),
  get: (id) => api.get(`/campaigns/${id}/`),
  update: (id, data) => api.put(`/campaigns/${id}/`, data),
  delete: (id) => api.delete(`/campaigns/${id}/`),
  addXp: (id, data) => api.post(`/campaigns/${id}/add_xp/`, data),
};
