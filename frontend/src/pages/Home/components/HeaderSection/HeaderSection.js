import React from 'react';
import StatusChip from '../../../../components/common/StatusChip/StatusChip.js';
import './HeaderSection.css';

const HeaderSection = ({ 
  greeting = "Добро пожаловать в гид",
  subtitle = "Якутск → Ленские столбы",
  status = "success",
  statusMessage = "✅ Офлайн-карта загружена"
}) => {
  return (
    <header className="header-section">
      <h1 className="header-section__greeting">{greeting}</h1>
      <p className="header-section__subtitle">{subtitle}</p>
      <StatusChip status={status} message={statusMessage} />
    </header>
  );
};

export default HeaderSection;