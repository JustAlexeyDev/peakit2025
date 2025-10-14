// src/components/common/ProgressBar/ProgressBar.js
import React from 'react';
import './ProgressBar.css';

const ProgressBar = ({ progress, color = '#007aff', className = '' }) => {
  const progressPercent = Math.min(progress * 100, 100);
  
  return (
    <div className={`progress-bar ${className}`}>
      <div 
        className="progress-bar__fill"
        style={{ 
          width: `${progressPercent}%`,
          backgroundColor: color
        }}
      />
    </div>
  );
};

export default ProgressBar;