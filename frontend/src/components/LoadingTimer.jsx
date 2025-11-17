import React, { useState, useEffect } from 'react';
import './LoadingTimer.css';

function LoadingTimer({ isLoading }) {
  const [elapsedTime, setElapsedTime] = useState(0);

  useEffect(() => {
    let interval = null;
    
    if (isLoading) {
      setElapsedTime(0);
      interval = setInterval(() => {
        setElapsedTime((prev) => prev + 0.1);
      }, 100);
    } else {
      if (interval) {
        clearInterval(interval);
      }
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isLoading]);

  if (!isLoading) return null;

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = (seconds % 60).toFixed(1);
    if (mins > 0) {
      return `${mins}m ${secs}s`;
    }
    return `${secs}s`;
  };

  return (
    <div className="loading-timer">
      <div className="loading-timer-spinner">
        <div className="spinner"></div>
      </div>
      <div className="loading-timer-text">
        <span className="loading-timer-label">AI is thinking...</span>
        <span className="loading-timer-time">{formatTime(elapsedTime)}</span>
      </div>
    </div>
  );
}

export default LoadingTimer;

