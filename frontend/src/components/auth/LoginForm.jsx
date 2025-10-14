import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../modules/hooks/useAuth.js';
import './LoginForm.css';

const LoginForm = ({ onSuccess }) => {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('phone');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const { sendVerificationCode, login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/Profile');
    }
  }, [isAuthenticated, navigate]);

  const formatPhone = (value) => {
    const digits = value.replace(/\D/g, '');
    const parts = [];
    let idx = 0;
    const leading = digits.startsWith('8') ? '7' : (digits.startsWith('7') ? '7' : '7');
    const rest = digits.replace(/^[78]?/, '');
    const a = rest.slice(0, 3);
    const b = rest.slice(3, 6);
    const c = rest.slice(6, 8);
    const d = rest.slice(8, 10);
    let out = `+${leading}`;
    if (a) out += ` (${a}`;
    if (a && a.length === 3) out += `)`;
    if (b) out += ` ${b}`;
    if (c) out += `-${c}`;
    if (d) out += `-${d}`;
    return out;
  };

  const normalizePhone = (value) => {
    const digits = value.replace(/\D/g, '');
    const national = digits.replace(/^([78])?/, '');
    return `+7${national.slice(0,10)}`;
  };

  const handlePhoneChange = (e) => {
    const raw = e.target.value;
    setPhone(formatPhone(raw));
  };

  const handlePhoneSubmit = async (e) => {
    e.preventDefault();
    if (!phone) return;

    setIsLoading(true);
    setError('');

    try {
      const normalized = normalizePhone(phone);
      await sendVerificationCode(normalized);
      setStep('code');
    } catch (err) {
      setError('Ошибка отправки кода');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCodeSubmit = async (e) => {
    e.preventDefault();
    if (!code) return;

    setIsLoading(true);
    setError('');

    try {
      const deviceId = 'web-' + Math.random().toString(36).substr(2, 9);
      const normalized = normalizePhone(phone);
      await login(normalized, code, deviceId);
      onSuccess?.();
    } catch (err) {
      const message = err?.data?.error || err?.message || 'Неверный код подтверждения';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = () => {
    setPhone('+79991234567');
    setCode('123456');
  };

  return (
    <div className="login-form">
      <h2>Вход в гид</h2>
      
      {step === 'phone' && (
        <form onSubmit={handlePhoneSubmit}>
          <div className="form-group">
            <label>Номер телефона</label>
            <input
              type="tel"
              value={phone}
              onChange={handlePhoneChange}
              placeholder="+7 (999) 123-45-67"
              required
            />
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Отправка...' : 'Получить код'}
          </button>

          <button type="button" onClick={handleDemoLogin} className="demo-btn">
            Демо вход (автозаполнение)
          </button>
        </form>
      )}

      {step === 'code' && (
        <form onSubmit={handleCodeSubmit}>
          <div className="form-group">
            <label>Код из SMS</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0,6))}
              placeholder="123456"
              maxLength={6}
              required
            />
            <small>В демо режиме используйте код 123456</small>
          </div>
          
          <button type="submit" disabled={isLoading}>
            {isLoading ? 'Вход...' : 'Войти'}
          </button>

          <button 
            type="button" 
            onClick={() => setStep('phone')}
            className="back-btn"
          >
            Назад
          </button>
        </form>
      )}

      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default LoginForm;