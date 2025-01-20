// timeSlotService.js
import api from '../api';
import { format } from 'date-fns';

export const timeSlotService = {
  getAll: () => api.get('/timeslots/'),

  getWeek: (weekStart, weekEnd) => {
    try {
      const formattedStart = format(weekStart, 'yyyy-MM-dd');
      const formattedEnd = format(weekEnd, 'yyyy-MM-dd');
      return api.get(`/timeslots/?start_date=${formattedStart}&end_date=${formattedEnd}`);
    } catch (error) {
      console.error('Error in getWeek:', error);
      throw new Error('Invalid date format provided to getWeek');
    }
  },

  create: async (data) => {
    console.log('TimeSlot service creating with data:', data);

    try {
      // Format the date only if it's not already a string
      const formattedData = {
        ...data,
        date: typeof data.date === 'string' ? data.date : format(data.date, 'yyyy-MM-dd'),
        recurrence_pattern: data.recurrence_pattern || 'none'
      };

      console.log('Formatted data for API:', formattedData);

      const response = await api.post('/timeslots/', formattedData);
      console.log('API response:', response);

      return response;
    } catch (error) {
      console.error('Error in timeSlotService.create:', error);
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },

  update: (id, data) => {
    // Format the date only if it's not already a string
    const formattedData = {
      ...data,
      date: typeof data.date === 'string' ? data.date : format(data.date, 'yyyy-MM-dd'),
    };
    return api.put(`/timeslots/${id}/`, formattedData);
  },

  delete: (id) => api.delete(`/timeslots/${id}/`),

  complete: (id, data) => api.post(`/timeslots/${id}/complete_task/`, data)
};

export default timeSlotService;