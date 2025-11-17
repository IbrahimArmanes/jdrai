import { config, validateConfig } from './config.js';

/**
 * Deepseek API Client
 * Handles HTTP requests to Deepseek API for chat functionality
 */
class DeepseekClient {
  constructor() {
    this.apiKey = config.deepseek.apiKey;
    this.apiUrl = config.deepseek.apiUrl;
    this.model = config.deepseek.model;
    this.temperature = config.deepseek.temperature;
    this.maxTokens = config.deepseek.maxTokens;
  }

  /**
   * Send a chat message to Deepseek API
   * @param {Array} messages - Array of message objects with role and content
   * @param {Object} options - Optional parameters (temperature, maxTokens, etc.)
   * @returns {Promise<Object>} API response
   */
  async chat(messages, options = {}) {
    // Validate configuration when actually using the API
    validateConfig();

    const requestBody = {
      model: this.model,
      messages: messages,
      temperature: options.temperature || this.temperature,
      max_tokens: options.maxTokens || this.maxTokens,
      stream: false,
    };

    try {
      // Deepseek API endpoint: https://api.deepseek.com/v1/chat/completions
      const apiEndpoint = `${this.apiUrl}/v1/chat/completions`;
      console.log('Calling Deepseek API:', apiEndpoint);
      
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify(requestBody),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData.error?.message || errorData.message || response.statusText;
        console.error('Deepseek API error:', {
          status: response.status,
          statusText: response.statusText,
          errorData
        });
        throw new Error(
          `Deepseek API error: ${response.status} ${response.statusText}. ${errorMessage}`
        );
      }

      const data = await response.json();
      return data;
    } catch (error) {
      if (error instanceof Error) {
        throw error;
      }
      throw new Error(`Failed to communicate with Deepseek API: ${error.message}`);
    }
  }

  /**
   * Format messages for API request
   * @param {string} userMessage - User's message
   * @param {string} context - Optional system context/instruction
   * @param {Array} conversationHistory - Previous conversation messages
   * @returns {Array} Formatted messages array
   */
  formatMessages(userMessage, context = null, conversationHistory = []) {
    const messages = [];

    // Add system context if provided
    if (context) {
      messages.push({
        role: 'system',
        content: context,
      });
    }

    // Add conversation history
    if (conversationHistory.length > 0) {
      messages.push(...conversationHistory);
    }

    // Add current user message
    messages.push({
      role: 'user',
      content: userMessage,
    });

    return messages;
  }

  /**
   * Extract response text from API response
   * @param {Object} apiResponse - Response from Deepseek API
   * @returns {string} Response text
   */
  extractResponse(apiResponse) {
    if (apiResponse.choices && apiResponse.choices.length > 0) {
      return apiResponse.choices[0].message.content;
    }
    throw new Error('Invalid response format from Deepseek API');
  }
}

export default new DeepseekClient();

