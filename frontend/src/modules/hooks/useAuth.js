import { useState, useEffect } from 'react';
import { AuthService } from '../services/auth.service.js';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        const profile = await AuthService.getProfile();
        setUser(profile);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      AuthService.logout();
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (phone, code, deviceId, deviceInfo = {}) => {
    try {
      setIsLoading(true);
      const response = await AuthService.verifySMS(phone, code, deviceId, deviceInfo);
      setUser(response.user);
      setIsAuthenticated(true);
      return response;
    } catch (error) {
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const sendVerificationCode = async (phone) => {
    return await AuthService.sendSMS(phone);
  };

  const logout = async (deviceId = null) => {
    await AuthService.logout(deviceId);
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = async (profileData) => {
    const updatedProfile = await AuthService.updateProfile(profileData);
    setUser(updatedProfile);
    return updatedProfile;
  };

  return {
    user,
    isLoading,
    isAuthenticated,
    login,
    sendVerificationCode,
    logout,
    updateProfile,
    checkAuth
  };
};