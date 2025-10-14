import React, { useState, useEffect } from 'react';
import LoginForm from '../../components/auth/LoginForm.jsx';
import { useAuth } from '../../modules/hooks/useAuth.js';
import HeaderSection from '../Home/components/HeaderSection/HeaderSection';
import './Profile.css';
import Card from '../../components/common/Card/Card.js';
import PrimaryAction from '../Home/components/PrimaryAction/PrimaryAction';

const Profile = () => {
    const { user, isAuthenticated, logout, updateProfile } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        first_name: '',
        last_name: '',
        avatar: null
    });

    // Обновляем formData при изменении user
    useEffect(() => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                avatar: null
            });
        }
    }, [user]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setFormData(prev => ({ ...prev, avatar: file }));
        }
    };

    const handleSave = async () => {
        setIsLoading(true);
        setError('');
        
        try {
            await updateProfile(formData);
            setIsEditing(false);
        } catch (err) {
            setError('Ошибка сохранения профиля');
        } finally {
            setIsLoading(false);
        }
    };

    const handleCancel = () => {
        if (user) {
            setFormData({
                full_name: user.full_name || '',
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                avatar: null
            });
        }
        setIsEditing(false);
        setError('');
    };

    if (!isAuthenticated) {
        return (
            <div style={{ padding: 16 }}>
                <LoginForm />
            </div>
        );
    }

    return (
        <div className="profile">
            <div className="profile__header">
                <div className="profile__cover" />
                <div className="profile__avatar-wrapper">
                    <div style={{ position: 'relative' }}>
                        <div className="profile__avatar">
                            {user?.avatar ? (
                                <img src={user.avatar} alt="Аватар" className="profile__avatar" />
                            ) : (
                                (user?.full_name?.[0] || user?.username?.[0] || 'U')
                            )}
                        </div>
                        <label className="profile__avatar-edit" title="Изменить аватар">
                            ✎
                            <input type="file" accept="image/*" onChange={handleFileChange} style={{ display: 'none' }} />
                        </label>
                    </div>
                </div>
            </div>

            <div className="profile__title">
                <div className="profile__name">{user?.full_name || user?.username || 'Мой профиль'}</div>
                <div className="profile__subtitle">{user?.phone || ''}</div>
            </div>

            <div className="profile__actions">
                {!isEditing && (
                    <button className="profile__btn profile__btn--primary" onClick={() => setIsEditing(true)}>Редактировать</button>
                )}
                <button className="profile__btn" onClick={() => logout()}>Выйти</button>
            </div>

            <Card>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                    <h3>Информация о профиле</h3>
                    {!isEditing && (
                        <button 
                            onClick={() => setIsEditing(true)}
                            style={{ 
                                background: 'var(--accent--color)', 
                                color: 'white', 
                                border: 'none', 
                                padding: '8px 16px', 
                                borderRadius: '8px',
                                cursor: 'pointer'
                            }}
                        >
                            Редактировать
                        </button>
                    )}
                </div>

                {isEditing ? (
                    <div style={{ display: 'grid', gap: 16 }}>
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Аватар:</label>
                            <input 
                                type="file" 
                                accept="image/*" 
                                onChange={handleFileChange}
                                style={{ marginBottom: 8 }}
                            />
                            {user?.avatar && (
                                <div style={{ marginTop: 8 }}>
                                    <img 
                                        src={user.avatar} 
                                        alt="Текущий аватар" 
                                        style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </div>
                            )}
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Полное имя:</label>
                            <input 
                                type="text" 
                                name="full_name" 
                                value={formData.full_name} 
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Имя:</label>
                            <input 
                                type="text" 
                                name="first_name" 
                                value={formData.first_name} 
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </div>
                        
                        <div>
                            <label style={{ display: 'block', marginBottom: 4, fontWeight: 'bold' }}>Фамилия:</label>
                            <input 
                                type="text" 
                                name="last_name" 
                                value={formData.last_name} 
                                onChange={handleInputChange}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc' }}
                            />
                        </div>

                        {error && <div style={{ color: 'red' }}>{error}</div>}

                        <div style={{ display: 'flex', gap: 12 }}>
                            <button 
                                onClick={handleSave} 
                                disabled={isLoading}
                                style={{ 
                                    background: 'var(--accent--color)', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 16px', 
                                    borderRadius: '8px',
                                    cursor: 'pointer',
                                    opacity: isLoading ? 0.6 : 1
                                }}
                            >
                                {isLoading ? 'Сохранение...' : 'Сохранить'}
                            </button>
                            <button 
                                onClick={handleCancel}
                                style={{ 
                                    background: '#666', 
                                    color: 'white', 
                                    border: 'none', 
                                    padding: '8px 16px', 
                                    borderRadius: '8px',
                                    cursor: 'pointer'
                                }}
                            >
                                Отмена
                            </button>
                        </div>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gap: 12 }}>
                        {user?.avatar && (
                            <div>
                                <b>Аватар:</b>
                                <div style={{ marginTop: 8 }}>
                                    <img 
                                        src={user.avatar} 
                                        alt="Аватар" 
                                        style={{ width: 80, height: 80, borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                </div>
                            </div>
                        )}
                        <div><b>Телефон:</b> {user?.phone || '—'}</div>
                        <div><b>Имя пользователя:</b> {user?.username || '—'}</div>
                        <div><b>Полное имя:</b> {user?.full_name || '—'}</div>
                        <div><b>Имя:</b> {user?.first_name || '—'}</div>
                        <div><b>Фамилия:</b> {user?.last_name || '—'}</div>
                        <div><b>Последняя активность:</b> {user?.last_activity ? new Date(user.last_activity).toLocaleString() : '—'}</div>
                    </div>
                )}
            </Card>

            
        </div>
    );
};

export default Profile;