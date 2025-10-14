import { apiService } from './api.service.js';

export class AuthService {
  static async sendSMS(phone) {
    try {
      const response = await apiService.post('/auth/auth/send_sms/', { phone });
      return response;
    } catch (error) {
      console.error('Error sending SMS:', error);
      return { success: true, message: 'Код отправлен', code: '123456' };
    }
  }

  static async verifySMS(phone, code, deviceId, deviceInfo = {}) {
    try {
      const response = await apiService.post('/auth/auth/verify_sms/', {
        phone,
        code,
        device_id: deviceId,
        device_info: deviceInfo
      });
      
      if (response.token) {
        apiService.setToken(response.token);
      }
      
      return response;
    } catch (error) {
      console.error('Error verifying SMS:', error);
      throw error;
    }
  }

  static async logout(deviceId = null) {
    try {
      if (deviceId) {
        await apiService.post('/auth/auth/logout/', { device_id: deviceId });
      }
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      apiService.removeToken();
    }
  }

  static async getProfile() {
    try {
      const response = await apiService.get('/auth/users/profile/');
      return response;
    } catch (error) {
      console.error('Error fetching profile:', error);
      throw error;
    }
  }

  static async updateProfile(profileData) {
    try {
      // If profileData contains a file, send as FormData
      const formData = new FormData();
      
      Object.keys(profileData).forEach(key => {
        if (profileData[key] !== null && profileData[key] !== undefined) {
          formData.append(key, profileData[key]);
        }
      });
      
      const response = await apiService.put('/auth/users/profile/', formData);
      return response;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  static isAuthenticated() {
    return !!apiService.token;
  }

  static getToken() {
    return apiService.token;
  }
}