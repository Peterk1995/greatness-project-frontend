import api from './api'; // Your axios instance with baseURL & token config

export const campaignService = {
  create: (data) => api.post('/campaigns/', data),
  getAll: () => api.get('/campaigns/'),
  get: (id) => api.get(`/campaigns/${id}/`),
  update: (id, data) => api.put(`/campaigns/${id}/`, data),
  delete: (id) => api.delete(`/campaigns/${id}/`),
  addXp: (id, data) => api.post(`/campaigns/${id}/add_xp/`, data),
  completeCampaign: async (campaignId, data) => {
    try {
      const response = await api.post(
        `/campaigns/${campaignId}/complete_campaign/`,
        data
      );
      return response.data;
    } catch (error) {
      console.error('Campaign completion failed:', error);
      throw new Error(error.response?.data?.error || 'Failed to complete campaign');
    }
  },
  getCampaignStatus: async (campaignId) => {
    const response = await api.get(`/campaigns/${campaignId}/`);
    return {
      isComplete: response.data.status === 'completed',
      isReadyForCompletion: response.data.ready_for_completion,
      progress: response.data.progress
    };
  }
};
