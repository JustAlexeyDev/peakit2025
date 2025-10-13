import React, { useState, useEffect } from 'react';
import './WelcomeScreen.css'
import logo from "../../assets/images/logo.png"

const WelcomeScreen = () => {
    const [showWelcome, setShowWelcome] = useState(false);

    useEffect(() => {
        const hasSeenWelcome = localStorage.getItem('hasSeenWelcome');

        if (!hasSeenWelcome) {
            setShowWelcome(true);
        }
    }, []);

    const handleClose = () => {
        setShowWelcome(false);
        localStorage.setItem('hasSeenWelcome', 'true');
    };

    if (!showWelcome) return null;

    return (
        <div className='WelcomeScreen--Container'>
            <div className='WelcomeScreen--Container__Content'>
                <img src={logo} alt="Логотип" width={300}/>
                <div>
                    <button
                        onClick={handleClose}
                        className="welcome-screen-button"
                    >
                        Начать!
                    </button>
                </div>
                <span className="welcome-screen-terms">
                    <p>Нажимая "Начать!" я принимаю условия пользования и политику в отношении обработки персональных данных</p>
                </span>
            </div>
        </div>
    );
};

export default WelcomeScreen;