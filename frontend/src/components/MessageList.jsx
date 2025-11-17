import React, { useEffect, useRef } from 'react';
import MarkdownContent from './MarkdownContent';
import './MessageList.css';

function MessageList({ messages }) {
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  return (
    <div className="message-list">
      {messages.length === 0 ? (
        <div className="message-list-empty">
          <p>Start a conversation by typing a message below.</p>
        </div>
      ) : (
        messages.map((msg, index) => (
          <div
            key={index}
            className={`message-item message-item-${msg.role}`}
          >
            <div className="message-content">
              <div className="message-header">
                <span className="message-role">
                  {msg.role === 'user' ? 'You' : 'Assistant'}
                </span>
              </div>
              <div className="message-text">
                <MarkdownContent content={msg.content} />
              </div>
            </div>
          </div>
        ))
      )}
      <div ref={messagesEndRef} />
    </div>
  );
}

export default MessageList;

