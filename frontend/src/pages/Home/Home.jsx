// src/components/Home.js
import React from 'react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import PrimaryAction from './components/PrimaryAction/PrimaryAction';
import NextPointCard from './components/NextPointCard/NextPointCard';
import TrailProgress from './components/TrailProgress/TrailProgress';
import QuickActions from './components/QuickActions/QuickActions';
import InfoCard from './components/InfoCard/InfoCard';
import './Home.css';
import { useNavigate } from 'react-router';

const Home = () => {
    const naviagte = useNavigate();

    const appData = {
        isOfflineReady: true,
        nextPoint: {
            name: "Покровск",
            distance: "15 км",
            time: "20 мин"
        },
        trailProgress: {
            current: 3,
            total: 12
        },
        quickActions: [
            { icon: '⛽', label: 'АЗС', onClick: () => console.log('Open gas stations') },
            { icon: '🍴', label: 'Еда', onClick: () => console.log('Open food places') },
            { icon: '🏞️', label: 'Смотровые', onClick: () => console.log('Open viewpoints') },
            { icon: '📋', label: 'Чек-лист', onClick: () => console.log('Open checklist') }
        ]
    };

    const handleStartRoute = () => {
        naviagte('/Map')
    };

    const handleOpenRules = () => {
        console.log('Open park rules');
    };

    return (
        <div className="home">
            <HeaderSection
                status={appData.isOfflineReady ? 'success' : 'warning'}
                statusMessage={
                    appData.isOfflineReady
                        ? "✅ Офлайн-карта загружена"
                        : "⚠️ Загрузите офлайн-карту"
                }
            />

            <NextPointCard
                pointName={appData.nextPoint.name}
                distance={appData.nextPoint.distance}
                time={appData.nextPoint.time}
            />

            <TrailProgress
                current={appData.trailProgress.current}
                total={appData.trailProgress.total}
            />

            <QuickActions
                actions={appData.quickActions}
            />

            <InfoCard
                text="Правила посещения парка"
                onClick={handleOpenRules}
            />

            <PrimaryAction
                text="Начать маршрут"
                onClick={handleStartRoute}
            />
        </div>
    );
};

export default Home;