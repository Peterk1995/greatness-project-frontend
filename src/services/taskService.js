// services/taskService.js
import api from './api';

export const taskService = {
  getAll: () => api.get('/timeslots/'),
  get: (id) => api.get(`/timeslots/${id}/`),
  create: (data) => api.post('/timeslots/', data),
  update: (id, data) => api.put(`/timeslots/${id}/`, data),
  delete: (id) => api.delete(`/timeslots/${id}/`),
  // Add this new method
  complete: (id, data) => api.post(`/timeslots/${id}/complete_task/`, data),
};