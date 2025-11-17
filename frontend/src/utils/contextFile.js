import api from '../services/api.js';

/**
 * Utility functions for managing context file
 */

export const contextFileService = {
  /**
   * Load context from file
   * @returns {Promise<string|null>} Context content or null if file doesn't exist
   */
  async loadFromFile() {
    try {
      const response = await api.get('/context');
      if (response.data && response.data.context) {
        const text = response.data.context.trim();
        return text || null;
      }
      return null;
    } catch (error) {
      // If file doesn't exist, return null (not an error)
      if (error.response?.status === 404) {
        return null;
      }
      console.error('Error loading context file:', error);
      return null;
    }
  },

  /**
   * Save context to file (via backend API)
   * @param {string} context - Context to save
   * @returns {Promise<boolean>} Success status
   */
  async saveToFile(context) {
    try {
      const response = await api.post('/context', {
        context: context || '',
      });
      return response.data?.success || false;
    } catch (error) {
      console.error('Error saving context file:', error);
      return false;
    }
  },
};

