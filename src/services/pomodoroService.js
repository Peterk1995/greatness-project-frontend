// services/pomodoroService.js
import api from './api';

const pomodoroService = {
  getActiveCycle: async (taskId) => {
    try {
      const response = await api.get(`/chronos-cycles/active/${taskId}/`);
      console.log("getActiveCycle response:", response.data);
      return response.data;
    } catch (error) {
      console.error('Failed to get active cycle:', error);
      return null;
    }
  },

  startCycle: async (cycleId) => {
    try {
      const response = await api.post(`/chronos-cycles/${cycleId}/start/`);
      return response.data;
    } catch (error) {
      console.error('Failed to start cycle:', error);
      throw error;
    }
  },

  pauseCycle: async (cycleId) => {
    try {
      const response = await api.post(`/chronos-cycles/${cycleId}/pause/`);
      return response.data;
    } catch (error) {
      console.error('Failed to pause cycle:', error);
      throw error;
    }
  },

  cancelCycles: async (taskId) => {
    try {
      const response = await api.post(`/chronos-cycles/cancel/${taskId}/`);
      return response.data;
    } catch (error) {
      console.error('Failed to cancel cycles:', error);
      throw error;
    }
  },

  completeCycle: async (cycleId, metrics) => {
    try {
      const response = await api.post(`/chronos-cycles/${cycleId}/complete/`, {
        ...metrics,
        completed_at: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to complete cycle:', error);
      throw error;
    }
  },

  updateTimer: async (cycleId, timeRemaining, isBreak) => {
    try {
      const response = await api.post(`/chronos-cycles/${cycleId}/update_timer/`, {
        timeRemaining,
        isBreak,
        last_updated: new Date().toISOString()
      });
      return response.data;
    } catch (error) {
      console.error('Failed to update timer:', error);
      throw error;
    }
  },

  cleanupOrphanedCycles: async () => {
    try {
      const response = await api.post('/chronos-cycles/cleanup/');
      return response.data;
    } catch (error) {
      console.error('Failed to cleanup cycles:', error);
      throw error;
    }
  }
};

export default pomodoroService;