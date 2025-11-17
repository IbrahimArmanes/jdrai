import React, { useState, useCallback, useEffect } from 'react';
import MessageList from '../components/MessageList';
import MessageInput from '../components/MessageInput';
import ContextSettings from '../components/ContextSettings';
import LoadingTimer from '../components/LoadingTimer';
import { chatService } from '../services/chatService';
import { contextFileService } from '../utils/contextFile';
import ErrorBoundary from '../components/ErrorBoundary';
import './Chat.css';

function Chat() {
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [context, setContext] = useState(null);
  const [showContextSettings, setShowContextSettings] = useState(false);

  // Load context from file on mount
  useEffect(() => {
    const loadContext = async () => {
      const loadedContext = await contextFileService.loadFromFile();
      if (loadedContext) {
        setContext(loadedContext);
      }
    };
    loadContext();
  }, []);

  const handleSendMessage = useCallback(async (messageText) => {
    if (!messageText.trim()) return;

    // Add user message to UI immediately
    const userMessage = { role: 'user', content: messageText };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      // Build conversation history (excluding the current user message we just added)
      const conversationHistory = messages.map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

      // Send to API
      const response = await chatService.sendMessage(messageText, {
        context,
        conversationHistory,
      });

      // Add assistant response
      if (response.success && response.data) {
        const assistantMessage = {
          role: 'assistant',
          content: response.data.message,
        };
        setMessages((prev) => [...prev, assistantMessage]);
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (err) {
      // Extract error message from API response if available
      let errorMessage = 'Failed to send message. Please try again.';
      
      if (err.response?.data?.error?.message) {
        errorMessage = err.response.data.error.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      // Remove the user message if there was an error
      setMessages((prev) => prev.slice(0, -1));
      console.error('Error sending message:', err);
      console.error('Error details:', err.response?.data);
    } finally {
      setIsLoading(false);
    }
  }, [messages, context]);

  const handleContextChange = async (newContext) => {
    setContext(newContext);
    // Save to file
    await contextFileService.saveToFile(newContext || '');
    // Clear messages when context changes
    if (newContext !== context) {
      setMessages([]);
    }
  };

  const handleClearConversation = () => {
    setMessages([]);
    setError(null);
  };

  return (
    <ErrorBoundary>
      <div className="chat-container">
        <div className="chat-header">
          <h1>RPG AI Chat</h1>
          <div className="chat-header-actions">
            <button
              className="chat-button-secondary"
              onClick={() => setShowContextSettings(true)}
              title="Set context"
            >
              ⚙️ Context
            </button>
            <button
              className="chat-button-secondary"
              onClick={handleClearConversation}
              disabled={messages.length === 0}
              title="Clear conversation"
            >
              🗑️ Clear
            </button>
          </div>
        </div>

        {context && (
          <div className="chat-context-indicator">
            <span>📝 Context active</span>
            <button
              className="chat-context-remove"
              onClick={() => handleContextChange(null)}
            >
              Remove
            </button>
          </div>
        )}

        {error && (
          <div className="chat-error">
            <span>⚠️ {error}</span>
            <button onClick={() => setError(null)}>×</button>
          </div>
        )}

        <div className="chat-messages-container">
          <MessageList messages={messages} />
        </div>

        <LoadingTimer isLoading={isLoading} />

        <MessageInput
          onSendMessage={handleSendMessage}
          isLoading={isLoading}
          disabled={false}
        />

        {showContextSettings && (
          <ContextSettings
            context={context}
            onContextChange={handleContextChange}
            onClose={() => setShowContextSettings(false)}
          />
        )}
      </div>
    </ErrorBoundary>
  );
}

export default Chat;

