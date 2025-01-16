// src/services/api.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000/api',
});

export const timeSlotService = {
  getAll: () => api.get('/timeslots/'),
  create: (data) => api.post('/timeslots/', data),
  update: (id, data) => api.put(`/timeslots/${id}/`, data),
  delete: (id) => api.delete(`/timeslots/${id}/`),
};