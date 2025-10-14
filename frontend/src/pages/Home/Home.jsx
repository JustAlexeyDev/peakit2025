// src/components/Home.js
import React, { useState, useEffect } from 'react';
import HeaderSection from './components/HeaderSection/HeaderSection';
import PrimaryAction from './components/PrimaryAction/PrimaryAction';
import NextPointCard from './components/NextPointCard/NextPointCard';
import TrailProgress from './components/TrailProgress/TrailProgress';
import QuickActions from './components/QuickActions/QuickActions';
import InfoCard from './components/InfoCard/InfoCard';
import './Home.css';
import { useNavigate } from 'react-router';
import { useRoute } from '../../modules/hooks/useRoute.js';

const Home = () => {
    const navigate = useNavigate();
    const { 
        routeProgress, 
        nextPoint, 
        loading, 
        error,
        startRoute,
        markPointCompleted,
        resetRoute,
        refreshData
    } = useRoute();

    const [isStartingRoute, setIsStartingRoute] = useState(false);

    const quickActions = [
        { icon: '⛽', label: 'АЗС', onClick: () => navigate('/Map?filter=gas') },
        { icon: '🍴', label: 'Еда', onClick: () => navigate('/Map?filter=food') },
        { icon: '🏞️', label: 'Смотровые', onClick: () => navigate('/Map?filter=viewpoint') },
        { icon: '📋', label: 'Чек-лист', onClick: () => console.log('Open checklist') }
    ];

    const handleStartRoute = async () => {
        try {
            setIsStartingRoute(true);
            await startRoute();
            navigate('/Map');
        } catch (error) {
            console.error('Error starting route:', error);
            alert('Ошибка при запуске маршрута');
        } finally {
            setIsStartingRoute(false);
        }
    };

    const handleNavigateToMap = (point) => {
        // Переходим на карту и центрируем на точке
        navigate('/Map', { 
            state: { 
                centerOnPoint: point.coordinates,
                zoom: 15
            }
        });
    };

    const handleMarkCompleted = async (pointId) => {
        try {
            await markPointCompleted(pointId);
            alert('Точка отмечена как пройденная!');
        } catch (error) {
            console.error('Error marking point completed:', error);
            alert('Ошибка при отметке точки');
        }
    };

    const handleResetProgress = async () => {
        if (window.confirm('Вы уверены, что хотите сбросить весь прогресс?')) {
            try {
                await resetRoute();
                alert('Прогресс сброшен!');
            } catch (error) {
                console.error('Error resetting route:', error);
                alert('Ошибка при сбросе прогресса');
            }
        }
    };

    const handleOpenRules = () => {
        console.log('Open park rules');
    };

    if (loading) {
        return (
            <div className="home">
                <HeaderSection/>
                <div className="home__loading">
                    <div className="home__loading-spinner"></div>
                    <p>Загрузка данных маршрута...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="home">
            <HeaderSection/>

            {error && (
                <div className="home__error">
                    <p>⚠️ {error}</p>
                    <button onClick={refreshData}>Повторить</button>
                </div>
            )}

            <NextPointCard
                nextPoint={nextPoint}
                onNavigateToMap={handleNavigateToMap}
                onMarkCompleted={handleMarkCompleted}
            />

            <TrailProgress
                current={routeProgress.completedPoints.length}
                total={routeProgress.totalPoints}
                onViewDetails={() => navigate('/Map')}
                onResetProgress={handleResetProgress}
            />

            <QuickActions
                actions={quickActions}
            />

            <InfoCard
                text="Правила посещения парка"
                onClick={handleOpenRules}
            />

            <PrimaryAction
                text={isStartingRoute ? "Запуск маршрута..." : "Начать маршрут"}
                onClick={handleStartRoute}
                disabled={isStartingRoute}
            />
        </div>
    );
};

export default Home;