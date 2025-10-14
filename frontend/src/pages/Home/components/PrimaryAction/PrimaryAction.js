import React from 'react';
import './PrimaryAction.css';

const PrimaryAction = ({ 
  text = "Начать маршрут", 
  onClick, 
  className = '',
  disabled = false 
}) => {
  return (
    <button 
      className={`primary-action ${disabled ? 'primary-action--disabled' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {text}
    </button>
  );
};

export default PrimaryAction;