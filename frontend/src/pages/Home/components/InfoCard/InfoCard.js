import React from 'react';
import Card from '../../../../components/common/Card/Card.js';
import './InfoCard.css';

const InfoCard = ({ 
  icon = '📜',
  text = 'Правила посещения парка',
  onClick,
  variant = 'bordered'
}) => {
  return (
    <Card variant={variant} className="info-card" onClick={onClick}>
      <div className="info-card__content">
        <span className="info-card__icon">{icon}</span>
        <span className="info-card__text">{text}</span>
      </div>
    </Card>
  );
};

export default InfoCard;