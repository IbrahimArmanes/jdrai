import React, { useState } from 'react';
import './MessageInput.css';

function MessageInput({ onSendMessage, isLoading, disabled }) {
  const [message, setMessage] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isLoading && !disabled) {
      onSendMessage(message.trim());
      setMessage('');
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form className="message-input-form" onSubmit={handleSubmit}>
      <div className="message-input-container">
        <textarea
          className="message-input-textarea"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Type your message... (Press Enter to send, Shift+Enter for new line)"
          rows={1}
          disabled={isLoading || disabled}
        />
        <button
          type="submit"
          className="message-input-button"
          disabled={!message.trim() || isLoading || disabled}
        >
          {isLoading ? '...' : 'Send'}
        </button>
      </div>
    </form>
  );
}

export default MessageInput;

