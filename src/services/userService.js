// src/services/userService.js
import api from './api';

export const userService = {
  getStats: async () => {
    const response = await api.get('/auth/user/stats/');
    return response;
  },
  
  updateStats: async (data) => {
    const response = await api.patch('/user/stats/', data);
    return response;
  },

  getAchievements: async () => {
    const response = await api.get('/user/achievements/');
    return response;
  },

  getSkills: async () => {
    const response = await api.get('/user/skills/');
    return response;
  },
};