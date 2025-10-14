import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../../components/common/Card/Card.js';
import ProgressBar from '../../../../components/common/ProgressBar/ProgressBar.js';
import './TrailProgress.css';

const TrailProgress = ({ 
  title = "Экотропа «Ленские столбы»",
  current = 3,
  total = 12,
  progressColor = "#007aff",
  onViewDetails,
  onResetProgress
}) => {
  const navigate = useNavigate();
  const progress = current / total;
  
  const handleCardClick = () => {
    if (onViewDetails) {
      onViewDetails();
    } else {
      navigate('/Map');
    }
  };

  const handleReset = (e) => {
    e.stopPropagation();
    if (onResetProgress) {
      onResetProgress();
    }
  };

  const getProgressText = () => {
    if (progress === 1) {
      return "Маршрут завершен! 🎉";
    } else if (progress > 0.5) {
      return "Больше половины пройдено! 💪";
    } else if (progress > 0) {
      return "Начало положено! 🚀";
    } else {
      return "Готовы начать? 🗺️";
    }
  };

  return (
    <Card className="trail-progress trail-progress--clickable" onClick={handleCardClick}>
      <div className="trail-progress__header">
        <h3 className="trail-progress__title">{title}</h3>
        <div className="trail-progress__controls">
          <span className="trail-progress__count">{current}/{total}</span>
          {current > 0 && (
            <button 
              className="trail-progress__reset-btn"
              onClick={handleReset}
              title="Сбросить прогресс"
            >
              🔄
            </button>
          )}
        </div>
      </div>
      
      <ProgressBar progress={progress} color={progressColor} />
      
      <div className="trail-progress__info">
        <p className="trail-progress__hint">
          Пройдено {current} из {total} точек
        </p>
        <p className="trail-progress__status">
          {getProgressText()}
        </p>
      </div>
      
      <div className="trail-progress__action">
        <span className="trail-progress__action-text">
          Нажмите для просмотра на карте
        </span>
      </div>
    </Card>
  );
};

export default TrailProgress;