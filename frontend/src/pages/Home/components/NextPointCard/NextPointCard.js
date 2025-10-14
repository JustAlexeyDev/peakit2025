import React from 'react';
import Card from '../../../../components/common/Card/Card.js';
import './NextPointCard.css';

const NextPointCard = ({ 
  pointName = "Покровск",
  distance = "15 км",
  time = "20 мин",
  hint = "Аудиогид запустится автоматически"
}) => {
  return (
    <Card className="next-point-card">
      <h3 className="next-point-card__title">Следующая точка</h3>
      <div className="next-point-card__info">
        <div className="next-point-card__name">{pointName}</div>
        <div className="next-point-card__details">
          <span className="next-point-card__detail">🚗 {distance}</span>
          <span className="next-point-card__detail">⏱️ {time}</span>
        </div>
      </div>
      <p className="next-point-card__hint">{hint}</p>
    </Card>
  );
};

export default NextPointCard;