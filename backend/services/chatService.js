import deepseekClient from './deepseekClient.js';
import { retryWithBackoff } from '../utils/retry.js';
import { config } from './config.js';

/**
 * Chat Service
 * Handles chat operations with error handling and retry logic
 */
class ChatService {
  /**
   * Send a chat message with optional context
   * @param {string} message - User's message
   * @param {Object} options - Options including context and conversation history
   * @returns {Promise<Object>} Response with message and metadata
   */
  async sendMessage(message, options = {}) {
    const { context = null, conversationHistory = [], temperature, maxTokens } = options;

    // Format messages for API
    const messages = deepseekClient.formatMessages(
      message,
      context,
      conversationHistory
    );

    // Retry logic for API calls
    const apiResponse = await retryWithBackoff(
      () => deepseekClient.chat(messages, { temperature, maxTokens }),
      {
        maxRetries: 3,
        initialDelay: 1000,
        maxDelay: 10000,
      }
    );

    // Extract response text
    const responseText = deepseekClient.extractResponse(apiResponse);

    return {
      message: responseText,
      usage: apiResponse.usage || {},
      model: apiResponse.model || 'deepseek-chat',
      finishReason: apiResponse.choices?.[0]?.finish_reason || 'stop',
    };
  }

  /**
   * Validate message input
   * @param {string} message - Message to validate
   * @throws {Error} If message is invalid
   */
  validateMessage(message) {
    if (!message || typeof message !== 'string') {
      throw new Error('Message must be a non-empty string');
    }

    if (message.trim().length === 0) {
      throw new Error('Message cannot be empty');
    }

    const maxLength = config.limits.maxMessageLength;
    if (message.length > maxLength) {
      throw new Error(`Message is too long (max ${maxLength} characters)`);
    }
  }

  /**
   * Validate context input
   * @param {string} context - Context to validate
   * @throws {Error} If context is invalid
   */
  validateContext(context) {
    if (context !== null && typeof context !== 'string') {
      throw new Error('Context must be a string or null');
    }

    if (context) {
      const maxLength = config.limits.maxContextLength;
      if (context.length > maxLength) {
        throw new Error(`Context is too long (max ${maxLength} characters). Consider splitting it into smaller parts or increase MAX_CONTEXT_LENGTH in .env`);
      }
    }
  }
}

export default new ChatService();

