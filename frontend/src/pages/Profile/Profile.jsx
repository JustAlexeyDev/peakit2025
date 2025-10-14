import React from 'react';
import LoginForm from '../../components/auth/LoginForm.jsx';
import { useAuth } from '../../modules/hooks/useAuth.js';

const Profile = () => {
    const { user, isAuthenticated, logout } = useAuth();

    if (!isAuthenticated) {
        return (
            <div style={{ padding: 16 }}>
                <LoginForm />
            </div>
        );
    }

    return (
        <div style={{ padding: 16 }}>
            <h2>Профиль</h2>
            <div style={{ marginTop: 12 }}>
                <div><b>Телефон:</b> {user?.phone || '—'}</div>
                <div><b>Имя:</b> {user?.name || '—'}</div>
            </div>
            <button style={{ marginTop: 16 }} onClick={() => logout()}>Выйти</button>
        </div>
    );
};

export default Profile;



