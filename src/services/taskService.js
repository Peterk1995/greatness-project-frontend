// services/taskService.js
import api from './api';
import pomodoroService from './pomodoroService';

export const taskService = {
  getAll: () => api.get('/timeslots/'),
  
  get: (id) => api.get(`/timeslots/${id}/`),
  
  create: (data) => api.post('/timeslots/', data),
  
  update: (id, data) => api.put(`/timeslots/${id}/`, data),
  
  delete: async (id) => {
    try {
      // First cancel any active Chronos cycles
      await pomodoroService.cancelCycles(id);
      
      // Then delete the task
      const response = await api.delete(`/timeslots/${id}/`);
      return response;
    } catch (error) {
      console.error('Error in task deletion:', error);
      throw error;
    }
  },
  
  complete: (id, data) => api.post(`/timeslots/${id}/complete_task/`, data)
};

export default taskService;