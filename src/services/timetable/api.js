// timeSlotService.js
import api from '../api';
import { format, addDays } from 'date-fns';

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
    console.log('TimeSlot service creating with data:', data); // Debug log 1
    
    try {
      // Ensure the date is properly formatted and add recurrence pattern
      const formattedData = {
        ...data,
        date: data.date ? format(new Date(data.date), 'yyyy-MM-dd') : undefined,
        recurrence_pattern: data.recurrence_pattern || 'none'
      };
      
      console.log('Formatted data for API:', formattedData); // Debug log 2
      
      const response = await api.post('/timeslots/', formattedData);
      console.log('API response:', response); // Debug log 3
      
      return response;
    } catch (error) {
      console.error('Error in timeSlotService.create:', error); // Debug log 4
      console.error('Error response:', error.response?.data);
      throw error;
    }
  },
  
  update: (id, data) => {
    const formattedData = {
      ...data,
      date: data.date ? format(new Date(data.date), 'yyyy-MM-dd') : undefined
    };
    return api.put(`/timeslots/${id}/`, formattedData);
  },
  
  delete: (id) => api.delete(`/timeslots/${id}/`),
  
  complete: (id, data) => api.post(`/timeslots/${id}/complete_task/`, data)
};

export default timeSlotService;
