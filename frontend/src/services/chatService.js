import api from './api.js';

/**
 * Chat Service for frontend
 * Handles API calls to backend chat endpoints
 */
export const chatService = {
  /**
   * Send a chat message
   * @param {string} message - User's message
   * @param {Object} options - Options including context and conversation history
   * @returns {Promise<Object>} Response from API
   */
  async sendMessage(message, options = {}) {
    const { context = null, conversationHistory = [] } = options;

    const response = await api.post('/chat/message', {
      message,
      context,
      conversationHistory,
    });

    return response.data;
  },

  /**
   * Check chat service health
   * @returns {Promise<Object>} Health status
   */
  async healthCheck() {
    const response = await api.get('/chat/health');
    return response.data;
  },
};

