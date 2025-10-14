import React from 'react';
import Card from '../../../../components/common/Card/Card.js';
import './QuickActions.css';

const QuickActions = ({ 
  title = "Быстрый доступ",
  actions = [
    { icon: '⛽', label: 'АЗС', onClick: () => {} },
    { icon: '🍴', label: 'Еда', onClick: () => {} },
    { icon: '🏞️', label: 'Смотровые', onClick: () => {} },
    { icon: '📋', label: 'Чек-лист', onClick: () => {} }
  ]
}) => {
  return (
    <Card className="quick-actions">
      <h3 className="quick-actions__title">{title}</h3>
      <div className="quick-actions__grid">
        {actions.map((action, index) => (
          <button
            key={index}
            className="quick-actions__item"
            onClick={action.onClick}
            type="button"
          >
            <span className="quick-actions__icon">{action.icon}</span>
            <span className="quick-actions__label">{action.label}</span>
          </button>
        ))}
      </div>
    </Card>
  );
};

export default QuickActions;