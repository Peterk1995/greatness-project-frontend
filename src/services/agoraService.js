// src/services/agoraService.js
import api from './api';

// Remove the /api prefix since it's already in the base URL
const DISCIPLINES_URL = '/disciplines/';
const ACTIONS_URL = '/actions/';

const agoraService = {
    // Discipline Management
    disciplines: {
        // Fetch all disciplines
        getAll: async () => {
            try {
                console.log('Fetching disciplines from:', DISCIPLINES_URL);
                const response = await api.get(DISCIPLINES_URL);
                console.log('Fetched disciplines:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error fetching disciplines:', error);
                console.error('Full URL:', api.defaults.baseURL + DISCIPLINES_URL);
                throw error;
            }
        },

        // Fetch a discipline by ID
        getById: async (id) => {
            try {
                const response = await api.get(`${DISCIPLINES_URL}${id}/`);
                return response.data;
            } catch (error) {
                console.error('Error fetching discipline:', error);
                throw error;
            }
        },

        // Create a new discipline
        create: async (data) => {
            try {
                const response = await api.post(DISCIPLINES_URL, data);
                return response.data;
            } catch (error) {
                console.error('Error creating discipline:', error);
                throw error;
            }
        },

        // Update an existing discipline
        update: async (id, data) => {
            try {
                const response = await api.patch(`${DISCIPLINES_URL}${id}/`, data);
                return response.data;
            } catch (error) {
                console.error('Error updating discipline:', error);
                throw error;
            }
        },

        // Delete a discipline
        delete: async (id) => {
            try {
                await api.delete(`${DISCIPLINES_URL}${id}/`);
                return true;
            } catch (error) {
                console.error('Error deleting discipline:', error);
                throw error;
            }
        },

        // Get disciplines by path
        getByPath: async (path) => {
            try {
                const response = await api.get(DISCIPLINES_URL, { params: { path } });
                return response.data;
            } catch (error) {
                console.error('Error fetching disciplines by path:', error);
                throw error;
            }
        }
    },

    // Action Management
    actions: {
        // Fetch all actions with optional filters
        getAll: async (filters = {}) => {
            try {
                const response = await api.get(ACTIONS_URL, { params: filters });
                return response.data;
            } catch (error) {
                console.error('Error fetching actions:', error);
                throw error;
            }
        },

        // Fetch an action by ID
        getById: async (id) => {
            try {
                const response = await api.get(`${ACTIONS_URL}${id}/`);
                return response.data;
            } catch (error) {
                console.error('Error fetching action:', error);
                throw error;
            }
        },

        // Create a new action with data transformation
        create: async (data) => {
            try {
                console.log('Creating action with data:', data);
                console.log('Posting to URL:', ACTIONS_URL);
                
                // Transform data for API
                const apiData = {
                    ...data,
                    action_type: 'daily',  // Set default type (modify as needed)
                    domain: data.metrics?.domain || 'wisdom', // Default domain
                    metrics: {
                        ...data.metrics,
                        timestamp: new Date().toISOString() // Add timestamp
                    }
                };

                console.log('Transformed API data:', apiData);
                const response = await api.post(ACTIONS_URL, apiData);
                console.log('API Response:', response.data);
                return response.data;
            } catch (error) {
                console.error('Error creating action:', error);
                console.error('Error response:', error.response?.data);
                throw error;
            }
        },

        // Update an existing action
        update: async (id, data) => {
            try {
                const response = await api.patch(`${ACTIONS_URL}${id}/`, data);
                return response.data;
            } catch (error) {
                console.error('Error updating action:', error);
                throw error;
            }
        },

        // Delete an action
        delete: async (id) => {
            try {
                await api.delete(`${ACTIONS_URL}${id}/`);
                return true;
            } catch (error) {
                console.error('Error deleting action:', error);
                throw error;
            }
        },

        // Complete an action
        completeAction: async (id, completionData) => {
            try {
              console.log(`Sending POST to: ${ACTIONS_URL}${id}/complete/`);
              console.log('With data:', JSON.stringify(completionData, null, 2));
              
              const response = await api.post(`${ACTIONS_URL}${id}/complete/`, completionData);
              console.log('Completion successful:', response.data);
              return response.data;
            } catch (error) {
              console.error('Completion failed:', error);
              console.error('Error response:', error.response?.data);
              console.error('Full error:', error);
              throw error;
            }
          },

        // Daily Actions
        getDailyActions: async (filters = {}) => {
            try {
                const response = await api.get(ACTIONS_URL, {
                    params: { ...filters, action_type: 'daily' }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching daily actions:', error);
                throw error;
            }
        },

        createDailyAction: async (data) => {
            try {
                const response = await api.post(ACTIONS_URL, {
                    ...data,
                    action_type: 'daily'
                });
                return response.data;
            } catch (error) {
                console.error('Error creating daily action:', error);
                throw error;
            }
        },

        // Monthly Actions
        getMonthlyActions: async (filters = {}) => {
            try {
                const response = await api.get(ACTIONS_URL, {
                    params: { ...filters, action_type: 'monthly' }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching monthly actions:', error);
                throw error;
            }
        },

        createMonthlyAction: async (data) => {
            try {
                const response = await api.post(ACTIONS_URL, {
                    ...data,
                    action_type: 'monthly'
                });
                return response.data;
            } catch (error) {
                console.error('Error creating monthly action:', error);
                throw error;
            }
        },

        // Domain-specific actions
        getByDomain: async (domain) => {
            try {
                const response = await api.get(ACTIONS_URL, {
                    params: { domain }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching actions by domain:', error);
                throw error;
            }
        },

        // Stats and Analytics
        getStats: async () => {
            try {
                const response = await api.get(`${ACTIONS_URL}stats/`);
                return response.data;
            } catch (error) {
                console.error('Error fetching action stats:', error);
                throw error;
            }
        },

        // Campaign Integration
        linkToCampaign: async (actionId, campaignId) => {
            try {
                const response = await api.patch(`${ACTIONS_URL}${actionId}/`, {
                    campaign: campaignId
                });
                return response.data;
            } catch (error) {
                console.error('Error linking action to campaign:', error);
                throw error;
            }
        }
    },

    // Helper Methods
    helpers: {
        // Get actions by completion status
        getCompletedActions: async () => {
            try {
                const response = await api.get(ACTIONS_URL, {
                    params: { is_completed: true }
                });
                return response.data;
            } catch (error) {
                console.error('Error fetching completed actions:', error);
                throw error;
            }
        },

        // Get active actions that can be completed now
        getCompletableActions: async () => {
            try {
                const response = await api.get(ACTIONS_URL);
                // Assuming 'can_complete_now' is a boolean field in the action object
                return response.data.filter(action => action.can_complete_now);
            } catch (error) {
                console.error('Error fetching completable actions:', error);
                throw error;
            }
        },

        // Format metrics based on discipline type
        formatMetrics: (discipline, value) => {
            switch (discipline.primary_metric) {
                case 'distance':
                    return `${value} ${discipline.metric_unit}`;
                case 'duration':
                    return `${Math.floor(value / 60)}h ${value % 60}m`;
                case 'calories':
                    return `${value} kcal`;
                case 'percentage':
                    return `${value}%`;
                default:
                    return value.toString();
            }
        }
    }
};

export default agoraService;
