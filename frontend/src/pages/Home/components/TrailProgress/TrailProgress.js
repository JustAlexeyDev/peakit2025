import React from 'react';
import Card from '../../../../components/common/Card/Card.js';
import ProgressBar from '../../../../components/common/ProgressBar/ProgressBar.js';
import './TrailProgress.css';

const TrailProgress = ({ 
  title = "Экотропа «Ленские столбы»",
  current = 3,
  total = 12,
  progressColor = "#007aff"
}) => {
  const progress = current / total;
  
  return (
    <Card className="trail-progress">
      <div className="trail-progress__header">
        <h3 className="trail-progress__title">{title}</h3>
        <span className="trail-progress__count">{current}/{total}</span>
      </div>
      <ProgressBar progress={progress} color={progressColor} />
      <p className="trail-progress__hint">
        Пройдено {current} из {total} точек
      </p>
    </Card>
  );
};

export default TrailProgress;