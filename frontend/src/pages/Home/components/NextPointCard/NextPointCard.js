import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../../../components/common/Card/Card.js';
import './NextPointCard.css';

const NextPointCard = ({ 
  nextPoint,
  onNavigateToMap,
  onMarkCompleted
}) => {
  const navigate = useNavigate();

  if (!nextPoint) {
    return (
      <Card className="next-point-card next-point-card--no-point">
        <h3 className="next-point-card__title">Маршрут завершен!</h3>
        <p className="next-point-card__hint">
          Поздравляем! Вы прошли весь маршрут по Ленским столбам.
        </p>
      </Card>
    );
  }

  const handleCardClick = () => {
    if (onNavigateToMap) {
      onNavigateToMap(nextPoint);
    } else {
      navigate('/Map');
    }
  };

  const handleMarkCompleted = (e) => {
    e.stopPropagation();
    if (onMarkCompleted) {
      onMarkCompleted(nextPoint.id);
    }
  };

  return (
    <Card className="next-point-card next-point-card--clickable" onClick={handleCardClick}>
      <div className="next-point-card__header">
        <h3 className="next-point-card__title">Следующая точка</h3>
        <button 
          className="next-point-card__mark-btn"
          onClick={handleMarkCompleted}
          title="Отметить как пройденную"
        >
          ✓
        </button>
      </div>
      
      <div className="next-point-card__info">
        <div className="next-point-card__name">{nextPoint.name}</div>
        <div className="next-point-card__details">
          <span className="next-point-card__detail">🚗 {nextPoint.distance}</span>
          <span className="next-point-card__detail">⏱️ {nextPoint.time}</span>
        </div>
      </div>
      
      <p className="next-point-card__hint">
        {nextPoint.hasAudio ? 'Аудиогид запустится автоматически' : 'Нажмите для просмотра на карте'}
      </p>
      
      <div className="next-point-card__action">
        <span className="next-point-card__action-text">Нажмите для навигации</span>
      </div>
    </Card>
  );
};

export default NextPointCard;