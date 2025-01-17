import api from '../api'; // Import the configured api instance

export const timeSlotService = {
  getAll: () => api.get('/timeslots/'),
  create: (data) => api.post('/timeslots/', data),
  update: (id, data) => api.put(`/timeslots/${id}/`, data),
  delete: (id) => api.delete(`/timeslots/${id}/`),
};