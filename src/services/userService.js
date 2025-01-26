// src/services/userService.js
import api from './api';

export const userService = {
  getStats: async () => {
    try {
       const response = await api.get('auth/user/stats/');
      
      // Transform nested structure to flat structure
      const { xp, levels, streaks } = response.data;
      return {
        data: {
          conquest_xp: xp.conquest,
          cultural_xp: xp.cultural,
          wisdom_xp: xp.wisdom,
          legacy_xp: xp.legacy,
          total_xp: xp.total,
          conquest_level: levels.conquest,
          cultural_level: levels.cultural,
          wisdom_level: levels.wisdom,
          legacy_level: levels.legacy,
          total_level: levels.total,
          current_streak: streaks.current,
          best_streak: streaks.best
        }
      };
    } catch (error) {
      console.error("Error fetching stats:", error);
      throw error;
    }
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

export default userService;