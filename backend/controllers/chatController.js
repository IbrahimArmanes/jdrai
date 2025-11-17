import chatService from '../services/chatService.js';

/**
 * Handle chat message request
 */
export const sendMessage = async (req, res, next) => {
  try {
    const { message, context, conversationHistory } = req.body;

    // Validate inputs
    chatService.validateMessage(message);
    if (context !== undefined) {
      chatService.validateContext(context);
    }

    // Send message to Deepseek API
    const response = await chatService.sendMessage(message, {
      context: context || null,
      conversationHistory: conversationHistory || [],
    });

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Health check for chat service
 */
export const healthCheck = async (req, res) => {
  res.json({
    status: 'ok',
    service: 'chat',
    timestamp: new Date().toISOString(),
  });
};

