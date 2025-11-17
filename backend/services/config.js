import dotenv from 'dotenv';

dotenv.config();

export const config = {
  deepseek: {
    apiKey: process.env.DEEPSEEK_API_KEY || '',
    apiUrl: process.env.DEEPSEEK_API_URL || 'https://api.deepseek.com',
    model: process.env.DEEPSEEK_MODEL || 'deepseek-chat',
    temperature: parseFloat(process.env.DEEPSEEK_TEMPERATURE || '0.7'),
    maxTokens: parseInt(process.env.DEEPSEEK_MAX_TOKENS || '2000'),
  },
  server: {
    port: process.env.PORT || 3001,
    nodeEnv: process.env.NODE_ENV || 'development',
  },
  limits: {
    maxContextLength: parseInt(process.env.MAX_CONTEXT_LENGTH || '20000'),
    maxMessageLength: parseInt(process.env.MAX_MESSAGE_LENGTH || '10000'),
  },
};

// Validate required configuration (only when needed, not on import)
export const validateConfig = () => {
  if (!config.deepseek.apiKey) {
    throw new Error('DEEPSEEK_API_KEY is required in environment variables');
  }
  return true;
};

