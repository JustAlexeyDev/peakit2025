import React from 'react';
import StatusChip from '../../../../components/common/StatusChip/StatusChip.js';
import './HeaderSection.css';

const HeaderSection = ({ 
  greeting = "Добро пожаловать!",
  subtitle = "Якутск → Ленские столбы",
}) => {
  return (
    <header className="header-section">
      <h1 className="header-section__greeting">{greeting}</h1>
      <p className="header-section__subtitle">{subtitle}</p>
    </header>
  );
};

export default HeaderSection;