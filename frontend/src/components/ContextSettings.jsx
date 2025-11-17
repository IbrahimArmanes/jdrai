import React, { useState, useEffect } from 'react';
import { contextFileService } from '../utils/contextFile';
import './ContextSettings.css';

function ContextSettings({ context, onContextChange, onClose }) {
  const [localContext, setLocalContext] = useState(context || '');
  const [isLoading, setIsLoading] = useState(false);

  // Load from file when modal opens
  useEffect(() => {
    const loadFromFile = async () => {
      setIsLoading(true);
      const fileContext = await contextFileService.loadFromFile();
      if (fileContext) {
        setLocalContext(fileContext);
      } else if (context) {
        setLocalContext(context);
      }
      setIsLoading(false);
    };
    loadFromFile();
  }, []);

  const handleSave = async () => {
    const trimmedContext = localContext.trim() || null;
    await contextFileService.saveToFile(trimmedContext || '');
    onContextChange(trimmedContext);
    onClose();
  };

  const handleClear = async () => {
    setLocalContext('');
    await contextFileService.saveToFile('');
    onContextChange(null);
    onClose();
  };

  const handleLoadFromFile = async () => {
    setIsLoading(true);
    const fileContext = await contextFileService.loadFromFile();
    if (fileContext) {
      setLocalContext(fileContext);
    }
    setIsLoading(false);
  };

  return (
    <div className="context-settings-overlay" onClick={onClose}>
      <div className="context-settings-modal" onClick={(e) => e.stopPropagation()}>
        <div className="context-settings-header">
          <h3>Context Settings</h3>
          <button className="context-settings-close" onClick={onClose}>×</button>
        </div>
        <div className="context-settings-body">
          <p className="context-settings-description">
            Set a system message or initial context that will be used for all conversations.
            This helps guide the AI's behavior and responses. The context is saved to <code>context.txt</code> file.
          </p>
          <div className="context-settings-actions">
            <button 
              className="context-settings-button-load"
              onClick={handleLoadFromFile}
              disabled={isLoading}
            >
              {isLoading ? 'Loading...' : '📂 Load from file'}
            </button>
          </div>
          <textarea
            className="context-settings-textarea"
            value={localContext}
            onChange={(e) => setLocalContext(e.target.value)}
            placeholder="Example: You are a helpful assistant specialized in RPG games..."
            rows={10}
            disabled={isLoading}
          />
        </div>
        <div className="context-settings-footer">
          <button className="context-settings-button-clear" onClick={handleClear} disabled={isLoading}>
            Clear
          </button>
          <button className="context-settings-button-save" onClick={handleSave} disabled={isLoading}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default ContextSettings;

